"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { registrationSections, siteImages } from "../content";
import {
  COLLEGE_CLASSES,
  EDUCATION_LEVELS,
  POSTGRAD_PROGRAM_TYPES,
  POSTGRAD_STUDY_YEARS,
  SCHOOL_CLASSES,
  UNIVERSITY_STUDY_YEARS,
  type EducationLevel,
  isSchoolOrCollege,
} from "../../lib/education";
import { useToast } from "../../components/ToastProvider";

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

type CourseOption = {
  id: string;
  title: string;
  domain: string;
  fee: string;
  mode: string;
};

type UploadedReceipt = {
  name: string;
  publicId: string;
  resourceType: "image" | "raw";
  secureUrl: string;
};

export default function RegistrationPage() {
  const { notify } = useToast();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [receipt, setReceipt] = useState<UploadedReceipt | null>(null);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationReady, setRegistrationReady] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [studyYear, setStudyYear] = useState("");
  const [programType, setProgramType] = useState("");

  useEffect(() => {
    void fetch("/api/courses")
      .then((response) => response.json())
      .then(
        (result: {
          courses: CourseOption[];
          registration: {
            isOpen: boolean;
            paymentInstructions: string;
          };
        }) => {
          setCourses(result.courses);
          setRegistrationOpen(result.registration.isOpen);
          setPaymentInstructions(result.registration.paymentInstructions);
          setRegistrationReady(true);
        }
      )
      .catch(() => {
        notify({
          title: "Could not load courses",
          message: "Course information could not be loaded.",
          tone: "error",
        });
        setRegistrationReady(true);
      });
  }, [notify]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseTitle),
    [selectedCourseTitle]
  );

  async function uploadReceiptFile(file: File) {
    if (
      file.size > 10 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    ) {
      throw new Error("Upload a JPG, PNG, or PDF receipt no larger than 10MB.");
    }

    const signatureResponse = await fetch("/api/uploads/signature", {
      method: "POST",
    });
    const signature = (await signatureResponse.json()) as {
      error?: string;
      timestamp?: number;
      folder?: string;
      signature?: string;
      apiKey?: string;
      uploadUrl?: string;
    };

    if (
      !signatureResponse.ok ||
      !signature.timestamp ||
      !signature.folder ||
      !signature.signature ||
      !signature.apiKey ||
      !signature.uploadUrl
    ) {
      throw new Error(signature.error ?? "Receipt upload is unavailable.");
    }

    const uploadData = new FormData();
    uploadData.set("file", file);
    uploadData.set("api_key", signature.apiKey);
    uploadData.set("timestamp", String(signature.timestamp));
    uploadData.set("signature", signature.signature);
    uploadData.set("folder", signature.folder);

    const uploadResponse = await fetch(signature.uploadUrl, {
      method: "POST",
      body: uploadData,
    });
    const upload = (await uploadResponse.json()) as {
      public_id?: string;
      secure_url?: string;
      resource_type?: "image" | "raw" | "video";
      error?: { message?: string };
    };

    if (
      !uploadResponse.ok ||
      !upload.public_id ||
      !upload.secure_url ||
      (upload.resource_type !== "image" && upload.resource_type !== "raw")
    ) {
      throw new Error(
        upload.error?.message ?? "The payment receipt could not be uploaded."
      );
    }

    return {
      name: file.name,
      publicId: upload.public_id,
      resourceType: upload.resource_type,
      secureUrl: upload.secure_url,
    } satisfies UploadedReceipt;
  }

  async function handleReceiptChange(file: File | undefined) {
    setReceipt(null);

    if (!file) {
      return;
    }

    setReceiptUploading(true);
    notify({
      title: "Uploading receipt",
      message: "Uploading your payment receipt…",
      tone: "info",
      durationMs: 2500,
    });
    try {
      const uploaded = await uploadReceiptFile(file);
      setReceipt(uploaded);
      notify({
        title: "Receipt uploaded",
        message: "Your receipt is ready for submission.",
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Upload failed",
        message:
          error instanceof Error
            ? error.message
            : "The payment receipt could not be uploaded.",
        tone: "error",
      });
    } finally {
      setReceiptUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!receipt) {
      notify({
        title: "Receipt required",
        message: "Upload a payment receipt before submitting.",
        tone: "error",
      });
      setSubmitting(false);
      return;
    }

    notify({
      title: "Submitting",
      message: "Saving your registration…",
      tone: "info",
      durationMs: 2500,
    });
    const registrationData = Object.fromEntries(formData.entries());
    delete registrationData.receipt;
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...registrationData,
        receipt: {
          publicId: receipt.publicId,
          resourceType: receipt.resourceType,
        },
      }),
    });
    const result = (await response.json()) as {
      error?: string;
      message?: string;
      registrationId?: string;
    };
    setSubmitting(false);

    if (!response.ok) {
      notify({
        title: "Registration failed",
        message: result.error ?? "Registration could not be submitted.",
        tone: "error",
      });
      return;
    }

    notify({
      title: "Registration received",
      message: `${result.message ?? "Registration submitted."} Reference: ${
        result.registrationId ?? "sent by email"
      }.`,
      tone: "success",
      durationMs: 7000,
    });
    form.reset();
    setSelectedCourseTitle("");
    setPaymentMethod("");
    setReceipt(null);
    setEducationLevel("");
    setStudyYear("");
    setProgramType("");
  }

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
          <h1>Register for a Zenith Academy course.</h1>
          <p>
            Provide your personal and academic details, choose a course, review
            its fee and mode, then upload your payment receipt.
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

          <form className="registration-form full-form" onSubmit={handleSubmit}>
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
              <h2>Personal information</h2>
              <label>
                Full name
                <input
                  name="fullName"
                  type="text"
                  placeholder="Student full name"
                  required
                />
              </label>
              <label>
                CNIC number
                <input
                  name="cnic"
                  type="text"
                  placeholder="00000-0000000-0"
                  pattern="\d{5}-\d{7}-\d"
                  required
                />
              </label>
              <div className="form-row">
                <label>
                  Date of birth
                  <span className="field-hint">Select from calendar</span>
                  <input
                    name="dateOfBirth"
                    type="date"
                    aria-label="Date of birth in day month year format"
                    required
                  />
                </label>
                <label>
                  Gender
                  <select name="gender" defaultValue="" required>
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
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+92 300 0000000"
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>Academic information</h2>
              <label>
                Level of education
                <select
                  name="educationLevel"
                  value={educationLevel}
                  onChange={(event) => {
                    setEducationLevel(event.target.value as EducationLevel | "");
                    setStudyYear("");
                    setProgramType("");
                  }}
                  required
                >
                  <option value="" disabled>
                    Select level
                  </option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              {educationLevel ? (
                <>
                  <label>
                    {isSchoolOrCollege(educationLevel)
                      ? educationLevel === "School"
                        ? "School name"
                        : "College name"
                      : "Institution name"}
                    <input
                      name="institution"
                      type="text"
                      placeholder={
                        isSchoolOrCollege(educationLevel)
                          ? educationLevel === "School"
                            ? "School name"
                            : "College name"
                          : "University or institute"
                      }
                      required
                    />
                  </label>

                  {educationLevel === "Graduation" ? (
                    <label>
                      Degree program
                      <input
                        name="degreeProgram"
                        type="text"
                        placeholder="BS Computer Science, BA English..."
                        required
                      />
                    </label>
                  ) : null}

                  {educationLevel === "Post Graduation" ? (
                    <>
                      <label>
                        Postgraduate program
                        <select
                          name="programType"
                          value={programType}
                          onChange={(event) => setProgramType(event.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select program
                          </option>
                          {POSTGRAD_PROGRAM_TYPES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Field / specialization
                        <input
                          name="degreeProgram"
                          type="text"
                          placeholder="Computer Science, Finance, Education..."
                          required
                        />
                      </label>
                    </>
                  ) : null}

                  <label>
                    {isSchoolOrCollege(educationLevel)
                      ? "Class"
                      : educationLevel === "Post Graduation"
                        ? "Current stage"
                        : "Current year of study"}
                    <select
                      name="studyYear"
                      value={studyYear}
                      onChange={(event) => setStudyYear(event.target.value)}
                      required
                    >
                      <option value="" disabled>
                        {isSchoolOrCollege(educationLevel)
                          ? "Select class"
                          : educationLevel === "Post Graduation"
                            ? "Select stage"
                            : "Select semester"}
                      </option>
                      {(educationLevel === "School"
                        ? SCHOOL_CLASSES
                        : educationLevel === "College"
                          ? COLLEGE_CLASSES
                          : educationLevel === "Post Graduation"
                            ? POSTGRAD_STUDY_YEARS
                            : UNIVERSITY_STUDY_YEARS
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}
            </div>

            <div className="form-section">
              <h2>Course selection</h2>
              <label>
                Select a course
                <select
                  name="courseId"
                  value={selectedCourseTitle}
                  onChange={(event) => setSelectedCourseTitle(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose an open course
                  </option>
                  {courses.map((course) => (
                    <option key={course.id || course.title} value={course.id}>
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
              {paymentInstructions ? <p>{paymentInstructions}</p> : null}
              <label>
                Payment method
                <select
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value as PaymentMethod)
                  }
                  required
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
                      {receiptUploading
                        ? "Uploading receipt…"
                        : receipt?.name || "Choose receipt screenshot"}
                    </strong>
                    <small>PNG, JPG, or PDF. Max 10MB.</small>
                  </span>
                  <span className="upload-button">Browse</span>
                </span>
                <input
                  id="receipt-upload"
                  name="receipt"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  required={!receipt}
                  disabled={receiptUploading || submitting}
                  onChange={(event) =>
                    void handleReceiptChange(event.target.files?.[0])
                  }
                />
              </label>

              {receipt ? (
                <div className="receipt-preview">
                  {receipt.resourceType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={receipt.secureUrl}
                      alt="Uploaded payment receipt"
                      className="receipt-preview-image"
                    />
                  ) : (
                    <a
                      href={receipt.secureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link"
                    >
                      Open uploaded PDF receipt
                    </a>
                  )}
                  <small>Receipt uploaded successfully</small>
                </div>
              ) : null}
            </div>

            {registrationReady && !registrationOpen ? (
              <p className="form-error" role="alert">
                Registration is currently closed.
              </p>
            ) : null}
            <button
              type="submit"
              className="button button-primary"
              disabled={
                !registrationReady ||
                !registrationOpen ||
                submitting ||
                receiptUploading ||
                !receipt
              }
            >
              {!registrationReady
                ? "Loading courses…"
                : receiptUploading
                  ? "Uploading receipt…"
                  : submitting
                    ? "Submitting…"
                    : "Submit registration"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
