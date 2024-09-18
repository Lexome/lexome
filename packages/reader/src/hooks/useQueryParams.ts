type SearchParams = {
  bookId: string | null
}

export const useQueryParams = (): SearchParams => {
  if (typeof window === 'undefined') return {
    bookId: null
  };

  const searchString = window.location.href.split('?')[1] || '';
  const searchParams = new URLSearchParams(searchString);

  return {
    bookId: searchParams.get('bookId'),
  }
} 