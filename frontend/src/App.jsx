import { useEffect, useMemo, useState } from "react";
import BranchSelector from "./components/BranchSelector";
import FeedbackMessage from "./components/FeedbackMessage";
import ModeSelector from "./components/ModeSelector";
import OrganigramBoard from "./components/OrganigramBoard";
import PwaInstallPanel from "./components/PwaInstallPanel";
import ProgressPanel from "./components/ProgressPanel";
import RankImage from "./components/RankImage";
import StatsPage from "./components/StatsPage";
import { usePwaInstall } from "./hooks/usePwaInstall";
import { usePersistentState } from "./hooks/usePersistentState";
import { BRANCHES } from "./data/ranks";
import {
  autoPlaceNext,
  createTask,
  gradeTask,
  placeOnOrganigram,
  revealOrganigramStep,
} from "./utils/logic";

function App() {
  const { state, setState, reset } = usePersistentState();
  const { canInstall, install, isInstalled, showIosHint } = usePwaInstall();
  const [inputValue, setInputValue] = useState("");
  const activeTask = state.currentTask;

  const selectedBranchLabels = useMemo(
    () =>
      BRANCHES.filter((branch) => state.selectedBranches.includes(branch.id))
        .map((branch) => branch.label)
        .join(", "),
    [state.selectedBranches],
  );

  const modeLabel = useMemo(
    () =>
      ({
        "image-input": "Bild -> Dienstgrad eingeben",
        "image-choice": "Bild -> richtigen Klartext waehlen",
        "text-choice": "Klartext -> richtiges Bild waehlen",
        organigram: "Organigramm einordnen",
      })[state.selectedMode] ?? state.selectedMode,
    [state.selectedMode],
  );

  useEffect(() => {
    if (activeTask?.mode !== "image-input") {
      setInputValue("");
    }
  }, [activeTask]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetView = params.get("view");

    if (targetView === "stats") {
      setState((current) => ({ ...current, currentView: "stats" }));
      return;
    }

    if (targetView === "training") {
      setState((current) => ({
        ...current,
        currentView: "training",
        currentTask:
          current.currentTask && current.currentView === "training"
            ? current.currentTask
            : createTask(current.selectedMode, current.selectedBranches),
      }));
    }
  }, [setState]);

  const updateSession = (entry) => {
    setState((current) => ({
      ...current,
      session: {
        ...current.session,
        answered: current.session.answered + 1,
        correct: current.session.correct + (entry.outcome === "correct" ? 1 : 0),
        wrong: current.session.wrong + (entry.outcome === "wrong" ? 1 : 0),
        helped: current.session.helped + (entry.helped ? 1 : 0),
        history: [entry, ...current.session.history].slice(0, 100),
      },
    }));
  };

  const startTraining = () => {
    const currentTask = createTask(state.selectedMode, state.selectedBranches);
    setState((current) => ({
      ...current,
      currentTask,
      currentView: "training",
      currentFeedback: null,
    }));
  };

  const moveToNextTask = () => {
    const currentTask = createTask(state.selectedMode, state.selectedBranches);
    setState((current) => ({
      ...current,
      currentTask,
      currentFeedback: null,
    }));
  };

  const showSolution = () => {
    if (!activeTask) {
      return;
    }

    if (activeTask.mode === "organigram") {
      const hint = revealOrganigramStep(activeTask);
      if (!hint) {
        return;
      }
      setState((current) => ({
        ...current,
        currentFeedback: {
          status: "hint",
          message: "Der markierte Slot ist der nächste korrekte Platz.",
          slotKey: hint.slotKey,
        },
      }));
      return;
    }

    const message =
      activeTask.mode === "text-choice" || activeTask.mode === "image-choice"
        ? "Die richtige Auswahl ist markiert."
        : `Lösung: ${activeTask.correct.name}`;

    setState((current) => ({
      ...current,
      currentFeedback: {
        status: "hint",
        message,
        solution: activeTask.correct.id,
      },
    }));
  };

  const handleSubmit = () => {
    if (!activeTask) {
      return;
    }
    const result = gradeTask(activeTask, { answer: inputValue });
    const helped = state.currentFeedback?.status === "hint";
    updateSession({
      branch: activeTask.correct.branch,
      mode: activeTask.mode,
      outcome: result.isCorrect ? "correct" : "wrong",
      helped,
    });
    setState((current) => ({
      ...current,
      currentFeedback: {
        status: result.status,
        message: result.isCorrect
          ? "Richtig erkannt."
          : `Noch nicht korrekt. Gesucht war: ${activeTask.correct.name}`,
      },
    }));
  };

  const handleChoice = (answerId) => {
    if (!activeTask) {
      return;
    }
    const result = gradeTask(activeTask, { answerId });
    const helped = state.currentFeedback?.status === "hint";
    updateSession({
      branch: activeTask.correct.branch,
      mode: activeTask.mode,
      outcome: result.isCorrect ? "correct" : "wrong",
      helped,
    });
    setState((current) => ({
      ...current,
      currentFeedback: {
        status: result.status,
        message: result.isCorrect
          ? "Treffer."
          : `Nicht ganz. Richtig ist: ${activeTask.correct.name}`,
        solution: helped ? activeTask.correct.id : undefined,
      },
    }));
  };

  const handleOrganigramPlace = (rankId, slotKey) => {
    if (!activeTask) {
      return;
    }

    const result = placeOnOrganigram(activeTask, rankId, slotKey);
    if (!result.isCorrect) {
      setState((current) => ({
        ...current,
        currentFeedback: {
          status: "wrong",
          message: "Diese Zuordnung passt noch nicht.",
        },
      }));
      return;
    }

    const helped = state.currentFeedback?.status === "hint";
    updateSession({
      branch: slotKey.split("-")[0],
      mode: "organigram",
      outcome: "correct",
      helped,
    });

    setState((current) => ({
      ...current,
      currentTask: result.nextTask,
      currentFeedback: {
        status: "correct",
        message: result.nextTask.solved
          ? "Organigramm vollständig einsortiert."
          : "Karte korrekt platziert.",
      },
    }));
  };

  const autoSolveOrganigram = () => {
    if (!activeTask) {
      return;
    }
    const result = autoPlaceNext(activeTask);
    if (!result.solvedRankId) {
      return;
    }
    updateSession({
      branch: result.slotKey.split("-")[0],
      mode: "organigram",
      outcome: "correct",
      helped: true,
    });
    setState((current) => ({
      ...current,
      currentTask: result.nextTask,
      currentFeedback: {
        status: "hint",
        message: "Der nächste Rang wurde automatisch eingesetzt.",
      },
    }));
  };

  const resetAll = () => {
    reset();
    setInputValue("");
  };

  const handleInstall = async () => {
    const installed = await install();
    if (!installed) {
      return;
    }

    setState((current) => ({
      ...current,
      currentFeedback: {
        status: "correct",
        message: "Die App wurde zur Installation an den Browser uebergeben.",
      },
    }));
  };

  if (state.currentView === "stats") {
    return (
      <Shell>
        <StatsPage
          session={state.session}
          onBack={() => setState((current) => ({ ...current, currentView: "start" }))}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      {state.currentView === "start" ? (
        <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            <p className="text-sm uppercase tracking-[0.35em] text-sand/60">Web-App MVP</p>
            <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Learning-Tool Bundeswehr-Dienstgrade
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sand/75">
              Vier Lernmodi, lokale Fortschrittsspeicherung, Statistik und eine mobile Bedienlogik
              fuer Drag-and-Drop-freies Einordnen im Organigramm.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Lernmodus waehlen</h2>
                <div className="mt-3">
                  <ModeSelector
                    value={state.selectedMode}
                    onChange={(selectedMode) =>
                      setState((current) => ({ ...current, selectedMode }))
                    }
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Teilstreitkraefte</h2>
                <div className="mt-3">
                  <BranchSelector
                    value={state.selectedBranches}
                    onChange={(selectedBranches) =>
                      setState((current) => ({ ...current, selectedBranches }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startTraining}
                  className="rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
                >
                  Training starten
                </button>
                <button
                  type="button"
                  onClick={() => setState((current) => ({ ...current, currentView: "stats" }))}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                >
                  Statistik
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-full border border-alert/35 px-5 py-3 text-sm text-white"
                >
                  Lernstand zuruecksetzen
                </button>
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <aside className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-panel">
              <p className="text-sm uppercase tracking-[0.3em] text-sand/60">Aktive Auswahl</p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Modus</dt>
                  <dd className="mt-2 text-lg text-white">{modeLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Branches</dt>
                  <dd className="mt-2 text-lg text-white">{selectedBranchLabels}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Persistenz</dt>
                  <dd className="mt-2 text-sm leading-6 text-sand/70">
                    Fortschritt, aktuelle Aufgabe und Fehlerhistorie werden lokal im Browser gehalten.
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Installiert</dt>
                  <dd className="mt-2 text-sm leading-6 text-sand/70">
                    {isInstalled ? "Ja, die App laeuft im App-Modus." : "Noch im Browser-Modus."}
                  </dd>
                </div>
              </dl>
            </aside>

            <PwaInstallPanel
              canInstall={canInstall}
              isInstalled={isInstalled}
              showIosHint={showIosHint}
              onInstall={handleInstall}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sand/55">Training</p>
              <h2 className="mt-2 font-display text-3xl text-white">
                {modeLabel} mit {selectedBranchLabels}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setState((current) => ({ ...current, currentView: "start" }))}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
              >
                Zur Startseite
              </button>
              <button
                type="button"
                onClick={moveToNextTask}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
              >
                Naechste Aufgabe
              </button>
              {activeTask?.mode !== "organigram" && (
                <button
                  type="button"
                  onClick={showSolution}
                  className="rounded-full border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-white"
                >
                  Loesung zeigen
                </button>
              )}
            </div>
          </div>

          <ProgressPanel session={state.session} />
          <FeedbackMessage feedback={state.currentFeedback} />

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            {activeTask?.mode === "image-input" && (
              <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
                <RankImage rank={activeTask.correct} />
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-sand/50">
                    Bild zu Dienstgrad eingeben
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Wie heisst dieser Dienstgrad?</h3>
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-sand/35"
                    placeholder="Dienstgrad eingeben"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-950"
                    >
                      Antwort pruefen
                    </button>
                    <button
                      type="button"
                      onClick={showSolution}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                    >
                      Loesung
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTask?.mode === "image-choice" && (
              <div className="space-y-6">
                <div className="mx-auto max-w-md">
                  <RankImage
                    rank={activeTask.correct}
                    highlighted={state.currentFeedback?.solution === activeTask.correct.id}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {activeTask.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChoice(option.id)}
                      className={`rounded-2xl border p-4 text-left text-white transition ${
                        state.currentFeedback?.solution === option.id
                          ? "border-signal bg-signal/10"
                          : "border-white/10 bg-black/20 hover:border-white/30"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTask?.mode === "text-choice" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
                  <p className="text-sm uppercase tracking-[0.25em] text-sand/50">
                    Klartext zu Bildwahl
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">{activeTask.correct.name}</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeTask.options.map((option) => (
                    <button key={option.id} type="button" onClick={() => handleChoice(option.id)}>
                      <RankImage
                        rank={option}
                        highlighted={state.currentFeedback?.solution === option.id}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTask?.mode === "organigram" && (
              <OrganigramBoard
                task={activeTask}
                feedback={state.currentFeedback}
                onPlace={handleOrganigramPlace}
                onHint={showSolution}
                onAutoSolve={autoSolveOrganigram}
              />
            )}
          </section>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(196,164,93,0.18),transparent_30%),linear-gradient(180deg,#102033_0%,#09111d_65%)] px-4 py-6 font-body sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

export default App;
