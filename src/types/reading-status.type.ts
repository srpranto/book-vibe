export type ReadingStatusValue =
  | "reading"
  | "completed"
  | "plan_to_read"
  | "on_hold"
  | "dropped"
  | "re_reading";

export interface ReadingStatusOption {
  value: ReadingStatusValue;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  borderColor: string;
}

export const READING_STATUS_OPTIONS: ReadingStatusOption[] = [
  {
    value: "reading",
    label: "Reading",
    emoji: "📖",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
  },
  {
    value: "completed",
    label: "Completed",
    emoji: "✅",
    color: "bg-[#F0F8EC]",
    textColor: "text-green-700",
    borderColor: "border-green-300",
  },
  {
    value: "plan_to_read",
    label: "Plan to Read",
    emoji: "🔖",
    color: "bg-[#FAF6F0]",
    textColor: "text-[#8B5A2B]",
    borderColor: "border-[#D4A373]",
  },
  {
    value: "on_hold",
    label: "On Hold",
    emoji: "⏸️",
    color: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
  },
  {
    value: "dropped",
    label: "Dropped",
    emoji: "❌",
    color: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
  },
  {
    value: "re_reading",
    label: "Re-Reading",
    emoji: "🔄",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
  },
];
