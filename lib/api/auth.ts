import { supabase } from '../supabaseClient';

export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error in loginAdmin:', error.message);
    throw error;
  }
  return data;
};

export const logoutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error in logoutAdmin:', error.message);
    throw error;
  }
  return true;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session;
};
