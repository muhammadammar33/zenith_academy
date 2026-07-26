"use client";

import Image from "next/image";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { communitySections, siteImages } from "../content";
import { useToast } from "../../components/ToastProvider";
import DomainIcon from "../../components/DomainIcon";

type DomainOption = {
  id: string;
  name: string;
  slug: string;
  line: string;
};

export default function CommunitiesPage() {
  return (
    <Suspense
      fallback={
        <main>
          <section className="section-band">
            <div className="section-inner">
              <p>Loading communities…</p>
            </div>
          </section>
        </main>
      }
    >
      <CommunitiesForm />
    </Suspense>
  );
}

function CommunitiesForm() {
  const { notify } = useToast();
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain")?.trim() ?? "";
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [domainId, setDomainId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void fetch("/api/domains")
      .then((response) => response.json())
      .then((result: { domains: DomainOption[] }) => {
        setDomains(result.domains);
        setReady(true);

        if (!domainParam) {
          return;
        }

        const matched = result.domains.find(
          (domain) =>
            domain.id === domainParam ||
            domain.slug === domainParam ||
            domain.name.toLowerCase() === domainParam.toLowerCase()
        );

        if (matched?.id) {
          setDomainId(matched.id);
        }
      })
      .catch(() => {
        notify({
          title: "Could not load domains",
          message: "Community options could not be loaded.",
          tone: "error",
        });
        setReady(true);
      });
  }, [domainParam, notify]);

  const selectedDomain = domains.find((domain) => domain.id === domainId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        domainId,
        notes: formData.get("notes") || null,
      }),
    });
    const result = (await response.json()) as {
      error?: string;
      message?: string;
    };
    setSubmitting(false);

    if (!response.ok) {
      notify({
        title: "Could not join",
        message: result.error ?? "Community interest could not be submitted.",
        tone: "error",
      });
      return;
    }

    notify({
      title: "Interest recorded",
      message:
        result.message ??
        "We received your community interest. The academy team will follow up.",
      tone: "success",
      durationMs: 7000,
    });
    form.reset();
    setDomainId("");
  }

  return (
    <main>
      <section className="page-hero">
        <Image
          src={siteImages.about}
          alt={siteImages.aboutAlt}
          fill
          priority
          sizes="100vw"
          className="page-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="section-inner page-hero-content" data-animate="hero">
          <p className="eyebrow">Communities</p>
          <h1>Join a field community without enrolling in a course.</h1>
          <p>
            Connect with peers across Technology, Business, and Leadership as
            Zenith launches domain communities in Islamabad.
          </p>
        </div>
      </section>

      <section className="section-band registration-band">
        <div className="section-inner registration-detail-grid">
          <div className="registration-copy" data-animate="fade">
            {communitySections.map((section) => (
              <article key={section.title}>
                <h2>{section.title}</h2>
                <ul className="plain-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
            <p>
              Already registering for a course? You can join the matching
              domain community from the{" "}
              <a className="text-link" href="/registration">
                registration form
              </a>
              .
            </p>
            <div className="benefit-list">
              <div className="benefit-item">
                <DomainIcon kind="users" className="benefit-icon" />
                <div>
                  <strong>Peer connections</strong>
                  <p>Meet students and young professionals in your field.</p>
                </div>
              </div>
              <div className="benefit-item">
                <DomainIcon kind="course" className="benefit-icon" />
                <div>
                  <strong>No course required</strong>
                  <p>Join a community even if you are not enrolling yet.</p>
                </div>
              </div>
            </div>
          </div>

          <form
            className="registration-form full-form"
            onSubmit={handleSubmit}
            data-animate="fade"
          >
            <div className="form-section">
              <h2>Join a community</h2>
              <label>
                Full name
                <input
                  name="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </label>
              <div className="form-row">
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </label>
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+92 300 0000000"
                    required
                  />
                </label>
              </div>

              <fieldset className="community-picker">
                <legend>Choose a community</legend>
                <div className="community-picker-grid">
                  {domains.map((domain, index) => {
                    const selected = domainId === domain.id;
                    return (
                      <button
                        key={domain.id || domain.slug}
                        type="button"
                        className={
                          selected
                            ? `community-picker-option community-picker-option-${(index % 3) + 1} is-selected`
                            : `community-picker-option community-picker-option-${(index % 3) + 1}`
                        }
                        onClick={() => domain.id && setDomainId(domain.id)}
                        disabled={!domain.id}
                        aria-pressed={selected}
                      >
                        <DomainIcon
                          slug={domain.slug}
                          className="community-picker-icon"
                        />
                        <strong>{domain.name}</strong>
                        <span>{domain.line}</span>
                      </button>
                    );
                  })}
                </div>
                {!ready ? <p>Loading communities…</p> : null}
                <input type="hidden" name="domainId" value={domainId} required />
              </fieldset>

              {selectedDomain ? (
                <p className="community-selected-note">
                  Joining the <strong>{selectedDomain.name}</strong> community.
                </p>
              ) : null}

              <label>
                Optional note
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Share what you hope to gain from this community"
                />
              </label>
            </div>
            <button
              type="submit"
              className="button button-primary"
              disabled={!ready || submitting || !domainId}
            >
              {submitting ? "Submitting…" : "Join community"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
