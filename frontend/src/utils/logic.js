import { BRANCHES, ranks } from "../data/ranks";

export const STORAGE_KEY = "dg-learner-state-v1";

export function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
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

export function getRanksForBranches(branches) {
  const activeBranches = branches?.length ? branches : BRANCHES.map((branch) => branch.id);
  return ranks.filter((rank) => activeBranches.includes(rank.branch));
}

function pickDistractors(correctRank, pool, amount = 3) {
  const sameBranch = pool.filter(
    (candidate) =>
      candidate.id !== correctRank.id &&
      candidate.branch === correctRank.branch &&
      Math.abs(candidate.order - correctRank.order) <= 3,
  );
  const sameGroup = pool.filter(
    (candidate) =>
      candidate.id !== correctRank.id &&
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

export function createTask(mode, branches) {
  const pool = getRanksForBranches(branches);
  if (!pool.length) {
    return null;
  }

  if (mode === "organigram") {
    const grouped = BRANCHES.filter((branch) => branches.includes(branch.id)).map((branch) => ({
      branch: branch.id,
      label: branch.label,
      ranks: ranks
        .filter((rank) => rank.branch === branch.id)
        .sort((a, b) => a.order - b.order),
    }));

    return {
      id: crypto.randomUUID(),
      mode,
      groups: grouped,
      placements: {},
      remaining: shuffle(grouped.flatMap((group) => group.ranks)),
      solved: false,
    };
  }

  const correct = pool[Math.floor(Math.random() * pool.length)];

  if (mode === "image-input") {
    return {
      id: crypto.randomUUID(),
      mode,
      correct,
    };
  }

  const distractors = pickDistractors(correct, pool);
  const options = shuffle([correct, ...distractors]);

  if (mode === "image-choice") {
    return {
      id: crypto.randomUUID(),
      mode,
      correct,
      options,
    };
  }

  if (mode === "text-choice") {
    return {
      id: crypto.randomUUID(),
      mode,
      correct,
      options,
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
    selectedBranches: ["heer"],
    currentTask: null,
    session: {
      answered: 0,
      correct: 0,
      wrong: 0,
      helped: 0,
      history: [],
    },
    currentFeedback: null,
    currentView: "start",
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
