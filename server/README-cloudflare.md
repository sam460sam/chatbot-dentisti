# API della chat su Cloudflare Workers

Il server della chat (`GET /health`, `POST /chat`) gira come Cloudflare Worker
sul piano gratuito. Lo pubblica **Workers Builds** direttamente da GitHub: a ogni
push su `main` Cloudflare installa le dipendenze e lancia `npx wrangler deploy`
nella cartella `server/`. Niente da pubblicare a mano.

| File | A cosa serve |
| --- | --- |
| `wrangler.toml` | nome del Worker (`twinbyte-chatbot`), entry `src/worker.ts`, cron giornaliero, log, rate limiting |
| `src/worker.ts` | entry del Worker: `fetch` (l'API) e `scheduled` (pulizia giornaliera delle conversazioni) |
| `src/app.ts` | l'API vera e propria (Hono), uguale su Workers e su Node |
| `src/google-auth.ts` | token della service account Google firmato con WebCrypto (al posto di google-auth-library) |
| `src/index.ts` | entry Node facoltativa (`npm run dev`, `npm start`), non usata da Cloudflare |

## 1. Creare il Worker (una volta sola)

1. Entra su <https://dash.cloudflare.com> → **Workers & Pages** → **Create** (Create application).
2. Scegli **Import a repository** e collega GitHub se te lo chiede (autorizza l'app
   Cloudflare almeno per il repository `sam460sam/chatbot-dentisti`). Seleziona **chatbot-dentisti**.
3. Compila la configurazione:
   - **Project name / Worker name**: `twinbyte-chatbot`. Deve essere identico a `name` in
     `wrangler.toml`, altrimenti la build si ferma.
   - **Production branch**: `main`.
   - **Build command**: lascialo vuoto.
   - **Deploy command**: `npx wrangler deploy`.
   - **Root directory** (in *Advanced settings*, a volte chiamata *Path*): `server`.
   - Lascia il comando per gli altri branch così com'è (`npx wrangler versions upload`)
     oppure disattiva le build dei branch non di produzione.
4. **Deploy** (o *Save and Deploy*). La prima build installa le dipendenze (`npm ci` dal
   `package-lock.json`, Node 22 da `.node-version`) e pubblica il Worker. Verso la fine
   del log della build compaiono l'URL `https://twinbyte-chatbot.<tuo-sottodominio>.workers.dev`
   e la riga `schedule: 17 3 * * *` del cron.

Se Cloudflare usa una versione di Node più vecchia di 22 (wrangler la richiede),
aggiungi nelle impostazioni di build (Settings → Build → **Build variables**) la
variabile `NODE_VERSION` = `22`.

## 2. Le sei variabili

Dopo la prima build: Worker `twinbyte-chatbot` → **Settings** → **Variables and Secrets** → **Add**.
Sono le variabili del Worker in esecuzione: **non** vanno nelle *Build variables*, che
servono solo durante la build.

| Nome | Tipo | Valore |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | **Secret** | la chiave API Anthropic (`sk-ant-...`) |
| `SUPABASE_SERVICE_KEY` | **Secret** | la service role key del progetto Supabase |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **Secret** | tutto il contenuto del file JSON della service account, incollato così com'è |
| `CLAUDE_MODEL` | Text | lo stesso valore che c'era su Railway (es. `claude-sonnet-5`) |
| `SUPABASE_URL` | Text | `https://<progetto>.supabase.co` |
| `ALLOWED_ORIGINS` | Text | i siti che possono usare la chat, separati da virgola (vedi sotto) |

`ALLOWED_ORIGINS` (gli spazi dopo le virgole sono ammessi):

```
https://twinbyteservices.com,https://www.twinbyteservices.com,https://chatbot-dentisti.vercel.app
```

- `twinbyteservices.com` (con e senza `www`): il sito e le sue pagine demo.
- `chatbot-dentisti.vercel.app`: le pagine demo servite con il widget (`demo-it.html`, `demo-en.html`, `demo-nl.html`).
- Aggiungi gli altri domini che erano nel valore su Railway (per esempio `https://twinbyte.online`
  se è ancora online) e il sito di ogni studio cliente che usa il widget. Un dominio che
  manca non riceve gli header CORS e il browser blocca la chat su quel sito.

Salva con **Deploy**: le variabili valgono subito, senza rifare la build. `wrangler.toml`
ha `keep_vars = true`, quindi i deploy successivi (a ogni push) non cancellano le
variabili di tipo Text impostate dal dashboard; i Secret restano comunque.

Senza `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` le conversazioni restano in memoria: su
Workers ogni istanza ha la sua memoria e può sparire in qualsiasi momento, quindi il bot
perderebbe il filo tra un messaggio e l'altro. In produzione Supabase serve davvero.

## 3. Trovare l'URL

Worker `twinbyte-chatbot` → **Settings** → **Domains & Routes**: la riga `workers.dev`
mostra l'indirizzo, del tipo `https://twinbyte-chatbot.<tuo-sottodominio>.workers.dev`.
Se l'account non ha ancora un sottodominio workers.dev, Cloudflare chiede di sceglierlo
la prima volta (si cambia dalla pagina Workers & Pages, alla voce *Subdomain*).

Quell'URL va poi messo come `data-api` del widget al posto di
`https://chatbot-dentisti-production.up.railway.app` (in `src/site.ts` del sito e nelle
pagine demo del widget).

## 4. Provarlo

```sh
curl https://twinbyte-chatbot.<tuo-sottodominio>.workers.dev/health
# ok
```

Una domanda vera al bot (sostituisci l'URL; l'Origin deve essere in `ALLOWED_ORIGINS`):

```sh
curl -i https://twinbyte-chatbot.<tuo-sottodominio>.workers.dev/chat \
  -H "Origin: https://twinbyteservices.com" \
  -H "content-type: application/json" \
  -d '{"studioId":"twinbyte","sessionId":"s_test_1","message":"Hi, what do you do?"}'
# HTTP/2 200, access-control-allow-origin: https://twinbyteservices.com, {"reply":"..."}
```

Un `500 Internal Server Error` qui vuol dire quasi sempre chiave Anthropic mancante o
sbagliata: il motivo è nei log (Worker → **Observability** / **Logs**).

## Cosa cambia rispetto a Railway

- **API identica** per il widget: stessi percorsi, stesse risposte JSON, stessi codici
  (404 studio non trovato, 400, 429 con il messaggio "Troppi messaggi…", 500), stesso CORS.
- **Pulizia delle conversazioni** (più vecchie di 30 giorni): non più `setInterval` ma un
  Cron Trigger alle 03:17 UTC ogni giorno (Settings → **Triggers**).
- **Limite di richieste**: le stesse regole (10 al minuto e 80 al giorno per conversazione,
  30 al minuto e 300 al giorno per IP). Il conteggio in memoria vale per singola istanza
  del Worker; per questo i limiti al minuto passano anche dal binding gratuito
  **Workers Rate Limiting** (`[[ratelimits]]` in `wrangler.toml`), che conta per tutte le
  istanze nella stessa località Cloudflare. I limiti al giorno restano per istanza, quindi
  indicativi. Le variabili facoltative `RL_SESSION_PER_MIN`, `RL_IP_PER_MIN`,
  `RL_SESSION_PER_DAY`, `RL_IP_PER_DAY` cambiano solo il conteggio in memoria: i limiti
  del binding si cambiano in `wrangler.toml`. Se un giorno il deploy rifiutasse i blocchi
  `[[ratelimits]]`, si possono togliere: il codice continua con il solo conteggio in memoria.
- **Piano gratuito**: 100.000 richieste al giorno e 10 ms di CPU per richiesta. L'attesa
  delle risposte di Anthropic, Supabase e Google non conta come CPU; il prompt di sistema
  si costruisce una volta per istanza.
- **Google Calendar**: stesse chiamate (freeBusy ed eventi) con lo stesso scope
  `https://www.googleapis.com/auth/calendar`; il token si chiede a
  `https://oauth2.googleapis.com/token` e si riusa fino a 5 minuti prima della scadenza.

## Sviluppo in locale

```sh
cd server
npm ci
cp .dev.vars.example .dev.vars   # metti le chiavi vere; .dev.vars non va su git
npm run dev:worker               # wrangler dev su http://localhost:8787
npm test                         # test della firma JWT e della chiamata a Google Calendar
npm run build                    # controllo dei tipi (tsc)
npx wrangler deploy --dry-run --outdir dist-worker   # prova il bundle senza pubblicare
```

Per provare il cron in locale: `npx wrangler dev --test-scheduled` e poi
`curl "http://localhost:8787/__scheduled?cron=17+3+*+*+*"`.
