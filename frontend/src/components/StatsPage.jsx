import { getBranchLabel, getCategoryLabel } from "../utils/logic";

export default function StatsPage({ session, onBack }) {
  const labels = {
    "image-input": "Bild mit Texteingabe",
    "image-choice": "Bild mit Auswahl",
    "text-choice": "Text mit Bildauswahl",
    organigram: "Organigramm",
  };

  const byBranch = session.history.reduce((acc, entry) => {
    const key = entry.branch;
    if (!acc[key]) {
      acc[key] = { answered: 0, correct: 0, helped: 0 };
    }
    acc[key].answered += 1;
    if (entry.outcome === "correct") {
      acc[key].correct += 1;
    }
    if (entry.helped) {
      acc[key].helped += 1;
    }
    return acc;
  }, {});

  const byMode = session.history.reduce((acc, entry) => {
    if (!acc[entry.mode]) {
      acc[entry.mode] = { answered: 0, correct: 0 };
    }
    acc[entry.mode].answered += 1;
    if (entry.outcome === "correct") {
      acc[entry.mode].correct += 1;
    }
    return acc;
  }, {});

  const byCategory = session.history.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = { answered: 0, correct: 0 };
    }
    acc[entry.category].answered += 1;
    if (entry.outcome === "correct") {
      acc[entry.category].correct += 1;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sand/60">Statistik</p>
          <h2 className="mt-2 font-display text-3xl text-white">Lernstand im Browser</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
        >
          Zur Startseite
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Erfolgsquote je Teilstreitkraft</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byBranch).length ? (
              Object.entries(byBranch).map(([branch, stats]) => (
                <div key={branch} className="rounded-2xl bg-black/25 p-4">
                  <div className="flex items-center justify-between text-white">
                    <span>{getBranchLabel(branch)}</span>
                    <span>{stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0}%</span>
                  </div>
                  <p className="mt-1 text-sm text-sand/65">
                    {stats.correct} richtig, {stats.helped} mit Hilfe, {stats.answered} gesamt
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-sand/70">Noch keine Ergebnisse vorhanden.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Erfolgsquote je Modus</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byMode).length ? (
              Object.entries(byMode).map(([mode, stats]) => (
                <div key={mode} className="rounded-2xl bg-black/25 p-4">
                  <div className="flex items-center justify-between text-white">
                    <span>{labels[mode] ?? mode}</span>
                    <span>{stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0}%</span>
                  </div>
                  <p className="mt-1 text-sm text-sand/65">
                    {stats.correct} von {stats.answered} korrekt beantwortet
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-sand/70">Noch keine Ergebnisse vorhanden.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Erfolgsquote je Kategorie</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(byCategory).length ? (
              Object.entries(byCategory).map(([category, stats]) => (
                <div key={category} className="rounded-2xl bg-black/25 p-4">
                  <div className="flex items-center justify-between text-white">
                    <span>{getCategoryLabel(category)}</span>
                    <span>{stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0}%</span>
                  </div>
                  <p className="mt-1 text-sm text-sand/65">
                    {stats.correct} von {stats.answered} korrekt beantwortet
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-sand/70">Noch keine Ergebnisse vorhanden.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
