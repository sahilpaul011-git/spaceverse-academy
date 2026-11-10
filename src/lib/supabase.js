import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export let supabase = null;
export let supabaseConfigError = null;

if (!supabaseUrl || !supabaseKey) {
  supabaseConfigError =
    'Supabase URL or publishable key is missing from the website build.';
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    supabaseConfigError =
      error.message || 'Supabase could not be initialized.';
    console.error('SpaceVerse Supabase initialization:', error);
  }
}

if (!supabase) {
  console.error('SpaceVerse authentication unavailable:', supabaseConfigError);
}