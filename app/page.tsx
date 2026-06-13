import Image from "next/image";
import { courses, domains, registrationSections, siteImages } from "./content";

export default function Home() {
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
        <div className="hero-content">
          <p className="eyebrow">Weekend professional learning</p>
          <h1>Zenith Academy</h1>
          <p className="lead">
            Practical, high-quality short courses for students and young
            professionals who want learning beyond routine coursework.
          </p>
          <div className="hero-actions">
            <a href="/courses" className="button button-primary">
              View Courses
            </a>
            <a href="/registration" className="button button-secondary">
              Register Interest
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section-band section-intro">
        <div className="section-inner intro-grid">
          <div>
            <p className="eyebrow">What is Zenith Academy?</p>
            <h2>
              A professional learning platform operated by{" "}
              <strong className="text-sky-400">Islami Jamiat Talaba</strong>,
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
              Zenith offers short, weekend-based courses for students and young
              professionals who want practical, high-quality learning beyond the
              classroom.
            </p>
            <br />
            <p>
              Courses are designed and taught by experienced practitioners
              working in their respective fields, with a focus on relevant
              skills, emerging trends, and real-world application across
              technology, business, sciences, leadership, and the humanities.
            </p>
          </div>
        </div>
      </section>

      <section className="section-band vision-band">
        <div className="section-inner vision-grid">
          <div className="statement-panel">
            <p className="eyebrow">Vision Statement</p>
            <h2>
              To build a generation excellent in character and distinguished in
              their fields, united in their contribution to the Muslim Ummah.
            </h2>
          </div>
          <div className="meaning-panel">
            <p className="eyebrow">Behind the name</p>
            <h3>Zenith means the highest point.</h3>
            <p>
              The word Zenith originates from the Arabic term samt ar-ra&apos;s
              (سمت الرأس) a classical astronomical expression referring to the
              point directly overhead. Through centuries of scientific and
              intellectual exchange, the term entered European scholarship and
              eventually became the English word zenith, meaning the highest
              point or peak.
            </p>
            <br />
            <p>The name reflects two ideas central to the academy.</p>
            <br />
            <p>
              First, it acknowledges the intellectual legacy of Muslim
              civilization and its contribution to fields such as mathematics,
              astronomy, medicine, and philosophy.
            </p>
            <br />
            <p>
              Second, it represents our belief that every student should strive
              to reach their highest potential, excelling in their own field
              according to their strengths, interests, and circumstances.
            </p>
          </div>
        </div>
      </section>

      <section id="domains" className="section-band">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Domain Details</p>
            <h2>
              Clear learning tracks for students with different ambitions.
            </h2>
          </div>
          <div className="domain-grid">
            {domains.map((domain) => (
              <article className="info-card" key={domain.name}>
                <div className="card-image">
                  <Image
                    src={domain.image}
                    alt={domain.imageAlt}
                    width={640}
                    height={420}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <span className="card-kicker">Domain</span>
                <h3>{domain.name}</h3>
                <p>{domain.line}</p>
                <ul className="theme-list">
                  {domain.themes.map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
                <a className="text-link" href="/domains">
                  View domain details
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="section-band muted-band">
        <div className="section-inner">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">Course Details</p>
              <h2>Weekend courses structured around outcomes.</h2>
            </div>
            <p>
              Browse the course detail page for about, audience, prerequisites,
              session breakdown, instructors, certification, and enrollment
              information.
            </p>
          </div>

          <div className="course-table" role="table" aria-label="Course status">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Course</span>
              <span role="columnheader">Duration</span>
              <span role="columnheader">Mode</span>
              <span role="columnheader">Status</span>
            </div>
            {courses.map((course) => (
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

          <a href="/courses" className="button button-primary section-action">
            Open Course Details
          </a>

          <div className="visual-strip">
            {courses.map((course) => (
              <div className="strip-image" key={course.title}>
                <Image
                  src={course.image}
                  alt={course.imageAlt}
                  width={520}
                  height={340}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>

          <div className="course-detail-grid">
            <article className="detail-block">
              <p className="eyebrow">About each course</p>
              <h3>What students can expect</h3>
              <p>
                Each course page should explain the field, why it matters now,
                the gap it helps students close, and what a learner walks away
                with: a skill, a mindset, a product, or a certificate.
              </p>
            </article>
            <article className="detail-block">
              <p className="eyebrow">Course breakdown</p>
              <h3>Six-session format</h3>
              <ol className="session-list">
                <li>Session 1: Topic foundation</li>
                <li>Session 2: Applied concepts</li>
                <li>Session 3: Guided practice</li>
                <li>Session 4: Field workflow</li>
                <li>Session 5: Project or case work</li>
                <li>Session 6: Review and next steps</li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section id="instructors" className="section-band">
        <div className="section-inner instructor-layout">
          <div className="section-heading">
            <p className="eyebrow">Your Instructors</p>
            <h2>Practitioners who teach from field experience.</h2>
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
            <p>
              Instructor profiles should focus on current roles, real work,
              relevant projects, and the field credibility a student would want
              in the room.
            </p>
            <p>
              Upon successful completion, students receive a Zenith Academy
              Certificate in their course, verified and issued by the academy.
            </p>
          </div>
        </div>
      </section>

      <section id="registration" className="section-band registration-band">
        <div className="section-inner registration-grid">
          <div>
            <p className="eyebrow">Registration</p>
            <h2>
              Collect the right details without making enrollment feel heavy.
            </h2>
            <p>
              The form flow below matches the PPTX requirements: personal
              information, academic information, course selection, and payment
              proof.
            </p>
            <ul className="check-list">
              {registrationSections.map((section) => (
                <li key={section.title}>{section.title}</li>
              ))}
            </ul>
            <a href="/registration" className="button button-primary">
              Open Registration
            </a>
          </div>
          <form className="registration-form">
            <div className="form-image">
              <Image
                src={siteImages.registration}
                alt={siteImages.registrationAlt}
                width={720}
                height={460}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <label>
              Full name
              <input type="text" placeholder="Student name" />
            </label>
            <label>
              Email address
              <input type="email" placeholder="name@example.com" />
            </label>
            <label>
              Select a course
              <select defaultValue="">
                <option value="" disabled>
                  Choose an open course
                </option>
                <option>New weekend courses</option>
                <option>Practitioner-led workshops</option>
                <option>Domain-focused cohorts</option>
              </select>
            </label>
            <div className="fee-strip">
              <span>Fee and mode</span>
              <strong>Auto-populates after course selection</strong>
            </div>
            <label>
              Payment receipt
              <input type="file" />
            </label>
            <button className="button button-primary" type="submit">
              Submit Registration
            </button>
          </form>
        </div>
      </section>

      <section className="section-band jamiat-band">
        <div className="section-inner intro-grid">
          <div>
            <p className="eyebrow">About Jamiat</p>
            <h2>A student organization with a national educational mission.</h2>
          </div>
          <div>
            <p>
              <span className="font-bold text-sky-400">
                Islami Jamiat Talaba
              </span>{" "}
              is Pakistan&apos;s largest and longest-running student
              organization, with a presence across neighbourhoods, universities,
              and colleges nationwide. For decades, it has worked to develop
              students intellectually, morally, and socially through organized
              educational and community initiatives.
            </p>
            <br />
            <p>
              Zenith is part of that broader mission. It provides a structured
              and professional platform through which students can access
              quality learning, connect with experienced mentors, and build
              networks that support both personal and professional growth.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
