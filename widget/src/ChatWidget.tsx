import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string };

type Props = {
  studioId: string;
  apiUrl: string;
  color: string;
  privacyUrl: string;
  studioName: string;
  /** codice lingua dell'interfaccia; per le lingue senza traduzione si usa l'inglese */
  lang: string;
  /** primo messaggio, se lo studio ne vuole uno diverso da quello di default */
  hello?: string;
  /** logo da mostrare sul pulsante della chat, al posto dell'icona di default */
  logo?: string;
};

const T = {
  it: { title: (n: string) => `Assistente di ${n}`, notice: "Sei in chat con un assistente virtuale, non con una persona.", privacy: "Informativa privacy", hello: (n: string) => `Ciao! Posso darti informazioni su ${n} o fissare un appuntamento. Come posso aiutarti?`, typing: "Sto scrivendo…", placeholder: "Scrivi un messaggio", send: "Invia", open: "Chat", offline: "Non riesco a collegarmi. Riprova tra poco o chiama lo studio." },
  nl: { title: (n: string) => `Assistent van ${n}`, notice: "Je chat met een virtuele assistent, niet met een persoon.", privacy: "Privacyverklaring", hello: (n: string) => `Hallo! Ik kan je informatie geven over ${n} of een afspraak inplannen. Waarmee kan ik helpen?`, typing: "Aan het typen…", placeholder: "Typ een bericht", send: "Verstuur", open: "Chat", offline: "Geen verbinding. Probeer het zo opnieuw of bel de praktijk." },
  en: { title: (n: string) => `${n} assistant`, notice: "You are chatting with a virtual assistant, not a person.", privacy: "Privacy notice", hello: (n: string) => `Hi! I can answer questions about ${n} or book an appointment. How can I help?`, typing: "Typing…", placeholder: "Type a message", send: "Send", open: "Chat", offline: "Can't connect. Try again shortly or call the practice." },
};

const sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function ChatWidget({ studioId, apiUrl, privacyUrl, studioName, lang, hello, logo }: Props) {
  const t = T[lang.slice(0, 2).toLowerCase() as keyof typeof T] ?? T.en;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: hello || t.hello(studioName) },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const isMobile = () => window.matchMedia("(max-width: 480px)").matches;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open]);

  useEffect(() => {
    if (!open) return;
    if (!isMobile()) { inputRef.current?.focus(); return; }
    // mobile: blocca lo scroll della pagina e adatta l'altezza alla tastiera
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const vv = window.visualViewport;
    const fit = () => {
      if (panelRef.current && vv) {
        panelRef.current.style.height = `${vv.height}px`;
        panelRef.current.style.top = `${vv.offsetTop}px`;
      }
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    };
    fit();
    vv?.addEventListener("resize", fit);
    vv?.addEventListener("scroll", fit);
    return () => {
      document.body.style.overflow = prevOverflow;
      vv?.removeEventListener("resize", fit);
      vv?.removeEventListener("scroll", fit);
    };
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ studioId, sessionId, message: text }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply ?? data.error ?? "Risposta vuota." }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: t.offline }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dc">
      {open && (
        <section className="dc-panel" ref={panelRef} aria-label="Chat con l'assistente">
          <header className="dc-head">
            <div>
              <strong>{t.title(studioName)}</strong>
              <p className="dc-notice">
                {t.notice}{" "}
                <a href={privacyUrl} target="_blank" rel="noreferrer">{t.privacy}</a>
              </p>
            </div>
            <button className="dc-close" onClick={() => setOpen(false)} aria-label="Chiudi chat">×</button>
          </header>

          <div className="dc-list" ref={listRef} role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`dc-msg dc-${m.role}`}>{m.text}</div>
            ))}
            {busy && <div className="dc-msg dc-bot dc-typing">{t.typing}</div>}
          </div>

          <form
            className="dc-input"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              aria-label="Messaggio"
              maxLength={500}
            />
            <button type="submit" disabled={busy || !input.trim()}>{t.send}</button>
          </form>
        </section>
      )}

      <button
        className={`dc-launcher${open ? " dc-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t.open}
        title={t.open}
      >
        {open ? (
          <span className="dc-x" aria-hidden="true">×</span>
        ) : logo ? (
          <img className="dc-logo" src={logo} alt="" />
        ) : (
          /* Nessun logo configurato: icona di chat, non la parola "Chat" */
          <svg className="dc-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
