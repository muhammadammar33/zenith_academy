import Image from "next/image";

const FOOTER_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/domains", label: "Domains" },
  { href: "/courses", label: "Courses" },
  { href: "/communities", label: "Communities" },
  { href: "/registration", label: "Register" },
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={48}
            height={48}
            className="footer-logo-icon"
          />
          <div>
            <div className="footer-logo">Zenith Academy</div>
            <p>
              Operated by{" "}
              <span className="brand-accent">Islami Jamiat Talaba</span>,
              Islamabad Chapter.
            </p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
