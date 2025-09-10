import { createClient } from '@supabase/supabase-js'
import { Alert } from 'react-native'
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  Alert.alert("Env variables for backend not set!")
  throw new Error("SUPABASE_URL or SUPABASE_KEY is missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }
