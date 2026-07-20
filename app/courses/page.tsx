import Image from "next/image";
import { getPublicCourses } from "../../lib/public-data";

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <main>
      <section className="page-hero">
        <Image
          src={courses[0].image}
          alt={courses[0].imageAlt}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content">
          <p className="eyebrow">Courses</p>
          <h1>Choose a course built around applied outcomes.</h1>
          <p>
            Compare the audience, prerequisites, 6-session plan, fee, and
            certificate before you register.
          </p>
        </div>
      </section>

      <section className="section-band muted-band">
        <div className="section-inner course-detail-list">
          {courses.map((course) => (
            <article className="detail-page-card" key={course.title}>
              <div className="detail-page-header">
                <div>
                  <span className="card-kicker">Course</span>
                  <h2>{course.title}</h2>
                  <p className="strong-line">{course.description}</p>
                  <dl className="meta-list">
                    <div>
                      <dt>Domain</dt>
                      <dd>{course.domain}</dd>
                    </div>
                    <div>
                      <dt>Duration</dt>
                      <dd>{course.duration}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{course.status}</dd>
                    </div>
                  </dl>
                </div>
                <a className="button button-primary" href="/registration">
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
                  <ul className="theme-list">
                    {course.prerequisites.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <aside className="side-panel">
                  <h3>Instructors</h3>
                  <p>
                    Learn from practicing professionals whose current roles and
                    projects match this course.
                  </p>

                  <h3>Certification</h3>
                  <p>
                    Upon successful completion, students receive a{" "}
                    <strong>Zenith Academy Certificate</strong> in {course.title},
                    verified and issued by the academy.
                  </p>

                  <h3>Enrollment</h3>
                  <p>
                    <strong>Fee:</strong> {course.fee}
                    <br />
                    <strong>Seats available:</strong> {course.seats}
                  </p>
                </aside>
              </div>

              <div className="breakdown-table" role="table">
                <div className="breakdown-row breakdown-head" role="row">
                  <span role="columnheader">Session</span>
                  <span role="columnheader">Topic</span>
                </div>
                {course.sessions.map((session, index) => (
                  <div className="breakdown-row" role="row" key={session}>
                    <span role="cell">Session {index + 1}</span>
                    <span role="cell">{session}</span>
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
