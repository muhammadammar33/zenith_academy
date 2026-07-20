"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ToastProvider";

type Domain = {
  id: string;
  name: string;
  slug: string;
  line: string;
  about: string;
  outcome: string;
  imageUrl: string;
  imageAlt: string;
  themes: string[];
  sortOrder: number;
  isPublished: boolean;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  about: string;
  takeaway: string;
  audience: string;
  duration: string;
  mode: string;
  status: string;
  fee: number;
  seats: string;
  imageUrl: string;
  imageAlt: string;
  prerequisites: string[];
  sessions: string[];
  sortOrder: number;
  isPublished: boolean;
  domainId: string;
  domainName: string;
};

type Registration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  educationLevel: string;
  institution: string;
  degreeProgram: string | null;
  studyYear: string;
  courseTitle: string;
  paymentMethod: string;
  receiptUrl: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  adminNotes: string;
  createdAt: string;
};

type MediaAsset = {
  id: string;
  secureUrl: string;
  altText: string | null;
  resourceType: string;
  createdAt: string;
};

type EmailLog = {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  createdAt: string;
};

type DashboardProps = {
  adminEmail: string;
  courses: Course[];
  domains: Domain[];
  registrations: Registration[];
  media: MediaAsset[];
  emailLogs: EmailLog[];
  settings: Record<string, unknown>;
  databaseError?: string;
};

const emptyDomain = {
  id: "",
  name: "",
  slug: "",
  line: "",
  about: "",
  outcome: "",
  imageUrl: "",
  imageAlt: "",
  themes: "",
  sortOrder: "0",
  isPublished: true,
};

const emptyCourse = {
  id: "",
  title: "",
  slug: "",
  domainId: "",
  description: "",
  about: "",
  takeaway: "",
  audience: "",
  duration: "",
  mode: "",
  status: "Upcoming",
  fee: "0",
  seats: "Limited",
  imageUrl: "",
  imageAlt: "",
  prerequisites: "",
  sessions: "",
  sortOrder: "0",
  isPublished: true,
};

type AdminTab =
  | "overview"
  | "registrations"
  | "courses"
  | "domains"
  | "media"
  | "settings"
  | "email";

const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "registrations", label: "Students" },
  { id: "courses", label: "Courses" },
  { id: "domains", label: "Domains" },
  { id: "media", label: "Media" },
  { id: "settings", label: "Settings" },
  { id: "email", label: "Email" },
];

export default function AdminDashboard(props: DashboardProps) {
  const router = useRouter();
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [busy, setBusy] = useState(false);
  const [domainForm, setDomainForm] = useState(emptyDomain);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const registrationSetting =
    typeof props.settings.registration === "object" &&
    props.settings.registration !== null
      ? (props.settings.registration as Record<string, unknown>)
      : {};
  const [registrationOpen, setRegistrationOpen] = useState(
    registrationSetting.isOpen !== false
  );
  const [paymentInstructions, setPaymentInstructions] = useState(
    typeof registrationSetting.paymentInstructions === "string"
      ? registrationSetting.paymentInstructions
      : "Choose a payment method to view the active account details."
  );

  const pendingCount = useMemo(
    () => props.registrations.filter((item) => item.status === "PENDING").length,
    [props.registrations]
  );

  const [studentSearch, setStudentSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [educationFilter, setEducationFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const courseOptions = useMemo(
    () =>
      Array.from(
        new Set(props.registrations.map((item) => item.courseTitle))
      ).sort((a, b) => a.localeCompare(b)),
    [props.registrations]
  );

  const educationOptions = useMemo(
    () =>
      Array.from(
        new Set(props.registrations.map((item) => item.educationLevel))
      ).sort((a, b) => a.localeCompare(b)),
    [props.registrations]
  );

  const paymentOptions = useMemo(
    () =>
      Array.from(
        new Set(props.registrations.map((item) => item.paymentMethod))
      ).sort((a, b) => a.localeCompare(b)),
    [props.registrations]
  );

  const filteredRegistrations = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    return props.registrations.filter((registration) => {
      if (courseFilter !== "all" && registration.courseTitle !== courseFilter) {
        return false;
      }

      if (statusFilter !== "all" && registration.status !== statusFilter) {
        return false;
      }

      if (
        educationFilter !== "all" &&
        registration.educationLevel !== educationFilter
      ) {
        return false;
      }

      if (
        paymentFilter !== "all" &&
        registration.paymentMethod !== paymentFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        registration.fullName,
        registration.email,
        registration.phone,
        registration.institution,
        registration.degreeProgram ?? "",
        registration.studyYear,
        registration.courseTitle,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [
    props.registrations,
    studentSearch,
    courseFilter,
    statusFilter,
    educationFilter,
    paymentFilter,
  ]);

  const filtersActive =
    studentSearch.trim() !== "" ||
    courseFilter !== "all" ||
    statusFilter !== "all" ||
    educationFilter !== "all" ||
    paymentFilter !== "all";

  function clearStudentFilters() {
    setStudentSearch("");
    setCourseFilter("all");
    setStatusFilter("all");
    setEducationFilter("all");
    setPaymentFilter("all");
  }

  async function request(
    url: string,
    options: RequestInit,
    successMessage: string
  ) {
    setBusy(true);
    const response = await fetch(url, options);
    const result = (await response.json()) as { error?: string };
    setBusy(false);

    if (!response.ok) {
      notify({
        title: "Action failed",
        message: result.error ?? "The request failed.",
        tone: "error",
      });
      return false;
    }

    notify({
      title: "Saved",
      message: successMessage,
      tone: "success",
    });
    router.refresh();
    return true;
  }

  async function uploadImage(
    file: File,
    folder: "course-images" | "domain-images",
    onUploaded: (url: string) => void
  ) {
    const data = new FormData();
    data.set("file", file);
    data.set("folder", folder);
    setBusy(true);
    notify({
      title: "Uploading",
      message: "Uploading image…",
      tone: "info",
      durationMs: 2500,
    });
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });
    const result = (await response.json()) as {
      error?: string;
      asset?: { secureUrl: string };
    };
    setBusy(false);

    if (!response.ok || !result.asset) {
      notify({
        title: "Upload failed",
        message: result.error ?? "Image upload failed.",
        tone: "error",
      });
      return;
    }

    onUploaded(result.asset.secureUrl);
    notify({
      title: "Image uploaded",
      message: "Image uploaded successfully.",
      tone: "success",
    });
    router.refresh();
  }

  async function saveDomain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await request(
      "/api/admin/domains",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...domainForm,
          id: domainForm.id || undefined,
          themes: domainForm.themes
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          sortOrder: Number(domainForm.sortOrder),
        }),
      },
      domainForm.id ? "Domain updated." : "Domain created."
    );

    if (saved) setDomainForm(emptyDomain);
  }

  async function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await request(
      "/api/admin/courses",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...courseForm,
          id: courseForm.id || undefined,
          fee: Number(courseForm.fee),
          sortOrder: Number(courseForm.sortOrder),
          prerequisites: courseForm.prerequisites
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          sessions: courseForm.sessions
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      },
      courseForm.id ? "Course updated." : "Course created."
    );

    if (saved) setCourseForm(emptyCourse);
  }

  function editDomain(domain: Domain) {
    setActiveTab("domains");
    setDomainForm({
      ...domain,
      themes: domain.themes.join("\n"),
      sortOrder: String(domain.sortOrder),
    });
  }

  function editCourse(course: Course) {
    setActiveTab("courses");
    setCourseForm({
      ...course,
      fee: String(course.fee),
      prerequisites: course.prerequisites.join("\n"),
      sessions: course.sessions.join("\n"),
      sortOrder: String(course.sortOrder),
    });
  }

  return (
    <main className="admin-page">
      <div className="section-inner admin-shell">
        <header className="admin-heading">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Academy control center</h1>
            <p>Signed in as {props.adminEmail}</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="button admin-secondary-button" type="submit">
              Sign out
            </button>
          </form>
        </header>

        {props.databaseError ? (
          <div className="admin-alert" role="alert">
            <strong>Database connection required.</strong>
            <p>{props.databaseError}</p>
            <p>Set DATABASE_URL, run the migration, then seed the database.</p>
          </div>
        ) : null}

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`admin-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`admin-panel-${tab.id}`}
              className={
                activeTab === tab.id ? "admin-tab admin-tab-active" : "admin-tab"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "registrations" && pendingCount > 0 ? (
                <span className="admin-tab-count">{pendingCount}</span>
              ) : null}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <section
            className="admin-section"
            role="tabpanel"
            id="admin-panel-overview"
            aria-labelledby="admin-tab-overview"
          >
            <div className="admin-section-heading">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Academy snapshot</h2>
              </div>
            </div>
            <section className="admin-metrics" aria-label="Dashboard summary">
              <article>
                <button
                  type="button"
                  className="admin-metric-link"
                  onClick={() => setActiveTab("registrations")}
                >
                  <span>Pending registrations</span>
                  <strong>{pendingCount}</strong>
                </button>
              </article>
              <article>
                <button
                  type="button"
                  className="admin-metric-link"
                  onClick={() => setActiveTab("courses")}
                >
                  <span>Published courses</span>
                  <strong>
                    {props.courses.filter((item) => item.isPublished).length}
                  </strong>
                </button>
              </article>
              <article>
                <button
                  type="button"
                  className="admin-metric-link"
                  onClick={() => setActiveTab("domains")}
                >
                  <span>Learning domains</span>
                  <strong>{props.domains.length}</strong>
                </button>
              </article>
              <article>
                <button
                  type="button"
                  className="admin-metric-link"
                  onClick={() => setActiveTab("media")}
                >
                  <span>Media assets</span>
                  <strong>{props.media.length}</strong>
                </button>
              </article>
            </section>
            <div className="admin-overview-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => setActiveTab("registrations")}
              >
                Review registrations
              </button>
              <button
                type="button"
                className="button admin-secondary-button"
                onClick={() => setActiveTab("courses")}
              >
                Manage courses
              </button>
              <button
                type="button"
                className="button admin-secondary-button"
                onClick={() => setActiveTab("settings")}
              >
                Open settings
              </button>
            </div>
          </section>
        ) : null}

        {activeTab === "registrations" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-registrations"
          aria-labelledby="admin-tab-registrations"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Students</p>
              <h2>Registered students</h2>
              <p>
                Showing {filteredRegistrations.length} of{" "}
                {props.registrations.length} registrations
              </p>
            </div>
          </div>

          <div className="admin-filters">
            <label>
              Search students
              <input
                type="search"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="Name, email, phone, or institution"
              />
            </label>
            <label>
              Course
              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
              >
                <option value="all">All courses</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </label>
            <label>
              Education
              <select
                value={educationFilter}
                onChange={(event) => setEducationFilter(event.target.value)}
              >
                <option value="all">All levels</option>
                {educationOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Payment
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
              >
                <option value="all">All methods</option>
                {paymentOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
            {filtersActive ? (
              <button
                type="button"
                className="button admin-secondary-button"
                onClick={clearStudentFilters}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Payment</th>
                  <th>Submitted</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td>
                      <strong>{registration.fullName}</strong>
                      <small>{registration.email}</small>
                      <small>{registration.phone}</small>
                      <small>{registration.educationLevel}</small>
                      <small>{registration.institution}</small>
                      {registration.degreeProgram ? (
                        <small>{registration.degreeProgram}</small>
                      ) : null}
                      <small>{registration.studyYear}</small>
                    </td>
                    <td>{registration.courseTitle}</td>
                    <td>
                      <div className="payment-cell">
                        <span className="payment-method-chip">
                          {registration.paymentMethod}
                        </span>
                        <a
                          className="payment-receipt-link"
                          href={registration.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View receipt
                        </a>
                      </div>
                    </td>
                    <td>{new Date(registration.createdAt).toLocaleDateString()}</td>
                    <td>
                      <RegistrationReview
                        registration={registration}
                        disabled={busy}
                        onSave={(status, adminNotes) =>
                          request(
                            `/api/admin/registrations/${registration.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status, adminNotes }),
                            },
                            "Registration updated."
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
                {!filteredRegistrations.length ? (
                  <tr>
                    <td colSpan={5}>
                      {props.registrations.length
                        ? "No students match the selected filters."
                        : "No registrations yet."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
        ) : null}

        {activeTab === "courses" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-courses"
          aria-labelledby="admin-tab-courses"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Courses</p>
              <h2>Publish and update courses</h2>
            </div>
          </div>
          <div className="admin-split">
            <form className="admin-editor" onSubmit={saveCourse}>
              <h3>{courseForm.id ? "Edit course" : "Add a course"}</h3>
              <div className="form-row">
                <label>
                  Title
                  <input
                    value={courseForm.title}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, title: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  URL slug
                  <input
                    value={courseForm.slug}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, slug: event.target.value })
                    }
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    required
                  />
                </label>
              </div>
              <label>
                Domain
                <select
                  value={courseForm.domainId}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, domainId: event.target.value })
                  }
                  required
                >
                  <option value="">Select a domain</option>
                  {props.domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
              </label>
              {(["description", "about", "takeaway", "audience"] as const).map(
                (field) => (
                  <label key={field}>
                    {field[0].toUpperCase() + field.slice(1)}
                    <textarea
                      value={courseForm[field]}
                      onChange={(event) =>
                        setCourseForm({
                          ...courseForm,
                          [field]: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                )
              )}
              <div className="form-row">
                <label>
                  Duration
                  <input
                    value={courseForm.duration}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, duration: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Delivery mode
                  <input
                    value={courseForm.mode}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, mode: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Status label
                  <input
                    value={courseForm.status}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, status: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Fee in PKR
                  <input
                    type="number"
                    min="0"
                    value={courseForm.fee}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, fee: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Seats
                  <input
                    value={courseForm.seats}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, seats: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Sort order
                  <input
                    type="number"
                    min="0"
                    value={courseForm.sortOrder}
                    onChange={(event) =>
                      setCourseForm({ ...courseForm, sortOrder: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Prerequisites, one per line
                <textarea
                  value={courseForm.prerequisites}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      prerequisites: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Sessions, one per line
                <textarea
                  value={courseForm.sessions}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, sessions: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Course image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadImage(file, "course-images", (imageUrl) =>
                        setCourseForm((current) => ({ ...current, imageUrl }))
                      );
                    }
                  }}
                />
              </label>
              <label>
                Image URL
                <input
                  type="url"
                  value={courseForm.imageUrl}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, imageUrl: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Image description
                <input
                  value={courseForm.imageAlt}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, imageAlt: event.target.value })
                  }
                  required
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={courseForm.isPublished}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      isPublished: event.target.checked,
                    })
                  }
                />
                Published
              </label>
              <div className="admin-form-actions">
                <button className="button button-primary" disabled={busy}>
                  Save course
                </button>
                {courseForm.id ? (
                  <button
                    className="button admin-secondary-button"
                    type="button"
                    onClick={() => setCourseForm(emptyCourse)}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
            <div className="admin-record-list">
              {props.courses.map((course) => (
                <article key={course.id}>
                  <div>
                    <strong>{course.title}</strong>
                    <span>
                      {course.domainName} · {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="admin-inline-actions">
                    <button type="button" onClick={() => editCourse(course)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${course.title}?`)) {
                          void request(
                            `/api/admin/courses?id=${course.id}`,
                            { method: "DELETE" },
                            "Course deleted."
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        ) : null}

        {activeTab === "domains" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-domains"
          aria-labelledby="admin-tab-domains"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Domains</p>
              <h2>Manage learning tracks</h2>
            </div>
          </div>
          <div className="admin-split">
            <form className="admin-editor" onSubmit={saveDomain}>
              <h3>{domainForm.id ? "Edit domain" : "Add a domain"}</h3>
              <div className="form-row">
                <label>
                  Name
                  <input
                    value={domainForm.name}
                    onChange={(event) =>
                      setDomainForm({ ...domainForm, name: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  URL slug
                  <input
                    value={domainForm.slug}
                    onChange={(event) =>
                      setDomainForm({ ...domainForm, slug: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Summary line
                <input
                  value={domainForm.line}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, line: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                About
                <textarea
                  value={domainForm.about}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, about: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Outcome
                <textarea
                  value={domainForm.outcome}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, outcome: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Themes, one per line
                <textarea
                  value={domainForm.themes}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, themes: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Domain image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadImage(file, "domain-images", (imageUrl) =>
                        setDomainForm((current) => ({ ...current, imageUrl }))
                      );
                    }
                  }}
                />
              </label>
              <label>
                Image URL
                <input
                  type="url"
                  value={domainForm.imageUrl}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, imageUrl: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Image description
                <input
                  value={domainForm.imageAlt}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, imageAlt: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Sort order
                <input
                  type="number"
                  min="0"
                  value={domainForm.sortOrder}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, sortOrder: event.target.value })
                  }
                  required
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={domainForm.isPublished}
                  onChange={(event) =>
                    setDomainForm({
                      ...domainForm,
                      isPublished: event.target.checked,
                    })
                  }
                />
                Published
              </label>
              <div className="admin-form-actions">
                <button className="button button-primary" disabled={busy}>
                  Save domain
                </button>
                {domainForm.id ? (
                  <button
                    className="button admin-secondary-button"
                    type="button"
                    onClick={() => setDomainForm(emptyDomain)}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>
            <div className="admin-record-list">
              {props.domains.map((domain) => (
                <article key={domain.id}>
                  <div>
                    <strong>{domain.name}</strong>
                    <span>{domain.isPublished ? "Published" : "Draft"}</span>
                  </div>
                  <div className="admin-inline-actions">
                    <button type="button" onClick={() => editDomain(domain)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${domain.name}?`)) {
                          void request(
                            `/api/admin/domains?id=${domain.id}`,
                            { method: "DELETE" },
                            "Domain deleted."
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        ) : null}

        {activeTab === "media" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-media"
          aria-labelledby="admin-tab-media"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Media</p>
              <h2>Uploaded media library</h2>
            </div>
          </div>
          <div className="admin-media-grid">
            {props.media.map((asset) => (
              <article key={asset.id}>
                {asset.resourceType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.secureUrl} alt={asset.altText ?? ""} />
                ) : (
                  <a href={asset.secureUrl} target="_blank" rel="noreferrer">
                    Open file
                  </a>
                )}
                <small>{asset.altText || "No description"}</small>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete this media asset?")) {
                      void request(
                        `/api/admin/upload?id=${asset.id}`,
                        { method: "DELETE" },
                        "Media asset deleted."
                      );
                    }
                  }}
                >
                  Delete asset
                </button>
              </article>
            ))}
            {!props.media.length ? <p>No uploaded media yet.</p> : null}
          </div>
        </section>
        ) : null}

        {activeTab === "settings" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-settings"
          aria-labelledby="admin-tab-settings"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Settings</p>
              <h2>Registration controls</h2>
            </div>
          </div>
          <form
            className="admin-editor admin-settings"
            onSubmit={(event) => {
              event.preventDefault();
              void request(
                "/api/admin/settings",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    registration: {
                      isOpen: registrationOpen,
                      paymentInstructions,
                    },
                  }),
                },
                "Settings updated."
              );
            }}
          >
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={registrationOpen}
                onChange={(event) => setRegistrationOpen(event.target.checked)}
              />
              Accept new registrations
            </label>
            <label>
              Payment instructions
              <textarea
                value={paymentInstructions}
                onChange={(event) => setPaymentInstructions(event.target.value)}
              />
            </label>
            <button className="button button-primary" disabled={busy}>
              Save settings
            </button>
          </form>
        </section>
        ) : null}

        {activeTab === "email" ? (
        <section
          className="admin-section"
          role="tabpanel"
          id="admin-panel-email"
          aria-labelledby="admin-tab-email"
        >
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Email</p>
              <h2>Recent delivery activity</h2>
            </div>
          </div>
          <div className="admin-record-list">
            {props.emailLogs.map((log) => (
              <article key={log.id}>
                <div>
                  <strong>{log.subject}</strong>
                  <span>
                    {log.recipient} · {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className={`status-badge status-${log.status.toLowerCase()}`}>
                  {log.status.toLowerCase()}
                </span>
              </article>
            ))}
            {!props.emailLogs.length ? <p>No email activity yet.</p> : null}
          </div>
        </section>
        ) : null}
      </div>
    </main>
  );
}

function RegistrationReview({
  registration,
  disabled,
  onSave,
}: {
  registration: Registration;
  disabled: boolean;
  onSave: (
    status: Registration["status"],
    adminNotes: string
  ) => Promise<boolean>;
}) {
  const [status, setStatus] = useState(registration.status);
  const [adminNotes, setAdminNotes] = useState(registration.adminNotes);

  return (
    <div className="registration-review">
      <select
        value={status}
        onChange={(event) =>
          setStatus(event.target.value as Registration["status"])
        }
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="REJECTED">Rejected</option>
      </select>
      <textarea
        aria-label={`Notes for ${registration.fullName}`}
        placeholder="Internal notes"
        value={adminNotes}
        onChange={(event) => setAdminNotes(event.target.value)}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => void onSave(status, adminNotes)}
      >
        Save review
      </button>
    </div>
  );
}
