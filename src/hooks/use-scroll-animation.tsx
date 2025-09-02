import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-in' | 'scale-in' | 'fade-up';
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0 
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  const animationClasses = {
    'fade-in': 'opacity-0 transition-all duration-700 ease-out',
    'slide-in': 'opacity-0 transform translate-x-8 transition-all duration-700 ease-out',
    'scale-in': 'opacity-0 transform scale-95 transition-all duration-700 ease-out',
    'fade-up': 'opacity-0 transform translate-y-8 transition-all duration-700 ease-out'
  };

  const visibleClasses = {
    'fade-in': 'opacity-100',
    'slide-in': 'opacity-100 transform translate-x-0',
    'scale-in': 'opacity-100 transform scale-100',
    'fade-up': 'opacity-100 transform translate-y-0'
  };

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation]} ${isVisible ? visibleClasses[animation] : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}