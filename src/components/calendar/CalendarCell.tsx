
import { twMerge } from "tailwind-merge";
import type { JournalEntry, Day } from "../../types/types";
import { Star, PlusCircle } from "lucide-react";
import { useModal } from "../modal/ModalWrapper";
import Pill from "../ui/Pill";
import ModalCarousel from "../modal/ModalCarousel";
import JournalForm from "../ui/JournalForm";
import { useJournalEntries } from "../../context/JournalProvider";

const JournalPreview = ({ entry }: { entry: JournalEntry }) => {
  const { openModal } = useModal();
  return (
    <div
      className="w-full flex flex-col gap-1 cursor-pointer"
      onClick={() => openModal(<ModalCarousel entryId={entry.id} />)}
    >
      <div className="w-fit mx-auto flex items-center gap-px">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <Star
              key={index}
              size={8} 
              className={twMerge(
                index + 1 <= Math.floor(entry.rating)
                  ? "stroke-blue-400 fill-blue-400"
                  : "stroke-neutral-600 fill-neutral-600"
              )}
            />
          ))}
      </div>
      <img
        loading="lazy"
        src={entry.imgUrl}
        alt="journal"
        className="aspect-square w-full rounded object-cover"
      />
      <div className="flex items-center justify-center gap-px text-gray-500">
        {entry.categories.length > 2 ? (
          <>
            <Pill>{entry.categories[0].charAt(0).toUpperCase()}</Pill>
            <Pill>{entry.categories.length - 1}+</Pill>
          </>
        ) : (
          entry.categories.map((cat) => (
            <Pill key={cat}>{cat.charAt(0).toUpperCase()}</Pill>
          ))
        )}
      </div>
    </div>
  );
};

export default function CalendarCell({
  day,
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  journals,
}: Day) {
  const { openModal, closeModal } = useModal();
  const { addJournalEntry } = useJournalEntries();

  const handleAddJournal = (data: any) => {
    addJournalEntry(data);
    closeModal();
  };

  const handleOpenAddModal = () => {
    if (!isCurrentMonth) return;
    openModal(
      <JournalForm
        onSubmit={handleAddJournal}
        onCancel={closeModal}
        date={date}
      />
    );
  };

  const hasJournals = journals && journals.length > 0;

  return (
    <div
      className={twMerge(
        "relative p-1 py-2 h-[130px] md:h-[250px] flex flex-col first:border-l border-r border-t border-neutral-200 text-center group",
        isCurrentMonth
          ? isSelected
            ? "bg-indigo-100"
            : "bg-white"
          : "bg-gray-50 text-gray-500"
      )}
    >
      <time
        dateTime={date}
        className={twMerge(
          "flex-shrink-0",
          isToday &&
            "flex h-6 w-6 items-center justify-center mx-auto rounded-full bg-blue-400 font-semibold text-white"
        )}
      >
        {day}
      </time>

      {hasJournals ? (
        <div className="mt-1 flex-1 flex items-start gap-1 text-xs overflow-hidden">
          {journals.slice(0, 2).map((entry) => (
            <JournalPreview key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        isCurrentMonth && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleOpenAddModal}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-indigo-50 hover:bg-indigo-100"
              aria-label="Add journal entry"
            >
              <PlusCircle className="w-8 h-8 text-blue-400" />
            </button>
          </div>
        )
      )}
    </div>
  );
}