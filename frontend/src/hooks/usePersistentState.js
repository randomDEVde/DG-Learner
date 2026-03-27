import { useEffect, useState } from "react";
import { createInitialState, loadState, persistState } from "../utils/logic";

export function usePersistentState() {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    persistState(state);
  }, [state]);

  const reset = () => setState(createInitialState());

  return { state, setState, reset };
}
