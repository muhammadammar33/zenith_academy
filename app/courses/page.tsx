import Image from "next/image";
import { getPublicCourses } from "../../lib/public-data";
import DomainIcon from "../../components/DomainIcon";

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <main>
      <section className="page-hero">
        <Image
          src={"/images/courses.JPG"}
          alt={courses[0]?.imageAlt ?? "Zenith Academy courses"}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content" data-animate="hero">
          <p className="eyebrow">Courses</p>
          <h1>Choose a course built around applied outcomes.</h1>
          <p>
            Compare audience, prerequisites, the 6-session plan, fee, and
            certificate — then enroll with one tap.
          </p>
        </div>
      </section>

      <section className="section-band muted-band">
        <div className="section-inner course-detail-list" data-animate-stagger>
          {courses.map((course, index) => (
            <article
              className={`detail-page-card detail-accent-${(index % 3) + 1}`}
              key={course.slug || course.title}
            >
              <div className="detail-page-header">
                <div>
                  <div className="detail-kicker-row">
                    <DomainIcon
                      name={course.domain}
                      kind="course"
                      className="detail-icon"
                    />
                    <span className="card-kicker">Course</span>
                  </div>
                  <h2>{course.title}</h2>
                  <p className="strong-line">{course.description}</p>
                  <div className="meta-chips">
                    <span>
                      <DomainIcon name={course.domain} className="meta-icon" />
                      {course.domain}
                    </span>
                    <span>
                      <DomainIcon kind="calendar" className="meta-icon" />
                      {course.duration}
                    </span>
                    <span className="status-chip">{course.status}</span>
                  </div>
                </div>
                <a
                  className="button button-primary enroll-cta"
                  href={
                    course.slug
                      ? `/registration?course=${encodeURIComponent(course.slug)}`
                      : "/registration"
                  }
                >
                  Enroll now
                </a>
              </div>

              <div className="content-columns wide-left">
                <div>
                  <div className="detail-media">
                    <Image
                      src={course.image}
                      alt={course.imageAlt}
                      width={820}
                      height={500}
                      sizes="(max-width: 900px) 100vw, 58vw"
                    />
                  </div>
                  <h3>About this course</h3>
                  <p>{course.about}</p>
                  <p>{course.takeaway}</p>

                  <h3>Who is this for?</h3>
                  <p>{course.audience}</p>

                  <h3>Prerequisites</h3>
                  <ul className="chip-list">
                    {course.prerequisites.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <aside className="side-panel sticky-panel">
                  <div className="side-panel-block">
                    <DomainIcon kind="users" className="benefit-icon" />
                    <h3>Instructors</h3>
                    <p>
                      Learn from practicing professionals whose current roles
                      match this course.
                    </p>
                  </div>

                  <div className="side-panel-block">
                    <DomainIcon kind="certificate" className="benefit-icon" />
                    <h3>Certification</h3>
                    <p>
                      Successful students receive a{" "}
                      <strong>Zenith Academy Certificate</strong> in{" "}
                      {course.title}.
                    </p>
                  </div>

                  <div className="side-panel-block enrollment-box">
                    <h3>Enrollment</h3>
                    <p>
                      <strong>Fee:</strong> {course.fee}
                      <br />
                      <strong>Seats:</strong> {course.seats}
                      <br />
                      <strong>Mode:</strong> {course.mode}
                    </p>
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
                  </div>
                </aside>
              </div>

              <div className="session-steps">
                {course.sessions.map((session, sessionIndex) => (
                  <article className="session-step" key={session}>
                    <span>Session {sessionIndex + 1}</span>
                    <strong>{session}</strong>
                  </article>
                ))}
              </div>

              <div className="mobile-enroll-bar">
                <div>
                  <strong>{course.fee}</strong>
                  <small>{course.seats} seats</small>
                </div>
                <a
                  className="button button-primary"
                  href={
                    course.slug
                      ? `/registration?course=${encodeURIComponent(course.slug)}`
                      : "/registration"
                  }
                >
                  Enroll
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
