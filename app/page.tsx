import Image from "next/image";
import { siteImages } from "./content";
import { getPublicCourses, getPublicDomains } from "../lib/public-data";
import DomainIcon from "../components/DomainIcon";

export default async function Home() {
  const [courses, domains] = await Promise.all([
    getPublicCourses(),
    getPublicDomains(),
  ]);
  const featuredDomains = domains.slice(0, 3);
  const hasMoreDomains = domains.length > 3;

  return (
    <main id="top">
      <section className="hero-section">
        <Image
          src={siteImages.homeHero.src}
          alt={siteImages.homeHero.alt}
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content" data-animate="hero">
          <p className="eyebrow">Expert-led weekend learning</p>
          <h1>Zenith Academy</h1>
          <p className="lead">
            Build current, field-tested skills with practicing experts through
            focused weekend courses in Islamabad.
          </p>
          <div className="hero-actions">
            <a href="/courses" className="button button-primary">
              View courses
            </a>
            <a href="/communities" className="button button-secondary">
              Join a community
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section-band" data-animate="fade">
        <div className="section-inner intro-grid">
          <div>
            <p className="eyebrow">About Zenith Academy</p>
            <h2>
              A professional learning platform operated by{" "}
              <strong className="brand-accent">Islami Jamiat Talaba</strong>,
              Islamabad Chapter.
            </h2>
          </div>
          <div className="text-stack">
            <div className="inline-photo">
              <Image
                src={siteImages.about}
                alt={siteImages.aboutAlt}
                width={720}
                height={460}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <p>
              Zenith offers expert-led weekend courses for students and young
              professionals who want applied learning beyond the classroom.
            </p>
            <p>
              Practicing professionals teach current tools, field workflows,
              and applied methods across technology, business, leadership, and
              the humanities.
            </p>
          </div>
        </div>
      </section>

      <section className="section-band vision-band" data-animate="fade">
        <div className="section-inner vision-grid">
          <div className="statement-panel">
            <p className="eyebrow">Vision</p>
            <h2>
              To build a generation excellent in character and distinguished in
              their fields, contributing to the growth of the Muslim Ummah.
            </h2>
          </div>
          <div className="meaning-panel">
            <p className="eyebrow">Behind the name</p>
            <h3>Zenith means the highest point.</h3>
            <p>
              The word Zenith originates from the Arabic term samt ar-ra&apos;s
              (سمت الرأس), a classical astronomical expression for the point
              directly overhead. Through centuries of scientific exchange, it
              entered European scholarship as zenith — the highest point.
            </p>
            <p>
              The name honors Muslim intellectual legacy and calls each student
              to pursue excellence in a field suited to their strengths.
            </p>
          </div>
        </div>
      </section>

      <section id="domains" className="section-band muted-band">
        <div className="section-inner">
          <div className="section-heading heading-row" data-animate="fade">
            <div>
              <p className="eyebrow">Learning domains</p>
              <h2>Clear learning tracks for different ambitions.</h2>
            </div>
            <p>
              Explore the workflows and outcomes in each track, then join the
              matching community or course.
            </p>
          </div>

          <div className="feature-grid" data-animate-stagger>
            {featuredDomains.map((domain, index) => (
              <article
                className={`feature-tile feature-tile-${(index % 3) + 1}`}
                key={domain.slug}
              >
                <div className="feature-tile-top">
                  <DomainIcon
                    slug={domain.slug}
                    name={domain.name}
                    className="feature-icon"
                  />
                  <span className="card-kicker">Domain</span>
                </div>
                <div className="feature-media">
                  <Image
                    src={domain.image}
                    alt={domain.imageAlt}
                    width={640}
                    height={360}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <h3>{domain.name}</h3>
                <p>{domain.line}</p>
                <ul className="chip-list">
                  {domain.themes.slice(0, 3).map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
                <div className="feature-actions">
                  <a className="button button-primary" href="/domains">
                    View domain
                  </a>
                  <a
                    className="text-link"
                    href={`/communities?domain=${encodeURIComponent(domain.slug)}`}
                  >
                    Join community
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="section-more-actions">
            <a href="/domains" className="button button-primary">
              {hasMoreDomains ? "Browse more domains" : "Browse all domains"}
            </a>
          </div>
        </div>
      </section>

      <section id="communities" className="section-band communities-band">
        <div className="section-inner">
          <div className="communities-intro" data-animate="fade">
            <div>
              <p className="eyebrow">Communities</p>
              <h2>Field communities for students who want to stay connected.</h2>
            </div>
            <p>
              Meet peers in your domain, share progress, and keep building after
              a course ends — or before you enroll.
            </p>
          </div>

          <div className="community-grid" data-animate-stagger>
            {featuredDomains.map((domain, index) => (
              <article
                className={`community-tile community-tile-${(index % 3) + 1}`}
                key={`community-${domain.slug}`}
              >
                <div className="community-tile-top">
                  <DomainIcon
                    slug={domain.slug}
                    name={domain.name}
                    className="community-icon"
                  />
                  <span className="card-kicker">Community</span>
                </div>
                <h3>{domain.name}</h3>
                <p>{domain.line}</p>
                <a
                  className="button button-primary community-join"
                  href={`/communities?domain=${encodeURIComponent(domain.slug)}`}
                >
                  Join community
                </a>
              </article>
            ))}
          </div>

          <div className="communities-actions">
            <a href="/communities" className="button button-primary">
              {hasMoreDomains
                ? "Browse more communities"
                : "Browse all communities"}
            </a>
          </div>
        </div>
      </section>

      <section id="courses" className="section-band">
        <div className="section-inner">
          <div className="section-heading heading-row" data-animate="fade">
            <div>
              <p className="eyebrow">Courses</p>
              <h2>Weekend courses structured around outcomes.</h2>
            </div>
            <p>
              Compare duration, mode, and status, then enroll with the course
              already selected in the registration form.
            </p>
          </div>

          <div className="feature-grid" data-animate-stagger>
            {courses.map((course, index) => (
              <article
                className={`feature-tile feature-tile-${(index % 3) + 1}`}
                key={course.slug || course.title}
              >
                <div className="feature-tile-top">
                  <DomainIcon
                    name={course.domain}
                    kind="course"
                    className="feature-icon"
                  />
                  <span className="status-chip">{course.status}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="meta-chips">
                  <span>
                    <DomainIcon name={course.domain} className="meta-icon" />
                    {course.domain}
                  </span>
                  <span>
                    <DomainIcon kind="calendar" className="meta-icon" />
                    {course.duration}
                  </span>
                  <span>{course.mode}</span>
                </div>
                <div className="feature-actions">
                  <a
                    className="button button-primary"
                    href={
                      course.slug
                        ? `/registration?course=${encodeURIComponent(course.slug)}`
                        : "/registration"
                    }
                  >
                    Enroll now
                  </a>
                  <a className="text-link" href="/courses">
                    Full details
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="instructors" className="section-band muted-band" data-animate="fade">
        <div className="section-inner instructor-layout">
          <div>
            <p className="eyebrow">Instructors</p>
            <h2>Practitioners who teach from field experience.</h2>
            <div className="benefit-list" data-animate-stagger>
              <div className="benefit-item">
                <DomainIcon kind="users" className="benefit-icon" />
                <div>
                  <strong>Current practitioners</strong>
                  <p>Learn from people whose roles match the subject.</p>
                </div>
              </div>
              <div className="benefit-item">
                <DomainIcon kind="certificate" className="benefit-icon" />
                <div>
                  <strong>Verified certificate</strong>
                  <p>Receive a Zenith Academy certificate on completion.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-stack">
            <div className="inline-photo">
              <Image
                src={siteImages.instructor}
                alt={siteImages.instructorAlt}
                width={720}
                height={460}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-band jamiat-band" data-animate="fade">
        <div className="section-inner intro-grid">
          <div>
            <p className="eyebrow">About Jamiat</p>
            <h2>A student organization with a national educational mission.</h2>
          </div>
          <div className="text-stack">
            <p>
              <span className="brand-accent">Islami Jamiat Talaba</span> is
              Pakistan&apos;s largest and longest-running student organization,
              with a presence across neighbourhoods, universities, and colleges
              nationwide.
            </p>
            <p>
              Zenith is part of that mission: structured learning from
              practitioners, peer communities in each field, and lasting
              professional networks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
