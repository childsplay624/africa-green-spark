import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export const Counter = ({ value, suffix = "", duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = performance.now();
          const startValue = 0;
          const endValue = value;
          const range = endValue - startValue;
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = startValue + range * easeOutQuart;
            
            setCount(Number(currentCount.toFixed(value % 1 === 0 ? 0 : 1)));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };
          
          requestAnimationFrame(animate);
          
          // Cleanup observer
          if (counterRef.current) {
            observer.unobserve(counterRef.current);
          }
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [value, duration]);

  // Format the number without commas
  const formatNumber = (num: number) => {
    return num.toString();
  };

  return <span ref={counterRef}>{formatNumber(count)}{suffix}</span>;
};
