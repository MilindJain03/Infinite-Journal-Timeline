import { useJournalEntries } from "../../context/JournalProvider";
import CalendarCell from "./CalendarCell";
import type { Day } from "../../types/types";
import {
  addDays,
  addWeeks,
  format,
  isSameMonth,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { memo } from "react";

function weekStartDate(index: number, startIndex: number): Date {
  const thisWeekStart = startOfWeek(new Date());
  const offset = index - startIndex;
  return offset >= 0
    ? addWeeks(thisWeekStart, offset)
    : subWeeks(thisWeekStart, -offset);
}

type CalendarRowProps = {
  index: number;
  startIndex: number;
  activeDate: Date;
};

const CalendarRow = ({ index, startIndex, activeDate }: CalendarRowProps) => {
  const { entriesByDate } = useJournalEntries();
  const weekStart = weekStartDate(index, startIndex);
  let days: Day[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const key = format(date, "dd/MM/yyyy");
    const day = format(date, "d");

    days.push({
      date: key,
      day,
      isCurrentMonth: isSameMonth(activeDate, date),
      isToday: isToday(date),
      isSelected: false,
      journals: entriesByDate[key],
    });
  }

  return (
    <div className="grid grid-cols-7 gap-px">
      {days.map((day) => (
        <CalendarCell key={day.date} {...day} />
      ))}
    </div>
  );
};

export default memo(CalendarRow);