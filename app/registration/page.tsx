"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { courses, registrationSections, siteImages } from "../content";

const paymentDetails = {
  "Bank transfer": {
    title: "Bank transfer details",
    rows: [
      ["Account title", "Zenith Academy"],
      ["Bank", "Add active bank name"],
      ["Account / IBAN", "Add account number or IBAN"],
    ],
  },
  JazzCash: {
    title: "JazzCash details",
    rows: [
      ["Account title", "Zenith Academy"],
      ["Mobile account", "Add JazzCash number"],
      ["Reference", "Student full name"],
    ],
  },
  EasyPaisa: {
    title: "EasyPaisa details",
    rows: [
      ["Account title", "Zenith Academy"],
      ["Mobile account", "Add EasyPaisa number"],
      ["Reference", "Student full name"],
    ],
  },
};

type PaymentMethod = keyof typeof paymentDetails;

export default function RegistrationPage() {
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [receiptName, setReceiptName] = useState("");

  const selectedCourse = useMemo(
    () => courses.find((course) => course.title === selectedCourseTitle),
    [selectedCourseTitle]
  );

  return (
    <main>
      <section className="page-hero registration-page-hero">
        <Image
          src={siteImages.registration}
          alt={siteImages.registrationAlt}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content">
          <p className="eyebrow">Registration</p>
          <h1>A focused enrollment flow for Zenith Academy courses.</h1>
          <p>
            The registration page collects identity, academic, course, and
            payment information so students know exactly what they are signing
            up for before submission.
          </p>
        </div>
      </section>

      <section className="section-band registration-band">
        <div className="section-inner registration-detail-grid">
          <div className="registration-copy">
            <div className="detail-media">
              <Image
                src={siteImages.books}
                alt={siteImages.booksAlt}
                width={640}
                height={440}
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
            {registrationSections.map((section) => (
              <article key={section.title}>
                <h2>{section.title}</h2>
                <ul className="plain-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <form className="registration-form full-form">
            {/* <div className="form-image">
              <Image
                src={siteImages.registration}
                alt={siteImages.registrationAlt}
                width={720}
                height={460}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div> */}
            <div className="form-section">
              <h2>Personal Information</h2>
              <label>
                Full name
                <input type="text" placeholder="Student full name" />
              </label>
              <label>
                CNIC number
                <input type="text" placeholder="00000-0000000-0" />
              </label>
              <div className="form-row">
                <label>
                  Date of birth
                  <span className="field-hint">Select from calendar</span>
                  <input
                    type="date"
                    aria-label="Date of birth in day month year format"
                  />
                </label>
                <label>
                  Gender
                  <select defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Phone number
                  <input type="tel" placeholder="+92 300 0000000" />
                </label>
                <label>
                  Email address
                  <input type="email" placeholder="name@example.com" />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>Academic Information</h2>
              <label>
                Institution name
                <input type="text" placeholder="University or college" />
              </label>
              <div className="form-row">
                <label>
                  Degree program
                  <input type="text" placeholder="BS, MS, Intermediate..." />
                </label>
                <label>
                  Current year of study
                  <input type="text" placeholder="1st year, 2nd year..." />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>Course Selection</h2>
              <label>
                Select a course
                <select
                  value={selectedCourseTitle}
                  onChange={(event) => setSelectedCourseTitle(event.target.value)}
                >
                  <option value="" disabled>
                    Choose an open course
                  </option>
                  {courses.map((course) => (
                    <option key={course.title} value={course.title}>
                      {course.domain} - {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="fee-strip">
                <span>Fee and mode</span>
                <strong>
                  {selectedCourse
                    ? `${selectedCourse.fee} / ${selectedCourse.mode}`
                    : "Shown after course selection"}
                </strong>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment</h2>
              <label>
                Payment method
                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value as PaymentMethod)
                  }
                >
                  <option value="" disabled>
                    Select method
                  </option>
                  {Object.keys(paymentDetails).map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </label>

              {paymentMethod ? (
                <div className="payment-detail-box">
                  <h3>{paymentDetails[paymentMethod].title}</h3>
                  <dl>
                    {paymentDetails[paymentMethod].rows.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              <label className="upload-control" htmlFor="receipt-upload">
                Upload receipt
                <span className="upload-box">
                  <span>
                    <strong>
                      {receiptName || "Choose receipt screenshot"}
                    </strong>
                    <small>PNG, JPG, or PDF. Max 10MB.</small>
                  </span>
                  <span className="upload-button">Browse</span>
                </span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={(event) =>
                    setReceiptName(event.target.files?.[0]?.name || "")
                  }
                />
              </label>
            </div>

            <button type="submit" className="button button-primary">
              Submit Registration
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
