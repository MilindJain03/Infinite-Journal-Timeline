import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import CalendarRow from "./CalendarRow";
import CalendarHeader from "./CalendarHeader";
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { useJournalEntries } from "../../context/JournalProvider";
import {
  parse,
  startOfWeek,
  differenceInWeeks,
  addWeeks,
  subWeeks,
} from "date-fns";

const TOTAL_WEEKS = 100_000;
const START_INDEX = TOTAL_WEEKS / 2;
const WEEKS_IN_MONTH = 4;

export default function MonthGrid() {
  const listRef = useRef<VirtuosoHandle>(null);
  const [activeRangeMid, setActiveRangeMid] = useState(START_INDEX);
  const { filteredEntries } = useJournalEntries();
  const isInitialMount = useRef(true);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeaderHeight(entry.target.clientHeight);
      }
    });

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const offset = activeRangeMid - START_INDEX;
  const thisWeekStart = startOfWeek(new Date());
  const activeDate =
    offset >= 0
      ? addWeeks(thisWeekStart, offset)
      : subWeeks(thisWeekStart, -offset);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (filteredEntries.length > 0) {
      const firstEntry = filteredEntries[0];
      const targetDate = parse(firstEntry.date, "dd/MM/yyyy", new Date());

      const todayWeekStart = startOfWeek(new Date());
      const targetWeekStart = startOfWeek(targetDate);
      const offset = differenceInWeeks(targetWeekStart, todayWeekStart);
      const targetIndex = START_INDEX + offset;

      listRef.current?.scrollToIndex({
        index: targetIndex,
        align: "center",
        behavior: "smooth",
      });
    }
  }, [filteredEntries]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!listRef.current) return;
      let newIndex = -1;
      if (event.key === "ArrowLeft") {
        newIndex = activeRangeMid - WEEKS_IN_MONTH;
      } else if (event.key === "ArrowRight") {
        newIndex = activeRangeMid + WEEKS_IN_MONTH;
      }
      if (newIndex !== -1) {
        listRef.current.scrollToIndex({
          index: newIndex,
          behavior: "smooth",
          align: "start",
        });
      }
    },
    [activeRangeMid]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  function scrollToToday() {
    listRef?.current?.scrollToIndex({
      index: START_INDEX - 1,
      behavior: "smooth",
    });
  }

  return (
    <div className="h-full w-full">
      <CalendarHeader
        ref={headerRef}
        activeDate={activeDate}
        scrollToToday={scrollToToday}
      />
      <Virtuoso
        ref={listRef}
        style={{ height: "100%", paddingTop: `${headerHeight}px` }}
        totalCount={TOTAL_WEEKS}
        initialTopMostItemIndex={START_INDEX - 1}
        overscan={2}
        increaseViewportBy={200}
        itemContent={(index) => (
          <CalendarRow
            index={index}
            startIndex={START_INDEX}
            activeDate={activeDate}
          />
        )}
        rangeChanged={({ endIndex, startIndex }) =>
          setActiveRangeMid(Math.round((endIndex + startIndex) / 2))
        }
      />
    </div>
  );
}
