import { useMemo } from "react";

export const useQueryParams = () => {
  const params = useMemo(() => {
    const searchString = window.location.href.split('?')[1] || ''; 
    const searchParams = new URLSearchParams(searchString);
    return {
      isPanelOpen: searchParams.get('openPanel'),
      panelRoute: searchParams.get('route')
    }
  }, []);

  return params;
}
