"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PageMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        root.querySelectorAll<HTMLElement>("[data-animate], [data-animate-stagger] > *").forEach(
          (el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        );
        return;
      }

      const heroBits = root.querySelectorAll<HTMLElement>("[data-animate='hero'] > *");
      if (heroBits.length) {
        gsap.from(heroBits, {
          opacity: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform",
        });
      }

      root.querySelectorAll<HTMLElement>("[data-animate='fade']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-animate-stagger]").forEach((group) => {
        const items = group.children;
        if (!items.length) {
          return;
        }

        gsap.from(items, {
          opacity: 0,
          y: 26,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: group,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className="page-motion-root">
      {children}
    </div>
  );
}
