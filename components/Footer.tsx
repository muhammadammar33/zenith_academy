export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Zenith Academy</div>
          <p>
            Operated by{" "}
            <span className="font-bold text-sky-400">
              Islami Jamiat Talaba
            </span>
            , Islamabad Chapter.
          </p>
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
