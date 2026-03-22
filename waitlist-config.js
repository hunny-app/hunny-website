/**
 * Hunny waitlist — connect your Supabase project (free tier is fine).
 *
 * 1) New project: https://supabase.com/dashboard
 * 2) SQL → New query → run:
 *
 *    create table public.waitlist_signups (
 *      id uuid primary key default gen_random_uuid(),
 *      email text not null,
 *      name text,
 *      created_at timestamptz not null default now()
 *    );
 *    create unique index waitlist_signups_email_lower
 *      on public.waitlist_signups (lower(email));
 *    alter table public.waitlist_signups enable row level security;
 *    create policy "anon_insert_waitlist"
 *      on public.waitlist_signups for insert to anon with check (true);
 *
 * 3) Project Settings → API: copy Project URL and anon public key into below.
 * 4) Retrieve signups: Table Editor → waitlist_signups → Export, or run SQL in SQL Editor.
 *
 * The anon key is safe in the browser when RLS only allows INSERT (no SELECT for anon).
 */
window.HUNNY_WAITLIST = {
  supabaseUrl: "https://vdfunrdkvhyodestlorp.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZnVucmRrdmh5b2Rlc3Rsb3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNTMxNDQsImV4cCI6MjA4OTcyOTE0NH0.w12G29GM3qLg5ETWWJEqbaIAqfKl5eBX6xLzbzMYFJg",
};
