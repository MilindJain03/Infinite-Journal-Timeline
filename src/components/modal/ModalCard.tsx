import type { JournalEntry } from "../../types/types";
import Pill from "../ui/Pill";
import { Star, Edit, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";
import { useJournalEntries } from "../../context/JournalProvider";
import { useModal } from "./ModalWrapper";
import JournalForm from "../ui/JournalForm";
import ConfirmationModal from "../ui/ConfirmationModal";

type ModalCardProps = {
  entry: JournalEntry;
  isCentered: boolean;
};

export default function ModalCard({ entry, isCentered }: ModalCardProps) {
  const { description, imgUrl, date } = entry;
  const { deleteJournalEntry, updateJournalEntry } = useJournalEntries();
  const { openModal, closeModal } = useModal();

  const confirmDeletion = () => {
    deleteJournalEntry(entry.id);
    closeModal();
  };

  const handleOpenDeleteModal = () => {
    openModal(
      <ConfirmationModal
        title="Delete Journal Entry"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDeletion}
        onCancel={closeModal}
      />
    );
  };

  const handleUpdate = (data: any) => {
    updateJournalEntry(entry.id, data);
    closeModal();
  };

  const handleOpenEditModal = () => {
    openModal(
      <JournalForm
        initialData={entry}
        onSubmit={handleUpdate}
        onCancel={closeModal}
        date={entry.date}
      />
    );
  };

  return (
    <div
      className={twMerge(
        "h-[620px] w-[320px] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300",
        isCentered ? "scale-100 opacity-100" : "scale-95 opacity-60"
      )}
    >
      <div className="w-full h-[420px] flex-shrink-0 bg-gray-100">
        <img
          src={imgUrl}
          alt={description}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-gray-500">
            {entry.categories.map((cat) => (
              <Pill key={cat}>{cat.charAt(0).toUpperCase()}</Pill>
            ))}
          </div>
          <div className="flex items-center gap-px">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  className={twMerge(
                    index < Math.floor(entry.rating)
                      ? "stroke-blue-400 fill-blue-400"
                      : "stroke-neutral-400 fill-transparent"
                  )}
                />
              ))}
          </div>
        </div>

        <h1 className="text-lg font-medium mb-2">
          {format(parse(date, "dd/MM/yyyy", new Date()), "d MMMM")}
        </h1>

        <p className="text-sm text-gray-600 line-clamp-3 flex-1">
          {description}
        </p>
      </div>

      <div className="w-full h-12 flex-shrink-0 border-t border-neutral-200 bg-neutral-50 grid grid-cols-2">
        <button
          onClick={handleOpenEditModal}
          className="h-full flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-neutral-100 transition-colors"
        >
          <Edit size={14} /> Edit
        </button>
        <button
          onClick={handleOpenDeleteModal}
          className="h-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-l border-neutral-200"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}