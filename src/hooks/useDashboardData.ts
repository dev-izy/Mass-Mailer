// hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign, DashboardStats } from '../types';

export default function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    total_contacts: 0,
    emails_sent: 0,
    open_rate: 0,
    click_rate: 0,
    active_campaigns: 0,
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Fetch contacts count
      const { count: contactsCount, error: contactsError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (contactsError) throw contactsError;

      const totalContacts = contactsCount || 0;
      const emailsSent = campaignsData?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
      const activeCampaigns = campaignsData?.filter(c => c.status === 'sending').length || 0;

      // Calculate rates from actual data
      const totalSent = campaignsData?.reduce((sum, c) => sum + c.sent_count, 0) || 0;
      const totalOpens = campaignsData?.reduce((sum, c) => sum + c.open_count, 0) || 0;
      const totalClicks = campaignsData?.reduce((sum, c) => sum + c.click_count, 0) || 0;

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
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      if (!campaign) throw new Error('Campaign not found');

      // Get contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*');

      if (contactsError) throw contactsError;
      if (!contacts?.length) throw new Error('No contacts found');

      // Send emails via backend
      for (const contact of contacts) {
        const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contact.email,
            subject: campaign.subject,
            html: campaign.body.replace(
              /{{first_name}}/g,
              contact.first_name || 'there'
            ),
          }),
        });

        if (!response.ok) {
          console.error(`Failed to send to ${contact.email}`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      // Update campaign status
      await supabase
        .from('campaigns')
        .update({
          status: 'completed',
          sent_count: contacts.length,
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaignId);

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error sending campaign:', err);
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