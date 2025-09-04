import MonthGrid from "./components/calendar/MonthGrid";
import ModalWrapper, { useModal } from "./components/modal/ModalWrapper";
import JournalProvider, { useJournalEntries } from "./context/JournalProvider";
import { Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import JournalForm from "./components/ui/JournalForm";
import DatePickerModal from "./components/ui/DatePickerModal";

function FloatingAddButton() {
  const { openModal, closeModal } = useModal();
  const { addJournalEntry } = useJournalEntries();

  const handleAddJournal = (data: any) => {
    addJournalEntry(data);
    closeModal();
  };

  const openJournalFormForDate = (selectedDate: string) => {
    const formattedDate = format(parseISO(selectedDate), "dd/MM/yyyy");
    openModal(
      <JournalForm
        onSubmit={handleAddJournal}
        onCancel={closeModal}
        date={formattedDate}
      />
    );
  };

  const handleClick = () => {
    openModal(
      <DatePickerModal
        onSubmit={openJournalFormForDate}
        onCancel={closeModal}
      />
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-30 h-14 w-14 flex items-center justify-center rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-500 transition-transform hover:scale-105"
      aria-label="Add new journal entry"
    >
      <Plus size={28} />
    </button>
  );
}

export default function App() {
  return (
    <JournalProvider>
      <ModalWrapper>
        <div className="w-screen h-screen">
          <MonthGrid />
          <FloatingAddButton />
        </div>
      </ModalWrapper>
    </JournalProvider>
  );
}