export function getMessageTime(createdAt: string): string {
  const date = new Date(createdAt);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
