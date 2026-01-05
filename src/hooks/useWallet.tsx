import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Wallet {
  id: string;
  user_id: string;
  credits_balance: number;
  cash_balance: number;
  updated_at: string;
}

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWallet();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('wallet-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new) {
              setWallet(payload.new as Wallet);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setWallet(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Wallet fetch error:', error);
      }

      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWallet = async (updates: { credits_balance?: number; cash_balance?: number }) => {
    if (!user || !wallet) return { error: 'No wallet found' };

    try {
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setWallet(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const addCredits = async (amount: number) => {
    if (!wallet) return { error: 'No wallet found' };
    return updateWallet({ credits_balance: wallet.credits_balance + amount });
  };

  const removeCredits = async (amount: number) => {
    if (!wallet) return { error: 'No wallet found' };
    if (wallet.credits_balance < amount) return { error: 'Insufficient credits' };
    return updateWallet({ credits_balance: wallet.credits_balance - amount });
  };

  const addCash = async (amount: number) => {
    if (!wallet) return { error: 'No wallet found' };
    return updateWallet({ cash_balance: wallet.cash_balance + amount });
  };

  const removeCash = async (amount: number) => {
    if (!wallet) return { error: 'No wallet found' };
    if (wallet.cash_balance < amount) return { error: 'Insufficient funds' };
    return updateWallet({ cash_balance: wallet.cash_balance - amount });
  };

  return {
    wallet,
    isLoading,
    refetch: fetchWallet,
    updateWallet,
    addCredits,
    removeCredits,
    addCash,
    removeCash,
  };
}
