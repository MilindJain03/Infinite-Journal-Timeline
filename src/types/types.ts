export interface Day {
  date: string;
  day: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  journals?: JournalEntry[];
}

export interface MonthGridProps {
  days: Day[];
}

export interface JournalEntry {
  id: number;
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string;
  description: string;
  index: number;
}