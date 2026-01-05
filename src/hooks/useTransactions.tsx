import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Transaction {
  id: string;
  credit_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  amount: number;
  price_per_unit: number;
  total_value: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  // Joined data
  credit_type?: string;
  buyer_name?: string;
  seller_name?: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
          },
          () => {
            fetchTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          carbon_credits (credit_type)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(t => ({
        ...t,
        credit_type: t.carbon_credits?.credit_type,
      }));
      
      setTransactions(formattedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (transaction: {
    credit_id: string;
    seller_id: string;
    amount: number;
    price_per_unit: number;
    total_value: number;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          credit_id: transaction.credit_id,
          buyer_id: user.id,
          seller_id: transaction.seller_id,
          amount: transaction.amount,
          price_per_unit: transaction.price_per_unit,
          total_value: transaction.total_value,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      setTransactions(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const getTransactionStats = () => {
    const completed = transactions.filter(t => t.status === 'completed');
    const pending = transactions.filter(t => t.status === 'pending');
    const processing = transactions.filter(t => t.status === 'processing');
    
    const totalVolume = completed.reduce((sum, t) => sum + t.total_value, 0);
    const totalCredits = completed.reduce((sum, t) => sum + t.amount, 0);

    return {
      total: transactions.length,
      completed: completed.length,
      pending: pending.length,
      processing: processing.length,
      totalVolume,
      totalCredits,
    };
  };

  return {
    transactions,
    isLoading,
    refetch: fetchTransactions,
    createTransaction,
    getTransactionStats,
  };
}
