// hooks/useCampaigns.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign } from '../types';

export default function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error: createError } = await supabase
        .from('campaigns')
        .insert({
          ...campaignData,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (createError) throw createError;
      await fetchCampaigns();
      return data;
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchCampaigns();
      return data;
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refetch: fetchCampaigns,
  };
}