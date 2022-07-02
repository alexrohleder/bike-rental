export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);

  return date.toLocaleString([], {
    dateStyle: "full",
    timeStyle: "short",
  });
};
