import { useEffect, useRef } from "react";

// Fires callback when sentinel element enters the viewport
const useInfiniteScroll = (callback, hasMore) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, hasMore]);

  return sentinelRef;
};

export default useInfiniteScroll;