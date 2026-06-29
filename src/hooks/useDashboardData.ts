// hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
// Remove type imports for now
// import type { Campaign, DashboardStats } from '../types';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL || 
  'https://nhxwetdfoclphlubbllt.supabase.co/functions/v1/send-email';

export function useDashboardData() {
  const [stats, setStats] = useState<any>({
    total_contacts: 0,
    emails_sent: 0,
    open_rate: 0,
    click_rate: 0,
    active_campaigns: 0,
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      const { count: contactsCount, error: contactsError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (contactsError) throw contactsError;

      const totalContacts = contactsCount || 0;
      const emailsSent = campaignsData?.reduce((sum: number, c: any) => sum + (c.sent_count || 0), 0) || 0;
      const activeCampaigns = campaignsData?.filter((c: any) => c.status === 'sending').length || 0;

      const totalSent = campaignsData?.reduce((sum: number, c: any) => sum + c.sent_count, 0) || 0;
      const totalOpens = campaignsData?.reduce((sum: number, c: any) => sum + c.open_count, 0) || 0;
      const totalClicks = campaignsData?.reduce((sum: number, c: any) => sum + c.click_count, 0) || 0;

      const openRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0;
      const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;

      setStats({
        total_contacts: totalContacts,
        emails_sent: emailsSent,
        open_rate: openRate,
        click_rate: clickRate,
        active_campaigns: activeCampaigns,
      });

      setCampaigns(campaignsData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      console.log('📧 Starting sendCampaign for ID:', campaignId);
      
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      if (!campaign) throw new Error('Campaign not found');

      console.log('📧 Campaign found:', campaign.name);

      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('status', 'active');

      if (contactsError) throw contactsError;
      if (!contacts?.length) throw new Error('No active contacts found to email');

      console.log(`📧 Found ${contacts.length} active contacts to send to`);

      const { data: { session } } = await supabase.auth.getSession();
      
      let successCount = 0;
      let failCount = 0;

      for (const contact of contacts) {
        try {
          console.log(`📧 Sending to ${contact.email}...`);
          
          const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              to: contact.email,
              subject: campaign.subject,
              html: campaign.body.replace(/{{first_name}}/g, contact.first_name || 'there'),
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to send to ${contact.email}:`, errorText);
            failCount++;
          } else {
            console.log(`✅ Sent to ${contact.email}`);
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Error sending to ${contact.email}:`, error);
          failCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 250));
      }

      console.log(`📧 Summary: ${successCount} sent, ${failCount} failed`);

      await supabase
        .from('campaigns')
        .update({
          status: 'completed',
          sent_count: successCount,
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaignId);

      console.log('✅ Campaign marked as completed!');
      await fetchData();
    } catch (err) {
      console.error('❌ Error sending campaign:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    campaigns,
    loading,
    error,
    sendCampaign,
    refetch: fetchData,
  };
}