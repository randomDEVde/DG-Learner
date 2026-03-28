export default function PwaInstallPanel({
  canInstall,
  isInstalled,
  onInstall,
}) {
  const statusLabel = isInstalled
    ? "Bereits installiert"
    : canInstall
      ? "Installierbar"
      : "Im Browser nutzbar";

  return (
    <section className="rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/14 to-white/8 p-6 shadow-panel backdrop-blur-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-sand/60">PWA</p>
      <h2 className="mt-3 font-display text-3xl text-white">Installation</h2>
      <p className="mt-3 text-sm leading-6 text-sand/75">
        Die Web-App bleibt der Hauptweg für dieses Projekt und kann auf dem Desktop als
        eigenständige Anwendung installiert werden.
      </p>

      <div className="mt-5 inline-flex rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sand/70">
        {statusLabel}
      </div>

      <div className="mt-5 space-y-3 text-sm text-sand/75">
        {isInstalled && <p>Die Anwendung läuft bereits im installierten App-Modus.</p>}
        {canInstall && !isInstalled && (
          <p>
            Auf kompatiblen Browsern kannst du die App direkt aus dem Browserfenster heraus
            installieren.
          </p>
        )}
        {!canInstall && !isInstalled && (
          <p>
            Für den Installationsbutton muss die App als Vorschau oder über HTTPS laufen.
            Im reinen Entwicklungsmodus des Vite-Servers erscheint die Browser-Installation oft
            nicht, obwohl die Web-App selbst normal funktioniert.
          </p>
        )}
      </div>

      {canInstall && !isInstalled && (
        <button
          type="button"
          onClick={onInstall}
          className="mt-5 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
        >
          App installieren
        </button>
      )}
    </section>
  );
}
