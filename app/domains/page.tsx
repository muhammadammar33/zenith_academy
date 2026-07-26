import Image from "next/image";
import { getPublicCourses, getPublicDomains } from "../../lib/public-data";
import DomainIcon from "../../components/DomainIcon";

export default async function DomainsPage() {
  const [courses, domains] = await Promise.all([
    getPublicCourses(),
    getPublicDomains(),
  ]);

  return (
    <main>
      <section className="page-hero">
        <Image
          src={domains[0]?.image ?? "/images/logo-icon.png"}
          alt={domains[0]?.imageAlt ?? "Zenith Academy domains"}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content" data-animate="hero">
          <p className="eyebrow">Learning domains</p>
          <h1>Domains that give students a clear learning direction.</h1>
          <p>
            Compare workflows, outcomes, and current courses in each track —
            then join the community or enroll.
          </p>
        </div>
      </section>

      <section className="section-band muted-band">
        <div className="section-inner domain-detail-list" data-animate-stagger>
          {domains.map((domain, index) => {
            const domainCourses = courses.filter((course) =>
              domain.courses.includes(course.title)
            );

            return (
              <article
                className={`detail-page-card detail-accent-${(index % 3) + 1}`}
                key={domain.slug}
              >
                <div className="detail-page-header">
                  <div>
                    <div className="detail-kicker-row">
                      <DomainIcon
                        slug={domain.slug}
                        name={domain.name}
                        className="detail-icon"
                      />
                      <span className="card-kicker">Domain</span>
                    </div>
                    <h2>{domain.name}</h2>
                    <p className="strong-line">{domain.line}</p>
                  </div>
                  <div className="detail-header-actions">
                    <a
                      className="button button-primary"
                      href={`/communities?domain=${encodeURIComponent(domain.slug)}`}
                    >
                      Join community
                    </a>
                    <a className="button button-outline" href="/courses">
                      View courses
                    </a>
                  </div>
                </div>

                <div className="content-columns">
                  <div>
                    <div className="detail-media">
                      <Image
                        src={domain.image}
                        alt={domain.imageAlt}
                        width={760}
                        height={460}
                        sizes="(max-width: 900px) 100vw, 60vw"
                      />
                    </div>
                    <h3>About this domain</h3>
                    <p>{domain.about}</p>
                    <p>{domain.outcome}</p>
                  </div>
                  <aside className="side-panel">
                    <h3>What you&apos;ll find here</h3>
                    <ul className="chip-list vertical-chips">
                      {domain.themes.map((theme) => (
                        <li key={theme}>{theme}</li>
                      ))}
                    </ul>
                  </aside>
                </div>

                {domainCourses.length ? (
                  <div className="related-course-grid">
                    {domainCourses.map((course) => (
                      <article className="mini-course-card" key={course.title}>
                        <div className="feature-tile-top">
                          <DomainIcon kind="course" className="meta-icon large" />
                          <span className="status-chip">{course.status}</span>
                        </div>
                        <h3>{course.title}</h3>
                        <div className="meta-chips compact">
                          <span>{course.duration}</span>
                          <span>{course.mode}</span>
                        </div>
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
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="empty-note">Courses for this domain are opening soon.</p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
