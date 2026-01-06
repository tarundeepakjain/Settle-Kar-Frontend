import { supabase } from "../utils/supabase";

export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
};

export const getUserDetails = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user details:", error.message);
    return null;
  }

  return user; // contains id, email, user_metadata, app_metadata, etc.
};