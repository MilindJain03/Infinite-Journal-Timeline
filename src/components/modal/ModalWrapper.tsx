import { X } from "lucide-react";
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useState,
  useContext,
} from "react";

interface ModalData {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalData | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("ModalContext is missing a provider.");
  return ctx;
}

export default function ModalWrapper({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<ReactNode | null>(null);

  function openModal(content: ReactNode) {
    setModal(content);
  }

  function closeModal() {
    setModal(null);
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
          <div className="absolute inset-0 w-full h-fit flex z-50 flex-row-reverse items-center p-2">
            <button
              onClick={closeModal}
              className="p-2 bg-white/25 rounded-full"
            >
              <X size={20} className="stroke-white" />
            </button>
          </div>
          {modal}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
