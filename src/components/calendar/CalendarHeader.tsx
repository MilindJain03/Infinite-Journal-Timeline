import { format } from "date-fns";
import { Search } from "lucide-react";
import { useState, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { useJournalEntries } from "../../context/JournalProvider";

type CalendarHeaderProps = {
  activeDate: Date;
  scrollToToday: () => void;
};

const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ activeDate, scrollToToday }, ref) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const {
      categories,
      toggleCategoryFilter,
      activeCategory,
      setSearchQuery,
      clearFilters,
    } = useJournalEntries();

    function handleCategoryClick(category: string) {
      toggleCategoryFilter(category);
    }

    function handleSearchClick() {
      setIsFilterVisible(false);
    }

    function handleClearAndClose() {
      clearFilters();
      setIsFilterVisible(false);
    }

    return (
      <div
        ref={ref}
        className="fixed w-full top-0 z-20 border-b border-neutral-200 bg-gray-50"
      >
        <div className="p-2 flex flex-wrap items-center justify-between gap-y-2">
          <h1 className="text-xl font-medium">
            <span className="text-sky-400">my</span>{" "}
            <span className="text-gray-800">hair diary</span>
          </h1>

          <div className="flex items-center gap-2">
            {/* Instruction for keyboard navigation */}
            <p className="hidden md:block text-xs text-gray-400 font-normal">
              (use ← and → to navigate months)
            </p>
            
            <h2 className="font-semibold text-lg text-blue-400">
              <span>{format(activeDate, "MMM")}</span>
              <span className="text-gray-800 ml-1">
                {format(activeDate, "y")}
              </span>
            </h2>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="h-9 w-9 flex items-center justify-center rounded bg-blue-400 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              <Search size={18} />
            </button>
            <button
              onClick={scrollToToday}
              className="h-9 rounded bg-blue-400 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Today
            </button>
          </div>
        </div>

        <div
          className={twMerge(
            "transition-[max-height,padding] duration-500 ease-in-out overflow-hidden",
            isFilterVisible ? "max-h-[40rem]" : "max-h-0 py-0"
          )}
        >
          <div className="p-4 border-t border-neutral-200 bg-white space-y-4">
            <input
              type="text"
              placeholder="Search in descriptions..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={twMerge(
                    "px-4 py-1.5 text-sm flex-shrink-0 whitespace-nowrap rounded-md border focus:outline-none transition-colors",
                    activeCategory === cat
                      ? "bg-blue-400 text-white border-blue-400"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleClearAndClose}
                className="w-full rounded bg-white border border-gray-300 px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={handleSearchClick}
                className="w-full rounded bg-blue-400 px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-7">
          {dayNames.map((day) => (
            <div
              key={day}
              className="flex items-center py-4 justify-center text-xs font-semibold text-gray-600 border-t border-r border-neutral-200"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default CalendarHeader;