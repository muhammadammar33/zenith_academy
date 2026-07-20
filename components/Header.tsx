import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
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
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            <li>
              <a className="nav-link" href="/#about">
                About
              </a>
            </li>
            <li>
              <a className="nav-link" href="/domains">
                Domains
              </a>
            </li>
            <li>
              <a className="nav-link" href="/courses">
                Courses
              </a>
            </li>
            <li>
              <a className="nav-link" href="/registration">
                Registration
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
