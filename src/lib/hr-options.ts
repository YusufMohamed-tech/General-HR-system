export const demoCityOptions = [
  "New York",
  "Chicago",
  "Dallas",
  "Atlanta",
  "Denver",
  "Seattle",
  "Los Angeles",
  "Boston",
  "Austin",
  "Phoenix",
  "Miami",
  "Portland",
  "Remote",
  "Hybrid",
];

export const educationLevelOptions = [
  "High School",
  "Diploma",
  "Bachelor",
  "Master",
  "Doctorate",
  "Professional Certificate",
];

export const bankOptions = [
  "First National Bank",
  "Union Trust Bank",
  "Metro Commercial Bank",
  "Capital Credit Union",
  "Evergreen Bank",
  "Pioneer Financial",
  "Atlas Bank",
  "Summit Bank",
  "Northstar Bank",
  "Global Payroll Bank",
];

export const leaveTypeOptions = [
  { value: "vacation", label: "Vacation", requiresAttachment: false },
  { value: "sick", label: "Sick Leave", requiresAttachment: true },
  { value: "unpaid", label: "Unpaid Leave", requiresAttachment: false },
  { value: "weekly", label: "Weekly Rest", requiresAttachment: false },
  { value: "marriage", label: "Marriage Leave", requiresAttachment: true },
  { value: "bereavement", label: "Bereavement", requiresAttachment: true },
  { value: "emergency", label: "Emergency", requiresAttachment: false },
] as const;

export const leaveTypeLabels = Object.fromEntries(
  leaveTypeOptions.map((option) => [option.value, option.label])
) as Record<string, string>;

export function leaveTypeRequiresAttachment(leaveType: string) {
  return Boolean(leaveTypeOptions.find((option) => option.value === leaveType)?.requiresAttachment);
}

export function inclusiveDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}
