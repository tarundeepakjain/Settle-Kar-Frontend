import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = "https://ssymorpmlapwohoccxub.supabase.co";
const supabasePublishableKey = "sb_publishable_hTz8aPV3rLyK0WHRSd4VSw_3V7z8pDe";

const storage =
  Platform.OS === 'web'
    ? undefined // Supabase will automatically use localStorage on web
    : AsyncStorage;
  
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage:storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})