import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CarbonCredit {
  id: string;
  seller_id: string;
  credit_type: string;
  crop_type: string | null;
  location: string | null;
  amount: number;
  price_per_unit: number;
  status: string;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  seller_name?: string;
  seller_state?: string;
  seller_district?: string;
  distance?: number;
}

export function useListings() {
  const { user, role } = useAuth();
  const [listings, setListings] = useState<CarbonCredit[]>([]);
  const [myListings, setMyListings] = useState<CarbonCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchListings();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('listings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'carbon_credits',
          },
          () => {
            fetchListings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, role]);

  const fetchListings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch verified listings for marketplace (buyers)
      if (role === 'buyer') {
        const { data, error } = await supabase
          .from('carbon_credits')
          .select('*')
          .eq('status', 'verified')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      }

      // Fetch user's own listings (sellers)
      if (role === 'seller') {
        const { data, error } = await supabase
          .from('carbon_credits')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMyListings(data || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (listing: {
    credit_type: string;
    crop_type?: string;
    location?: string;
    amount: number;
    price_per_unit: number;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('carbon_credits')
        .insert({
          seller_id: user.id,
          credit_type: listing.credit_type,
          crop_type: listing.crop_type || null,
          location: listing.location || null,
          amount: listing.amount,
          price_per_unit: listing.price_per_unit,
          status: 'pending', // Needs admin verification
        })
        .select()
        .single();

      if (error) throw error;
      
      setMyListings(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const updateListing = async (id: string, updates: Partial<CarbonCredit>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('carbon_credits')
        .update(updates)
        .eq('id', id)
        .eq('seller_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setMyListings(prev => prev.map(l => l.id === id ? data : l));
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  return {
    listings,
    myListings,
    isLoading,
    refetch: fetchListings,
    createListing,
    updateListing,
  };
}
