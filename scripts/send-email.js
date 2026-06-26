import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Initialize Resend with your API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('📧 Email processor started');
console.log('🔑 Resend API Key:', RESEND_API_KEY ? '✅ Set' : '❌ Missing');

async function processEmails() {
  console.log('\n📧 Processing email queue...');
  console.log('🕐', new Date().toISOString());
  
  try {
    // Get pending emails
    const { data: emails, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching emails:', error);
      return;
    }

    if (!emails?.length) {
      console.log('📭 No pending emails');
      return;
    }

    console.log(`📧 Found ${emails.length} pending emails`);

    for (const email of emails) {
      try {
        console.log(`\n📧 Sending email to: ${email.recipient}`);
        console.log(`📧 Subject: ${email.subject}`);
        
        // Update to processing
        await supabase
          .from('email_queue')
          .update({ 
            status: 'processing',
            attempts: email.attempts + 1
          })
          .eq('id', email.id);

        // ACTUALLY SEND THE EMAIL with Resend
        const { data, error: sendError } = await resend.emails.send({
          from: 'Mass Mailer <onboarding@resend.dev>',
          to: [email.recipient],
          subject: email.subject,
          html: email.body,
        });

        if (sendError) {
          console.error('❌ Resend error:', sendError);
          throw new Error(sendError.message);
        }

        // Mark as sent
        await supabase
          .from('email_queue')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
            message_id: data?.id
          })
          .eq('id', email.id);

        console.log(`✅ Email sent successfully to ${email.recipient}`);
        console.log(`📧 Message ID: ${data?.id}`);
      } catch (error) {
        console.error(`❌ Failed to send to ${email.recipient}:`, error.message);
        
        await supabase
          .from('email_queue')
          .update({ 
            status: 'failed',
            error: error.message,
            attempts: email.attempts + 1
          })
          .eq('id', email.id);
      }
    }
  } catch (error) {
    console.error('❌ Error processing queue:', error);
  }
}

// Run once immediately
processEmails();

// Then run every 30 seconds
setInterval(processEmails, 30000);
