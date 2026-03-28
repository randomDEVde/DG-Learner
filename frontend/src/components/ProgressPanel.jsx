export default function ProgressPanel({ session }) {
  const successRate = session.answered
    ? Math.round((session.correct / session.answered) * 100)
    : 0;

  const cards = [
    ["Bearbeitet", session.answered],
    ["Richtig", session.correct],
    ["Falsch", session.wrong],
    ["Mit Hilfe", session.helped],
    ["Quote", `${successRate}%`],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-sand/50">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
