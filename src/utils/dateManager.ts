import { addHours, differenceInHours } from "date-fns";

export function timeUntilDeadline(date: Date) {
  const deadline: Date = addHours(date, 24);
  const now = new Date();
  return differenceInHours(deadline, now);
}
