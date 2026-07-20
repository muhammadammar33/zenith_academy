import Image from "next/image";

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
        <div className="footer-links">
          <a className="nav-link" href="/#about">
            About
          </a>
          <a className="nav-link" href="/courses">
            Courses
          </a>
          <a className="nav-link" href="/registration">
            Register
          </a>
        </div>
      </div>
    </footer>
  );
}
