import ranksJson from "./ranks.json";

export const BRANCHES = [
  { id: "heer", label: "Heer", accent: "#6f7f54" },
  { id: "marine", label: "Marine", accent: "#2f6f97" },
  { id: "luftwaffe", label: "Luftwaffe", accent: "#5a7896" },
];

export const MODES = [
  {
    id: "image-input",
    label: "Bild -> Dienstgrad eingeben",
    description: "Freitext-Training mit Umlaute-/Großschreibungs-Toleranz.",
  },
  {
    id: "image-choice",
    label: "Bild -> richtigen Klartext wählen",
    description: "Vier plausible Antworttexte mit direktem Feedback.",
  },
  {
    id: "text-choice",
    label: "Klartext -> richtiges Bild wählen",
    description: "Ein Dienstgradname, vier Bildoptionen.",
  },
  {
    id: "organigram",
    label: "Organigramm einordnen",
    description: "Ränge per Drag-and-Drop oder Tap-Tap korrekt einsortieren.",
  },
];

export const ranks = ranksJson.map((rank) => ({
  ...rank,
  id: `${rank.branch}-${rank.order}`,
}));
