"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/domains", label: "Domains" },
  { href: "/courses", label: "Courses" },
  { href: "/communities", label: "Communities" },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function onResize() {
      if (window.matchMedia("(min-width: 901px)").matches) {
        setMenuOpen(false);
      }
    }

    function onScroll() {
      setScrolled(window.scrollY > 16);
    }

    onScroll();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="header-inner">
        <a href="/#top" className="logo" aria-label="Zenith Academy home">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={160}
            height={160}
            priority
            className="brand-logo-icon"
          />
          <span className="brand-wordmark">
            <strong>Zenith</strong>
            <span>Academy</span>
          </span>
        </a>

        <nav
          id={menuId}
          className={menuOpen ? "site-nav site-nav-open" : "site-nav"}
          aria-label="Primary navigation"
        >
          <ul className="nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="nav-link"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-mobile-cta">
              <a
                className="button button-primary"
                href="/registration"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </a>
            </li>
            <li className="nav-mobile-cta">
              <a
                className="button button-secondary"
                href="/communities"
                onClick={() => setMenuOpen(false)}
              >
                Join community
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <a className="button button-primary header-cta" href="/registration">
            Register
          </a>
          <button
            type="button"
            className={menuOpen ? "nav-toggle nav-toggle-open" : "nav-toggle"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
