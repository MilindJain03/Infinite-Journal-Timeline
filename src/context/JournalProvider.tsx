import type { JournalEntry } from "../types/types";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { journalEntries as sampleEntries } from "../data/journalEntries";
import { compareDesc, parse } from "date-fns";

export type NewJournalEntryData = Omit<JournalEntry, "id" | "index">;
export type UpdateJournalEntryData = Partial<NewJournalEntryData>;

const entriesWithId = sampleEntries.map((entry, index) => ({
  ...entry,
  id: Date.now() + index,
  index,
}));

export type IndexedJournalEntries = Record<string, JournalEntry[]>;

interface JournalContextData {
  journalEntries: JournalEntry[];
  entriesByDate: IndexedJournalEntries;
  filteredEntries: JournalEntry[];
  toggleCategoryFilter: (category: string) => void;
  categories: string[];
  activeCategory: string | null;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addJournalEntry: (entryData: NewJournalEntryData) => void;
  updateJournalEntry: (entryId: number, updates: UpdateJournalEntryData) => void;
  deleteJournalEntry: (entryId: number) => void;
}

const JournalEntryContext = createContext<JournalContextData | null>(null);

export function useJournalEntries() {
  const ctx = useContext(JournalEntryContext);
  if (!ctx) throw Error("JournalEntryContext is missing a provider.");
  return ctx;
}

export default function JournalProvider({ children }: PropsWithChildren) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const savedEntries = localStorage.getItem("journalEntries");
      return savedEntries ? JSON.parse(savedEntries) : entriesWithId;
    } catch (error) {
      console.error("Failed to parse journal entries from localStorage", error);
      return entriesWithId;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    return localStorage.getItem("activeCategory") || null;
  });
  
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return localStorage.getItem("searchQuery") || "";
  });

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    if (activeCategory) {
      localStorage.setItem("activeCategory", activeCategory);
    } else {
      localStorage.removeItem("activeCategory");
    }
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  const sortedEntries = useMemo(
    () =>
      journalEntries
        .sort((a, b) =>
          compareDesc(
            parse(a.date, "dd/MM/yyyy", new Date()),
            parse(b.date, "dd/MM/yyyy", new Date())
          )
        )
        .map((entry, index) => ({ ...entry, index })),
    [journalEntries]
  );

  const categories = useMemo(() => {
    const allCategories = new Set(journalEntries.flatMap((entry) => entry.categories));
    return [...Array.from(allCategories)];
  }, [journalEntries]);

  const toggleCategoryFilter = (category: string) => {
    setActiveCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
  };

  const addJournalEntry = useCallback((entryData: NewJournalEntryData) => {
    setJournalEntries((currentEntries) => {
      const newEntry: JournalEntry = { ...entryData, id: Date.now(), index: 0 };
      return [...currentEntries, newEntry];
    });
  }, []);

  const updateJournalEntry = useCallback(
    (entryId: number, updates: UpdateJournalEntryData) => {
      setJournalEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        )
      );
    },
    []
  );

  const deleteJournalEntry = useCallback((entryId: number) => {
    setJournalEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== entryId)
    );
  }, []);

  const filteredEntries = useMemo(() => {
    return sortedEntries.filter((entry) => {
      const searchMatch = entry.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const categoryMatch =
        !activeCategory || entry.categories.includes(activeCategory);
      return searchMatch && categoryMatch;
    });
  }, [sortedEntries, activeCategory, searchQuery]);

  const entriesByDate = useMemo(() => {
    return filteredEntries.reduce((acc: IndexedJournalEntries, entry) => {
      const { date } = entry;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});
  }, [filteredEntries]);

  return (
    <JournalEntryContext.Provider
      value={{
        journalEntries: sortedEntries,
        entriesByDate,
        filteredEntries,
        toggleCategoryFilter,
        categories,
        activeCategory,
        setSearchQuery,
        clearFilters,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
      }}
    >
      {children}
    </JournalEntryContext.Provider>
  );
}
