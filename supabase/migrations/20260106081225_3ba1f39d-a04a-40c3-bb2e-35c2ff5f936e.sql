-- Create trigger to automatically create wallet when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, credits_balance, cash_balance)
  VALUES (NEW.user_id, 0, 100000); -- Start buyers with 100,000 INR for demo
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Create trigger
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.carbon_credits;