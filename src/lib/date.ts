export const formatDate = (date: string | number | Date) => {
  const today = new Date().toLocaleString([], { dateStyle: "long" });
  const formatted = new Date(date).toLocaleString([], { dateStyle: "long" });

  return formatted === today ? "Today" : formatted;
};

export const addDays = (dateStr: string, days: number) => {
  return new Date(new Date(dateStr).getTime() + days * 24 * 60 * 60 * 1000);
};
