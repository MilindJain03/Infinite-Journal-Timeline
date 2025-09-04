import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useJournalEntries } from "../../context/JournalProvider";
import ModalCard from "./ModalCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ModalCarouselProps = {
  entryId: number;
};

const CARD_WIDTH = 320;
const CARD_GAP = 16;

export default function ModalCarousel({ entryId }: ModalCarouselProps) {
  const { journalEntries } = useJournalEntries();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const initialIndex = journalEntries.findIndex(entry => entry.id === entryId);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progressStyle, setProgressStyle] = useState({ width: '0%', left: '0%' });
  const isScrollingRef = useRef(false);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (container) {
      isScrollingRef.current = true;
      const scrollPosition = index * (CARD_WIDTH + CARD_GAP);
      container.scrollTo({ left: scrollPosition, behavior });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, behavior === "smooth" ? 500 : 100);
    }
  };

  const updateProgress = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const thumbWidth = (clientWidth / scrollWidth) * 100;
      const thumbLeft = (scrollLeft / scrollWidth) * 100;
      setProgressStyle({ width: `${thumbWidth}%`, left: `${thumbLeft}%` });
    }
  };

  useEffect(() => {
    const newIndex = journalEntries.findIndex(e => e.id === entryId);
    if (newIndex !== -1) {
        setCurrentIndex(newIndex);
        setTimeout(() => scrollToIndex(newIndex, "auto"), 0);
    }
  }, [entryId, journalEntries]);

  useLayoutEffect(() => {
    updateProgress();
  }, [journalEntries]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (CARD_WIDTH + CARD_GAP));
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < journalEntries.length) {
        setCurrentIndex(newIndex);
      }
      updateProgress();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, journalEntries.length]);

  const handleNavigation = (direction: "prev" | "next") => {
    const newIndex = direction === "prev"
      ? Math.max(0, currentIndex - 1)
      : Math.min(journalEntries.length - 1, currentIndex + 1);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  if (initialIndex === -1) {
    return (
      <div className="w-[320px] h-[620px] bg-white rounded-lg flex items-center justify-center">
        <p className="text-gray-700">Journal entry not found.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center">
        <button
          onClick={() => handleNavigation("prev")}
          disabled={currentIndex === 0}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg disabled:opacity-30 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <div className="w-full overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 md:px-20 py-8
             scrollbar-hide
             [scrollbar-width:none]
             [-ms-overflow-style:none]
             [&::-webkit-scrollbar]:hidden"
          >

            {journalEntries.map((entry, idx) => (
              <div key={entry.id} className="flex-shrink-0 snap-center">
                <ModalCard entry={entry} isCentered={currentIndex === idx} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleNavigation("next")}
          disabled={currentIndex === journalEntries.length - 1}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg disabled:opacity-30 transition-all"
          aria-label="Next"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}