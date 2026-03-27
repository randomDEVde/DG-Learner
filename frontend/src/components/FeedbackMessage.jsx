export default function FeedbackMessage({ feedback }) {
  if (!feedback) {
    return null;
  }

  const palette =
    feedback.status === "correct"
      ? "border-signal/40 bg-signal/10 text-white"
      : feedback.status === "hint"
        ? "border-brass/40 bg-brass/10 text-white"
        : "border-alert/40 bg-alert/10 text-white";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${palette}`}>
      {feedback.message}
    </div>
  );
}
