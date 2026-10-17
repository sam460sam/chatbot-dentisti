-- Limite giornaliero dei messaggi della chat (vedi src/ratelimit.ts).
-- Da eseguire una volta nel SQL editor di Supabase (lo stesso progetto della tabella "sessions").
-- Si può rieseguire senza danni.
--
-- Una riga per chiave e giorno UTC: "s:<sessionId>" conta i messaggi di una conversazione,
-- "i:<ip>" quelli di un indirizzo IP. Il cron giornaliero del Worker cancella le righe
-- dei giorni passati.

create table if not exists public.rate_hits (
  key text not null,
  day date not null,
  hits int not null,
  primary key (key, day)
);

-- RLS attiva e nessuna policy: con la chiave anon la tabella non si legge e non si scrive.
-- Il server usa la service key, che passa comunque.
alter table public.rate_hits enable row level security;
revoke all on table public.rate_hits from anon, authenticated;

-- Conta un messaggio per la chiave k e restituisce il totale di oggi, in un solo comando
-- (resta giusto anche con più richieste nello stesso istante).
create or replace function public.rate_hit(k text) returns int
language sql
set search_path = ''
as $$
  insert into public.rate_hits as r (key, day, hits)
  values (k, (now() at time zone 'utc')::date, 1)
  on conflict (key, day) do update set hits = r.hits + 1
  returning hits
$$;

-- La chiama solo il server (service_role), non chi visita il sito.
revoke execute on function public.rate_hit(text) from public, anon, authenticated;
grant execute on function public.rate_hit(text) to service_role;
