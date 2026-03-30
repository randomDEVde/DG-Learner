import { BRANCHES, CATEGORIES, ranks } from "../data/ranks";

export const STORAGE_KEY = "dg-learner-state-v3";
const MINUTE = 60 * 1000;

const RATING_MINUTES = {
  again: 1,
  hard: 6,
  good: 10,
  easy: 60 * 24 * 3,
};

function createTaskId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

export function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function getBranchLabel(id) {
  return BRANCHES.find((branch) => branch.id === id)?.label ?? id;
}

export function getCategoryLabel(id) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function getCardKey(mode, rankId) {
  return `${mode}:${rankId}`;
}

export function getRanksForFilters(branches, categories) {
  const activeBranches = branches?.length ? branches : BRANCHES.map((branch) => branch.id);
  const activeCategories = categories?.length
    ? categories
    : CATEGORIES.map((category) => category.id);

  return ranks.filter(
    (rank) => activeBranches.includes(rank.branch) && activeCategories.includes(rank.category),
  );
}

function pickDistractors(correctRank, pool, amount = 3) {
  const sameBranch = pool.filter(
    (candidate) =>
      candidate.id !== correctRank.id &&
      candidate.category === correctRank.category &&
      candidate.branch === correctRank.branch &&
      Math.abs(candidate.order - correctRank.order) <= 3,
  );
  const sameGroup = pool.filter(
    (candidate) =>
      candidate.id !== correctRank.id &&
      candidate.category === correctRank.category &&
      candidate.group === correctRank.group &&
      candidate.branch === correctRank.branch,
  );
  const fallback = pool.filter((candidate) => candidate.id !== correctRank.id);

  const merged = shuffle([...sameBranch, ...sameGroup, ...fallback]);
  const unique = [];
  for (const candidate of merged) {
    if (!unique.find((entry) => entry.id === candidate.id)) {
      unique.push(candidate);
    }
    if (unique.length === amount) {
      break;
    }
  }
  return unique;
}

function getSpacedRepetitionPool(mode, pool, spacedRepetition) {
  const cards = spacedRepetition?.cards ?? {};
  const now = Date.now();
  const duePool = pool.filter((rank) => {
    const card = cards[getCardKey(mode, rank.id)];
    return !card || card.dueAt <= now;
  });

  const source = duePool.length
    ? duePool
    : [...pool].sort((left, right) => {
        const leftDue = cards[getCardKey(mode, left.id)]?.dueAt ?? 0;
        const rightDue = cards[getCardKey(mode, right.id)]?.dueAt ?? 0;
        return leftDue - rightDue;
      });

  const lastCardKey = spacedRepetition?.lastCardKey;
  if (source.length > 1 && lastCardKey) {
    const filtered = source.filter((rank) => getCardKey(mode, rank.id) !== lastCardKey);
    if (filtered.length) {
      return filtered;
    }
  }

  return source;
}

export function createTask(mode, branches, categories, options = {}) {
  const effectiveCategories = mode === "organigram" ? ["standard"] : categories;
  const pool = getRanksForFilters(branches, effectiveCategories);
  if (!pool.length) {
    return null;
  }

  if (mode === "organigram") {
    const activeBranches = branches?.length ? branches : BRANCHES.map((branch) => branch.id);
    const grouped = BRANCHES.filter((branch) => activeBranches.includes(branch.id)).map((branch) => ({
      branch: branch.id,
      label: branch.label,
      ranks: ranks
        .filter((rank) => rank.branch === branch.id && rank.category === "standard")
        .sort((a, b) => a.order - b.order),
    }));

    return {
      id: createTaskId(),
      mode,
      groups: grouped,
      placements: {},
      remaining: shuffle(grouped.flatMap((group) => group.ranks)),
      solved: false,
    };
  }

  const sourcePool =
    options.learningMode === "spaced-repetition" && mode !== "organigram"
      ? getSpacedRepetitionPool(mode, pool, options.spacedRepetition)
      : pool;

  const correct = sourcePool[Math.floor(Math.random() * sourcePool.length)];

  if (mode === "image-input") {
    return {
      id: createTaskId(),
      mode,
      correct,
    };
  }

  const distractors = pickDistractors(correct, pool);
  const answerOptions = shuffle([correct, ...distractors]);

  if (mode === "image-choice") {
    return {
      id: createTaskId(),
      mode,
      correct,
      options: answerOptions,
    };
  }

  if (mode === "text-choice") {
    return {
      id: createTaskId(),
      mode,
      correct,
      options: answerOptions,
    };
  }

  return null;
}

export function gradeTask(task, payload) {
  if (!task) {
    return { isCorrect: false, status: "idle" };
  }

  if (task.mode === "image-input") {
    const isCorrect = normalizeAnswer(payload.answer) === normalizeAnswer(task.correct.name);
    return {
      isCorrect,
      status: isCorrect ? "correct" : "wrong",
      solution: task.correct.name,
    };
  }

  if (task.mode === "image-choice" || task.mode === "text-choice") {
    const isCorrect = payload.answerId === task.correct.id;
    return {
      isCorrect,
      status: isCorrect ? "correct" : "wrong",
      solution: task.correct.id,
    };
  }

  return { isCorrect: false, status: "idle" };
}

export function revealOrganigramStep(task) {
  if (!task || task.mode !== "organigram") {
    return null;
  }
  const nextRank = task.remaining[0];
  if (!nextRank) {
    return null;
  }
  return {
    rankId: nextRank.id,
    slotKey: `${nextRank.branch}-${nextRank.order}`,
  };
}

export function placeOnOrganigram(task, rankId, slotKey) {
  if (!task || task.mode !== "organigram") {
    return { nextTask: task, isCorrect: false };
  }

  const rank = task.remaining.find((entry) => entry.id === rankId);
  if (!rank) {
    return { nextTask: task, isCorrect: false };
  }

  const expected = `${rank.branch}-${rank.order}`;
  const isCorrect = expected === slotKey;

  if (!isCorrect) {
    return { nextTask: task, isCorrect: false, expected };
  }

  const placements = { ...task.placements, [slotKey]: rankId };
  const remaining = task.remaining.filter((entry) => entry.id !== rankId);
  return {
    isCorrect: true,
    nextTask: {
      ...task,
      placements,
      remaining,
      solved: remaining.length === 0,
    },
  };
}

export function autoPlaceNext(task) {
  const hint = revealOrganigramStep(task);
  if (!hint) {
    return { nextTask: task, solvedRankId: null };
  }
  const result = placeOnOrganigram(task, hint.rankId, hint.slotKey);
  return { nextTask: result.nextTask, solvedRankId: hint.rankId, slotKey: hint.slotKey };
}

export function createInitialState() {
  return {
    selectedMode: "image-input",
    selectedLearningMode: "standard",
    selectedBranches: ["heer"],
    selectedCategories: ["standard"],
    currentTask: null,
    session: {
      answered: 0,
      correct: 0,
      wrong: 0,
      helped: 0,
      history: [],
    },
    spacedRepetition: {
      cards: {},
      lastCardKey: null,
    },
    currentFeedback: null,
    currentView: "start",
  };
}

export function hydrateState(parsed) {
  const defaultState = createInitialState();
  const validMode =
    parsed?.selectedMode &&
    ["image-input", "image-choice", "text-choice", "organigram"].includes(parsed.selectedMode)
      ? parsed.selectedMode
      : defaultState.selectedMode;
  const validLearningMode =
    parsed?.selectedLearningMode === "spaced-repetition" ||
    parsed?.selectedLearningMode === "standard"
      ? parsed.selectedLearningMode
      : defaultState.selectedLearningMode;
  const validBranches = parsed?.selectedBranches?.filter((branch) =>
    BRANCHES.some((entry) => entry.id === branch),
  );
  const validCategories = parsed?.selectedCategories?.filter((category) =>
    CATEGORIES.some((entry) => entry.id === category),
  );

  return {
    ...defaultState,
    ...parsed,
    selectedMode: validMode,
    selectedLearningMode: validMode === "organigram" ? "standard" : validLearningMode,
    selectedBranches: validBranches?.length ? validBranches : defaultState.selectedBranches,
    selectedCategories: validCategories?.length ? validCategories : defaultState.selectedCategories,
  };
}

export function applySpacedRepetitionRating(spacedRepetition, task, rating) {
  if (!task?.correct) {
    return spacedRepetition;
  }

  const cardKey = getCardKey(task.mode, task.correct.id);
  const previous = spacedRepetition.cards[cardKey];
  const previousMinutes = previous?.intervalMinutes ?? 0;

  let intervalMinutes = RATING_MINUTES[rating] ?? 1;
  if (rating === "hard") {
    intervalMinutes = Math.max(intervalMinutes, Math.round(previousMinutes * 1.5));
  } else if (rating === "good") {
    intervalMinutes = Math.max(intervalMinutes, Math.round(previousMinutes * 2.2));
  } else if (rating === "easy") {
    intervalMinutes = Math.max(intervalMinutes, Math.round(previousMinutes * 4));
  }

  return {
    cards: {
      ...spacedRepetition.cards,
      [cardKey]: {
        dueAt: Date.now() + intervalMinutes * MINUTE,
        intervalMinutes,
        lastRating: rating,
        lastReviewedAt: Date.now(),
      },
    },
    lastCardKey: cardKey,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }
    const parsed = JSON.parse(raw);
    return hydrateState(parsed);
  } catch {
    return createInitialState();
  }
}

export function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
