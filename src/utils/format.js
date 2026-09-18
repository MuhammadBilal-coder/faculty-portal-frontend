export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateInput) {
  const value = new Date(dateInput);
  const diffInSeconds = Math.floor((Date.now() - value.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function paginate(items, currentPage = 1, pageSize = 5) {
  const offset = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(offset, offset + pageSize);

  return {
    totalItems: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    currentPage,
    pageSize,
    items: paginatedItems,
  };
}

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
