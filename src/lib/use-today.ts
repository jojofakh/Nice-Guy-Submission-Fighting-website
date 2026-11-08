import { useState } from "react";
import { days, type Day } from "./schedule";

/** Today's weekday from the visitor's own clock. Read once when the component mounts. */
export function useToday(): Day | null {
  // getDay() is 0 = Sunday; `days` starts at Monday.
  const [today] = useState<Day>(() => days[(new Date().getDay() + 6) % 7]);
  return today;
}
