import { createClient } from "@supabase/supabase-js";

// Adres projektu i publiczny klucz "anon" (bezpieczny w przeglądarce —
// dostęp chroni Row Level Security ustawione w bazie).
const SUPABASE_URL = "https://ruhdlobxqjfeboiofgne.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aGRsb2J4cWpmZWJvaW9mZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjEyODIsImV4cCI6MjA5Nzk5NzI4Mn0.6qF6RZPe4DmFwFLEMwPg-FTc6A3THZ3azAzxA3NrmRg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
