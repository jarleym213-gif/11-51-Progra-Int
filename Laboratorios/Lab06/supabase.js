
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://xaviqhxqsaslxocjdobz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhdmlxaHhxc2FzbHhvY2pkb2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Njc5NjAsImV4cCI6MjA4NzA0Mzk2MH0.VCvSU38aOuCjRtsuKTR49C3QCfKyt5zB7LNS5kVpyJw';

export const supabase = createClient(supabaseUrl, supabaseKey);