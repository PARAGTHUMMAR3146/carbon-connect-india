import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PendingListing {
  id: string;
  seller_id: string;
  credit_type: string;
  crop_type: string | null;
  location: string | null;
  amount: number;
  price_per_unit: number;
  status: string;
  created_at: string;
  // Joined profile data
  seller_name?: string;
  seller_phone?: string;
  seller_state?: string;
  seller_district?: string;
}

export interface UserInfo {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  state: string | null;
  district: string | null;
  company_name: string | null;
  role: string;
  created_at: string;
}

export function useAdmin() {
  const { user, role } = useAuth();
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [allListings, setAllListings] = useState<PendingListing[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    pendingVerifications: 0,
    verifiedCredits: 0,
    totalTransactions: 0,
  });

  const isAdmin = role === 'admin';

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('admin-listings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'carbon_credits',
          },
          () => {
            fetchAdminData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    if (!user || !isAdmin) return;
    
    setIsLoading(true);
    try {
      // Fetch all listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('carbon_credits')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      // Fetch profiles for seller info
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      // Fetch user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*');

      // Map listings with seller info
      const listingsWithSellers = (listingsData || []).map(listing => {
        const profile = profilesData?.find(p => p.user_id === listing.seller_id);
        return {
          ...listing,
          seller_name: profile?.full_name || 'Unknown',
          seller_phone: profile?.phone || '',
          seller_state: profile?.state || '',
          seller_district: profile?.district || '',
        };
      });

      setAllListings(listingsWithSellers);
      setPendingListings(listingsWithSellers.filter(l => l.status === 'pending'));

      // Map users with roles
      const usersWithRoles = (profilesData || []).map(profile => {
        const userRole = rolesData?.find(r => r.user_id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          phone: profile.phone,
          state: profile.state,
          district: profile.district,
          company_name: profile.company_name,
          role: userRole?.role || 'buyer',
          created_at: profile.created_at,
        };
      });
      setUsers(usersWithRoles);

      // Calculate stats
      const { count: txnCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: profilesData?.length || 0,
        totalSellers: rolesData?.filter(r => r.role === 'seller').length || 0,
        totalBuyers: rolesData?.filter(r => r.role === 'buyer').length || 0,
        pendingVerifications: listingsWithSellers.filter(l => l.status === 'pending').length,
        verifiedCredits: listingsWithSellers.filter(l => l.status === 'verified').reduce((sum, l) => sum + l.amount, 0),
        totalTransactions: txnCount || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyListing = async (listingId: string) => {
    if (!user || !isAdmin) return { error: 'Not authorized' };

    try {
      const { error } = await supabase
        .from('carbon_credits')
        .update({
          status: 'verified',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', listingId);

      if (error) throw error;
      
      await fetchAdminData();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const rejectListing = async (listingId: string) => {
    if (!user || !isAdmin) return { error: 'Not authorized' };

    try {
      const { error } = await supabase
        .from('carbon_credits')
        .update({
          status: 'rejected',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', listingId);

      if (error) throw error;
      
      await fetchAdminData();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    isAdmin,
    pendingListings,
    allListings,
    users,
    stats,
    isLoading,
    verifyListing,
    rejectListing,
    refetch: fetchAdminData,
  };
}
