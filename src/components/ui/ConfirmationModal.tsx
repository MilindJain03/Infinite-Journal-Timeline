import { AlertTriangle } from "lucide-react";

type ConfirmationModalProps = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}