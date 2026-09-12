import { createRoot } from "react-dom/client";
import { ChatWidget } from "./ChatWidget";
import css from "./styles.css?inline";

const script =
  (document.currentScript as HTMLScriptElement | null) ??
  document.querySelector<HTMLScriptElement>("script[data-studio]");

const config = {
  studioId: script?.dataset.studio ?? "demo",
  apiUrl: (script?.dataset.api ?? "").replace(/\/$/, ""),
  color: script?.dataset.color ?? "#1f6f8b",
  privacyUrl: script?.dataset.privacy ?? "#",
  studioName: script?.dataset.name ?? "lo studio",
  lang: (script?.dataset.lang ?? "it") as "it" | "nl" | "en",
};

const host = document.createElement("div");
host.id = "dentist-chat-host";
document.body.appendChild(host);

const shadow = host.attachShadow({ mode: "open" });
const style = document.createElement("style");
style.textContent = css;
shadow.appendChild(style);

const mount = document.createElement("div");
mount.style.setProperty("--dc-accent", config.color);
shadow.appendChild(mount);

createRoot(mount).render(<ChatWidget {...config} />);
