// hooks/useContacts.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Contact, ContactInput } from '../types';

export default function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: ContactInput) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data, error: createError } = await supabase
        .from('contacts')
        .insert({
          ...contactData,
          user_id: userData.user.id,
          status: contactData.status || 'active',
          tags: contactData.tags || [],
          custom_fields: contactData.custom_fields || {},
        })
        .select()
        .single();

      if (createError) throw createError;
      await fetchContacts();
      return data;
    } catch (err) {
      console.error('Error creating contact:', err);
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchContacts();
      return data;
    } catch (err) {
      console.error('Error updating contact:', err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      throw err;
    }
  };

  const bulkCreateContacts = async (contactsData: ContactInput[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const contactsWithUser = contactsData.map((c) => ({
        ...c,
        user_id: userData.user.id,
        status: c.status || 'active',
        tags: c.tags || [],
        custom_fields: c.custom_fields || {},
      }));

      const { data, error } = await supabase
        .from('contacts')
        .insert(contactsWithUser)
        .select();

      if (error) throw error;
      await fetchContacts();
      return data;
    } catch (err) {
      console.error('Error bulk creating contacts:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    bulkCreateContacts,
    refetch: fetchContacts,
  };
}