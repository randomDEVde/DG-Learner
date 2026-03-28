const OPTIONS = [
  { id: "again", label: "Nochmal", note: "Wieder in etwa 1 Minute" },
  { id: "hard", label: "Schlecht", note: "Wieder in etwa 6 Minuten" },
  { id: "good", label: "Gut", note: "Wieder in etwa 10 Minuten" },
  { id: "easy", label: "Einfach", note: "Wieder in etwa 3 Tagen" },
];

export default function ReviewPanel({ visible, onRate }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-brass/35 bg-brass/10 p-4">
      <p className="text-sm uppercase tracking-[0.24em] text-sand/60">Spaced Repetition</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Wie sicher war diese Karte?</h3>
      <p className="mt-2 text-sm text-sand/75">
        Bitte bewerte die letzte Aufgabe, bevor du zur nächsten Karte gehst.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onRate(option.id)}
            className="rounded-2xl border border-white/15 bg-black/20 p-4 text-left transition hover:border-brass/60"
          >
            <p className="font-semibold text-white">{option.label}</p>
            <p className="mt-1 text-sm text-sand/70">{option.note}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
