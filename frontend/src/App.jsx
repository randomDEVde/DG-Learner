import { useEffect, useMemo, useRef, useState } from "react";
import BranchSelector from "./components/BranchSelector";
import CategorySelector from "./components/CategorySelector";
import CompletionDialog from "./components/CompletionDialog";
import FeedbackMessage from "./components/FeedbackMessage";
import LearningModeSwitch from "./components/LearningModeSwitch";
import ModeSelector from "./components/ModeSelector";
import OrganigramBoard from "./components/OrganigramBoard";
import ProgressPanel from "./components/ProgressPanel";
import RankImage from "./components/RankImage";
import ReviewPanel from "./components/ReviewPanel";
import ShortcutButton from "./components/ShortcutButton";
import StatsPage from "./components/StatsPage";
import { usePersistentState } from "./hooks/usePersistentState";
import { BRANCHES, CATEGORIES, MODES } from "./data/ranks";
import {
  autoPlaceNext,
  applySpacedRepetitionRating,
  createTask,
  gradeTask,
  hydrateState,
  placeOnOrganigram,
  revealOrganigramStep,
  STORAGE_KEY,
} from "./utils/logic";

function App() {
  const { state, setState, reset } = usePersistentState();
  const [inputValue, setInputValue] = useState("");
  const [showOrganigramCompleteDialog, setShowOrganigramCompleteDialog] = useState(false);
  const [pendingAutostart, setPendingAutostart] = useState(false);
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const backupInputRef = useRef(null);
  const activeTask = state.currentTask;
  const isSpacedRepetitionActive =
    state.selectedLearningMode === "spaced-repetition" && state.selectedMode !== "organigram";
  const requiresReview =
    isSpacedRepetitionActive &&
    activeTask?.mode !== "organigram" &&
    state.currentFeedback?.awaitingReview;
  const hasFinalAnswer =
    state.currentFeedback?.status === "correct" || state.currentFeedback?.status === "wrong";

  const selectedBranchLabels = useMemo(
    () =>
      BRANCHES.filter((branch) => state.selectedBranches.includes(branch.id))
        .map((branch) => branch.label)
        .join(", "),
    [state.selectedBranches],
  );

  const selectedCategoryLabels = useMemo(
    () =>
      CATEGORIES.filter((category) => state.selectedCategories.includes(category.id))
        .map((category) => category.label)
        .join(", "),
    [state.selectedCategories],
  );

  const modeLabel = useMemo(
    () =>
      ({
        "image-input": "Bild mit Texteingabe",
        "image-choice": "Bild mit Auswahl",
        "text-choice": "Text mit Bildauswahl",
        organigram: "Organigramm einordnen",
      })[state.selectedMode] ?? state.selectedMode,
    [state.selectedMode],
  );

  const createCurrentTask = (overrides = {}) =>
    createTask(
      overrides.selectedMode ?? state.selectedMode,
      overrides.selectedBranches ?? state.selectedBranches,
      overrides.selectedCategories ?? state.selectedCategories,
      {
        learningMode: overrides.selectedLearningMode ?? state.selectedLearningMode,
        spacedRepetition: overrides.spacedRepetition ?? state.spacedRepetition,
      },
    );

  useEffect(() => {
    if (activeTask?.mode !== "image-input") {
      setInputValue("");
    }
  }, [activeTask]);

  useEffect(() => {
    if (activeTask?.mode === "organigram" && activeTask.solved) {
      setShowOrganigramCompleteDialog(true);
      return;
    }

    setShowOrganigramCompleteDialog(false);
  }, [activeTask]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetView = params.get("view");
    const autostart = params.get("autostart") === "1";

    if (targetView === "stats") {
      setState((current) => ({ ...current, currentView: "stats" }));
      return;
    }

    if (targetView === "training" || autostart) {
      const mode = params.get("mode");
      const branches = params.get("branches");
      const categories = params.get("categories");
      const learning = params.get("learning");
      const validMode = MODES.some((entry) => entry.id === mode) ? mode : null;
      const validBranches = branches
        ? branches
            .split(",")
            .filter(Boolean)
            .filter((branch) => BRANCHES.some((entry) => entry.id === branch))
        : null;
      const validCategories = categories
        ? categories
            .split(",")
            .filter(Boolean)
            .filter((category) => CATEGORIES.some((entry) => entry.id === category))
        : null;
      const nextMode = validMode ?? state.selectedMode;
      const nextBranches = validBranches?.length ? validBranches : state.selectedBranches;
      const nextCategories = validCategories?.length ? validCategories : state.selectedCategories;
      const nextLearningMode =
        nextMode === "organigram"
          ? "standard"
          : learning === "spaced-repetition" || learning === "standard"
            ? learning
            : state.selectedLearningMode;

      setState((current) => ({
        ...current,
        selectedMode: nextMode,
        selectedBranches: nextBranches,
        selectedCategories: nextCategories,
        selectedLearningMode: nextLearningMode,
        currentView: autostart ? "start" : "training",
        currentTask: autostart
          ? null
          : createTask(nextMode, nextBranches, nextCategories, {
              learningMode: nextLearningMode,
              spacedRepetition: current.spacedRepetition,
            }),
        currentFeedback: null,
      }));
      setPendingAutostart(autostart);
    }
  }, [setState]);

  useEffect(() => {
    if (!pendingAutostart || state.currentView !== "start") {
      return;
    }

    const currentTask = createCurrentTask();
    setState((current) => ({
      ...current,
      currentView: "training",
      currentTask,
      currentFeedback: null,
    }));
    setPendingAutostart(false);
  }, [pendingAutostart, state.currentView, setState]);

  useEffect(() => {
    if (state.currentView !== "training" || state.currentTask) {
      return;
    }

    setState((current) => ({
      ...current,
      currentTask: createTask(
        current.selectedMode,
        current.selectedBranches,
        current.selectedCategories,
        {
          learningMode: current.selectedLearningMode,
          spacedRepetition: current.spacedRepetition,
        },
      ),
    }));
  }, [state.currentView, state.currentTask, setState]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const onKeyDown = (event) => {
      if (!desktopQuery.matches || state.currentView !== "training") {
        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target;
      const isTypingField =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isTypingField && event.key.toLowerCase() !== "l" && event.key.toLowerCase() !== "h") {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (requiresReview) {
          return;
        }
        moveToNextTask();
        return;
      }

      if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        showSolution();
        return;
      }

      if (requiresReview && ["1", "2", "3", "4"].includes(event.key)) {
        event.preventDefault();
        const ratingByKey = {
          1: "again",
          2: "hard",
          3: "good",
          4: "easy",
        };
        rateLastTask(ratingByKey[event.key]);
        return;
      }

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        setShowOrganigramCompleteDialog(false);
        setState((current) => ({ ...current, currentView: "start" }));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    state.currentView,
    state.selectedMode,
    state.selectedBranches,
    activeTask,
    setState,
    requiresReview,
    state.spacedRepetition,
  ]);

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
    const currentTask = createCurrentTask();
    setState((current) => ({
      ...current,
      currentTask,
      currentView: "training",
      currentFeedback: null,
    }));
    setShowOrganigramCompleteDialog(false);
  };

  const moveToNextTask = () => {
    const currentTask = createCurrentTask();
    setState((current) => ({
      ...current,
      currentTask,
      currentFeedback: null,
    }));
    setShowOrganigramCompleteDialog(false);
  };

  const showSolution = () => {
    if (!activeTask || hasFinalAnswer) {
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

    if (activeTask.mode === "image-input") {
      setInputValue(activeTask.correct.name);
    }

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
    if (!activeTask || hasFinalAnswer) {
      return;
    }
    const result = gradeTask(activeTask, { answer: inputValue });
    const helped = state.currentFeedback?.status === "hint";
    updateSession({
      branch: activeTask.correct.branch,
      category: activeTask.correct.category,
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
        awaitingReview: isSpacedRepetitionActive,
      },
    }));
  };

  const handleChoice = (answerId) => {
    if (!activeTask || hasFinalAnswer) {
      return;
    }
    const result = gradeTask(activeTask, { answerId });
    const helped = state.currentFeedback?.status === "hint";
    updateSession({
      branch: activeTask.correct.branch,
      category: activeTask.correct.category,
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
        awaitingReview: isSpacedRepetitionActive,
      },
    }));
  };

  const rateLastTask = (rating) => {
    if (!activeTask) {
      return;
    }

    const spacedRepetition = applySpacedRepetitionRating(state.spacedRepetition, activeTask, rating);
    const currentTask = createCurrentTask({ spacedRepetition });

    setState((current) => ({
      ...current,
      spacedRepetition,
      currentTask,
      currentFeedback: null,
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
      category: "standard",
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
      category: "standard",
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
    setShowOrganigramCompleteDialog(false);
  };

  const downloadBackup = () => {
    const backupPayload = {
      app: "DG Learner",
      type: "learning-state-backup",
      storageKey: STORAGE_KEY,
      exportedAt: new Date().toISOString(),
      state,
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: "application/json",
    });
    const dateLabel = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dg-learner-backup-${dateLabel}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setState((current) => ({
      ...current,
      currentFeedback: {
        status: "correct",
        message: "Backup als JSON-Datei heruntergeladen.",
      },
    }));
  };

  const triggerBackupImport = () => {
    backupInputRef.current?.click();
  };

  const handleBackupImport = async (event) => {
    const [file] = event.target.files ?? [];
    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const importedState = hydrateState(parsed?.state ?? parsed);

      setState({
        ...importedState,
        currentView: "start",
        currentTask: null,
        currentFeedback: {
          status: "correct",
          message: `Backup "${file.name}" wurde importiert.`,
        },
      });
      setInputValue("");
      setShowOrganigramCompleteDialog(false);
    } catch {
      setState((current) => ({
        ...current,
        currentFeedback: {
          status: "wrong",
          message: "Import fehlgeschlagen. Bitte eine gueltige JSON-Backup-Datei waehlen.",
        },
      }));
    } finally {
      event.target.value = "";
    }
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
          <section className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-panel backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-sand/60">Web-App MVP</p>
            <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Learning-Tool Bundeswehr-Dienstgrade
            </h1>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Lernmodus wählen</h2>
                <div className="mt-3">
                  <ModeSelector
                    value={state.selectedMode}
                    onChange={(selectedMode) =>
                      setState((current) => ({
                        ...current,
                        selectedMode,
                        selectedLearningMode:
                          selectedMode === "organigram"
                            ? "standard"
                            : current.selectedLearningMode,
                      }))
                    }
                  />
                </div>
              </div>

              <LearningModeSwitch
                value={state.selectedLearningMode}
                disabled={state.selectedMode === "organigram"}
                onChange={(selectedLearningMode) =>
                  setState((current) => ({ ...current, selectedLearningMode }))
                }
              />

              <div>
                <h2 className="text-lg font-semibold text-white">Teilstreitkräfte</h2>
                <div className="mt-3">
                  <BranchSelector
                    value={state.selectedBranches}
                    onChange={(selectedBranches) =>
                      setState((current) => ({ ...current, selectedBranches }))
                    }
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Rangkategorien</h2>
                <div className="mt-3">
                  <CategorySelector
                    value={state.selectedCategories}
                    lockToStandard={state.selectedMode === "organigram"}
                    onChange={(selectedCategories) =>
                      setState((current) => ({ ...current, selectedCategories }))
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
                  onClick={() => setShowBackupPanel((current) => !current)}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                >
                  Backup
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-full border border-alert/35 px-5 py-3 text-sm text-white"
                >
                  Lernstand zurücksetzen
                </button>
              </div>

              <input
                ref={backupInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleBackupImport}
              />

              {state.currentFeedback ? <FeedbackMessage feedback={state.currentFeedback} /> : null}

              {showBackupPanel ? (
                <div className="rounded-[1.6rem] border border-white/15 bg-black/20 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-sand/55">Backup</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Lernstand sichern oder wiederherstellen</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-sand/70">
                    Das Backup wird als JSON gespeichert. Das ist fuer diesen Anwendungsfall sinnvoller
                    als CSV, weil Auswahl, Statistik, Spaced-Repetition-Daten und Einstellungen
                    vollstaendig wiederhergestellt werden koennen.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={downloadBackup}
                      className="rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink-950 transition hover:brightness-110"
                    >
                      Backup herunterladen
                    </button>
                    <button
                      type="button"
                      onClick={triggerBackupImport}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                    >
                      Backup importieren
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <div className="space-y-6">
            <aside className="rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/14 to-white/8 p-6 shadow-panel backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-sand/60">Aktive Auswahl</p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Modus</dt>
                  <dd className="mt-2 text-lg text-white">{modeLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Teilstreitkräfte</dt>
                  <dd className="mt-2 text-lg text-white">{selectedBranchLabels}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Kategorien</dt>
                  <dd className="mt-2 text-lg text-white">
                    {state.selectedMode === "organigram" ? "Standardränge" : selectedCategoryLabels}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.25em] text-sand/45">Lernlogik</dt>
                  <dd className="mt-2 text-lg text-white">
                    {state.selectedLearningMode === "spaced-repetition"
                      ? "Spaced Repetition"
                      : "Standard"}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-panel backdrop-blur-sm lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sand/55">Training</p>
              <h2 className="mt-2 font-display text-3xl text-white">
                {modeLabel} mit {selectedBranchLabels}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <ShortcutButton
                type="button"
                shortcut="H"
                tooltipLabel="Zur Startseite wechseln mit H"
                onClick={() => {
                  setShowOrganigramCompleteDialog(false);
                  setState((current) => ({ ...current, currentView: "start" }));
                }}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
              >
                Zur Startseite
              </ShortcutButton>
              <ShortcutButton
                type="button"
                shortcut="Enter"
                tooltipLabel="Nächste Aufgabe mit Enter"
                onClick={moveToNextTask}
                className={`rounded-full border px-4 py-2 text-sm text-white ${
                  requiresReview ? "cursor-not-allowed border-white/10 opacity-50" : "border-white/15"
                }`}
                disabled={requiresReview}
              >
                Nächste Aufgabe
              </ShortcutButton>
              {activeTask?.mode !== "organigram" && (
                <ShortcutButton
                  type="button"
                  shortcut="L"
                  tooltipLabel="Lösung mit L anzeigen"
                  onClick={showSolution}
                  className="rounded-full border border-brass/40 bg-brass/10 px-4 py-2 text-sm text-white"
                >
                  Lösung zeigen
                </ShortcutButton>
              )}
            </div>
          </div>

          <ProgressPanel session={state.session} />
          <FeedbackMessage feedback={state.currentFeedback} />
          <ReviewPanel visible={requiresReview} onRate={rateLastTask} />
          {activeTask?.mode === "organigram" && activeTask?.solved ? (
            <div className="rounded-2xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-white">
              Das Organigramm ist fertig. Alle Karten wurden zugeordnet.
            </div>
          ) : null}

          <section className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-panel backdrop-blur-sm">
            {activeTask?.mode === "image-input" && (
              <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
                <RankImage rank={activeTask.correct} showLabel={false} showMeta={false} />
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-sand/50">
                    Bild und Eingabe
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Wie heißt dieser Dienstgrad?</h3>
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
                      Antwort prüfen
                    </button>
                    <button
                      type="button"
                      onClick={showSolution}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                    >
                      Lösung
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
                    showLabel={false}
                    showMeta={false}
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
                    Text und Bildwahl
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">{activeTask.correct.name}</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeTask.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChoice(option.id)}
                      className={`rounded-[1.3rem] p-[8px] transition ${
                        state.currentFeedback?.solution === option.id
                          ? "bg-[linear-gradient(45deg,rgba(255,18,8,0.96),rgba(176,176,180,0.98))] shadow-[0_0_0_5px_rgba(255,18,8,0.2)]"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="overflow-hidden rounded-[0.9rem]">
                        <RankImage
                          rank={option}
                          highlighted={state.currentFeedback?.solution === option.id}
                          showLabel={false}
                          showMeta={false}
                        />
                      </div>
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
      <CompletionDialog
        open={showOrganigramCompleteDialog}
        title="Organigramm abgeschlossen"
        message="Alle Karten wurden korrekt zugeordnet. Möchtest du zurück zur Startseite wechseln?"
        confirmLabel="Zur Startseite"
        cancelLabel="Hier bleiben"
        onConfirm={() => {
          setShowOrganigramCompleteDialog(false);
          setState((current) => ({ ...current, currentView: "start" }));
        }}
        onCancel={() => setShowOrganigramCompleteDialog(false)}
      />
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,18,8,0.18),transparent_20%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.08),transparent_16%),linear-gradient(180deg,#4b4c52_0%,#38393e_28%,#2f3034_100%)] px-4 py-6 font-body sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

export default App;
