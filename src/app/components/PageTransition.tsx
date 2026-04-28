import { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const transitionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Transition in
      const tl = gsap.timeline();

      tl.fromTo(
        transitionRef.current,
        { scaleY: 0, transformOrigin: 'bottom' },
        {
          scaleY: 1,
          duration: 0.5,
          ease: 'power3.inOut',
        }
      )
        .to(transitionRef.current, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.5,
          ease: 'power3.inOut',
          delay: 0.1,
        })
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.3'
        );
    });

    // Scroll to top on route change
    window.scrollTo(0, 0);

    return () => ctx.revert();
  }, [location]);

  return (
    <>
      {/* Transition Overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 bg-gradient-to-br from-red-600 to-red-800 z-50 pointer-events-none"
        style={{ scaleY: 0 }}
      />

      {/* Content */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
