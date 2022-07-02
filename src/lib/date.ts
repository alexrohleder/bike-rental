export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString([], {
    dateStyle: "long",
  });
};

export const addDays = (dateStr: string, days: number) => {
  return new Date(new Date(dateStr).getTime() + days * 24 * 60 * 60 * 1000);
};
