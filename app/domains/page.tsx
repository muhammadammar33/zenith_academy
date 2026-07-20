import Image from "next/image";
import { getPublicCourses, getPublicDomains } from "../../lib/public-data";

export default async function DomainsPage() {
  const [courses, domains] = await Promise.all([
    getPublicCourses(),
    getPublicDomains(),
  ]);

  return (
    <main>
      <section className="page-hero">
        <Image
          src={domains[0].image}
          alt={domains[0].imageAlt}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content">
          <p className="eyebrow">Learning domains</p>
          <h1>Domains that give students a clear learning direction.</h1>
          <p>
            Compare the workflows, outcomes, and current courses in each
            learning track.
          </p>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner domain-detail-list">
          {domains.map((domain) => (
            <article className="detail-page-card" key={domain.slug}>
              <div className="detail-page-header">
                <div>
                  <span className="card-kicker">Domain</span>
                  <h2>{domain.name}</h2>
                  <p className="strong-line">{domain.line}</p>
                </div>
                <a className="button button-primary" href="/courses">
                  View courses
                </a>
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
                <div>
                  <h3>What you&apos;ll find here</h3>
                  <ul className="theme-list">
                    {domain.themes.map((theme) => (
                      <li key={theme}>{theme}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="course-table compact-table" role="table">
                <div className="table-row table-head" role="row">
                  <span role="columnheader">Course</span>
                  <span role="columnheader">Duration</span>
                  <span role="columnheader">Mode</span>
                  <span role="columnheader">Status</span>
                </div>
                {courses
                  .filter((course) => domain.courses.includes(course.title))
                  .map((course) => (
                    <div className="table-row" role="row" key={course.title}>
                      <span role="cell">{course.title}</span>
                      <span role="cell">{course.duration}</span>
                      <span role="cell">{course.mode}</span>
                      <span role="cell">
                        <strong>{course.status}</strong>
                      </span>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
