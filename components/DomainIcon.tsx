type IconName =
  | "technology"
  | "business"
  | "leadership"
  | "default"
  | "course"
  | "users"
  | "certificate"
  | "calendar"
  | "arrow";

type DomainIconProps = {
  slug?: string;
  name?: string;
  kind?: IconName;
  className?: string;
};

function resolveKind(slug = "", name = "", kind?: IconName): IconName {
  if (kind) {
    return kind;
  }

  const key = `${slug} ${name}`.toLowerCase();

  if (key.includes("technolog") || key.includes("software") || key.includes("data")) {
    return "technology";
  }

  if (key.includes("business") || key.includes("entrepren") || key.includes("management")) {
    return "business";
  }

  if (
    key.includes("leadership") ||
    key.includes("humanit") ||
    key.includes("ethics") ||
    key.includes("civic")
  ) {
    return "leadership";
  }

  return "default";
}

function IconGlyph({ kind }: { kind: IconName }) {
  switch (kind) {
    case "technology":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="8" y="10" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 38h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 32v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M16 18h4l2 5 3-10 2 5h5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "business":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M10 38V18l14-8 14 8v20"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M18 38V24h12v14" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M10 38h28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M22 28h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "leadership":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2.2" />
          <path
            d="M12 38c1.8-7 6.2-10.5 12-10.5S34.2 31 36 38"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M30 12l2.2-4.5L37 9l-2.2 4.2L39 16l-4.8.4L32 21l-2.2-4.4L25 16l4.8-1.2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "course":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M8 14l16-6 16 6v20l-16 6-16-6V14z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M24 8v32" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 20h8M16 26h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="31" cy="20" r="4" stroke="currentColor" strokeWidth="2.2" />
          <path
            d="M8 36c1.5-6 5.2-9 10-9s8.5 3 10 9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M28 34c1-4 3.4-6 6.5-6 3.4 0 5.8 2.2 6.5 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "certificate":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="10" y="8" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <path d="M18 16h12M18 22h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M20 32l-2 8 6-3 6 3-2-8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="9" y="12" width="30" height="26" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <path d="M9 20h30" stroke="currentColor" strokeWidth="2.2" />
          <path d="M17 8v8M31 8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16 28h4M24 28h4M32 28h4M16 34h4M24 34h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M12 24h22M26 14l12 10-12 10"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.2" />
          <path
            d="M24 14v10l6 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
        </svg>
      );
  }
}

export default function DomainIcon({
  slug = "",
  name = "",
  kind,
  className = "domain-icon",
}: DomainIconProps) {
  const resolved = resolveKind(slug, name, kind);

  return (
    <span className={className} data-icon={resolved} aria-hidden="true">
      <IconGlyph kind={resolved} />
    </span>
  );
}
