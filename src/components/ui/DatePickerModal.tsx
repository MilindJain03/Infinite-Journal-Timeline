import { useState } from "react";

type DatePickerModalProps = {
  onSubmit: (date: string) => void;
  onCancel: () => void;
};

export default function DatePickerModal({
  onSubmit,
  onCancel,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onSubmit(selectedDate);
    } else {
      alert("Please select a date.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl mx-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">Select a Date</h3>
      <p className="mt-1 text-sm text-gray-500">
        Choose a date to add your new journal entry.
      </p>
      <div className="mt-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-400 focus:border-indblue-400"
          required
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
}