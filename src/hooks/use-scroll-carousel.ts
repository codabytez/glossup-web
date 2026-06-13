import { useRef, useState, type UIEvent } from "react";

export function useScrollCarousel(scrollAmount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollPrev = () => scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  const scrollNext = () => scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });

  return { scrollRef, canScrollPrev, canScrollNext, onScroll, scrollPrev, scrollNext };
}
