import Image from "next/image";
import { registrationSections, siteImages } from "./content";
import { getPublicCourses, getPublicDomains } from "../lib/public-data";

export default async function Home() {
  const [courses, domains] = await Promise.all([
    getPublicCourses(),
    getPublicDomains(),
  ]);

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
            <a href="/registration" className="button button-secondary">
              Register interest
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section-band section-intro">
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
            <br />
            <p>
              Practicing professionals teach current tools, field workflows,
              and applied methods across technology, business, leadership, and
              the humanities.
            </p>
          </div>
        </div>
      </section>

      <section className="section-band vision-band">
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
              Second, it calls each student to pursue excellence in a field
              suited to their strengths, interests, and circumstances.
            </p>
          </div>
        </div>
      </section>

      <section id="objectives" className="section-band muted-band">
        <div className="section-inner">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">Our objectives</p>
              <h2>Learning that strengthens skill, community, and continuity.</h2>
            </div>
            <p>
              Zenith combines expert instruction, field-based communities, and
              a sustainable model that can serve students over the long term.
            </p>
          </div>
          <div className="objectives-grid">
            <article className="objective-card">
              <span className="objective-number">01</span>
              <span className="card-kicker" lang="ur" dir="rtl">
                تربیتی
              </span>
              <h3>Skill building</h3>
              <p>
                Establish a source of quality learning led by practicing
                experts.
              </p>
            </article>
            <article className="objective-card">
              <span className="objective-number">02</span>
              <span className="card-kicker" lang="ur" dir="rtl">
                دعوتی
              </span>
              <h3>Field-based engagement</h3>
              <p>
                Build field-based communities where students learn, connect,
                and grow their professional networks.
              </p>
            </article>
            <article className="objective-card">
              <span className="objective-number">03</span>
              <span className="card-kicker">Sustainable growth</span>
              <h3>Revenue generation</h3>
              <p>
                Maintain a responsible revenue model that keeps the academy
                self-sustaining.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="domains" className="section-band">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">Learning domains</p>
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
              <p className="eyebrow">Courses</p>
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
            Explore courses
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
              <h3>What you will practice</h3>
              <p>
                Review the field, practice its current workflows, and complete
                a case or project. Each course ends with clear next steps and a
                certificate for successful completion.
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
            <p className="eyebrow">Instructors</p>
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
              Learn from practicing professionals whose current roles and
              projects match the subject they teach.
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
              Join the next expert-led cohort.
            </h2>
            <p>
              Share your personal and academic details, select a course, and
              upload payment proof in one focused form.
            </p>
            <ul className="check-list">
              {registrationSections.map((section) => (
                <li key={section.title}>{section.title}</li>
              ))}
            </ul>
            <a href="/registration" className="button button-primary">
              Open registration
            </a>
          </div>
          <div className="registration-form">
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
            <a className="button button-primary" href="/registration">
              Complete registration
            </a>
          </div>
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
              <span className="brand-accent">
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
              platform where students learn from experienced practitioners,
              meet peers in their fields, and build lasting professional
              networks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
