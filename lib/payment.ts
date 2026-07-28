export const PAYMENT_METHODS = [
  "Bank transfer",
  "JazzCash",
  "EasyPaisa",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentMethodDetails = {
  title: string;
  fields: {
    label: string;
    value: string;
  }[];
};

export type PaymentMethodsConfig = Record<PaymentMethod, PaymentMethodDetails>;

export const defaultPaymentMethods: PaymentMethodsConfig = {
  "Bank transfer": {
    title: "Bank transfer details",
    fields: [
      { label: "Account title", value: "Zenith Academy" },
      { label: "Bank", value: "Add active bank name" },
      { label: "Account / IBAN", value: "Add account number or IBAN" },
    ],
  },
  JazzCash: {
    title: "JazzCash details",
    fields: [
      { label: "Account title", value: "Zenith Academy" },
      { label: "Mobile account", value: "Add JazzCash number" },
      { label: "Reference", value: "Student full name" },
    ],
  },
  EasyPaisa: {
    title: "EasyPaisa details",
    fields: [
      { label: "Account title", value: "Zenith Academy" },
      { label: "Mobile account", value: "Add EasyPaisa number" },
      { label: "Reference", value: "Student full name" },
    ],
  },
};

function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

export function normalizePaymentMethods(raw: unknown): PaymentMethodsConfig {
  const result: PaymentMethodsConfig = structuredClone(defaultPaymentMethods);

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return result;
  }

  for (const [method, details] of Object.entries(
    raw as Record<string, unknown>
  )) {
    if (!isPaymentMethod(method) || !details || typeof details !== "object") {
      continue;
    }

    const source = details as Record<string, unknown>;
    const fallback = defaultPaymentMethods[method];
    const title =
      typeof source.title === "string" && source.title.trim()
        ? source.title.trim()
        : fallback.title;

    let fields = fallback.fields.map((field) => ({ ...field }));

    if (Array.isArray(source.fields)) {
      const parsed = source.fields
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const row = item as Record<string, unknown>;
          const label =
            typeof row.label === "string" ? row.label.trim() : "";
          const value =
            typeof row.value === "string" ? row.value.trim() : "";

          if (!label) {
            return null;
          }

          return { label, value: value || "—" };
        })
        .filter((item): item is { label: string; value: string } =>
          Boolean(item)
        );

      if (parsed.length) {
        fields = parsed;
      }
    } else if (Array.isArray(source.rows)) {
      // Support older [{label,value}] or tuple-like rows if present.
      const parsed = source.rows
        .map((item) => {
          if (Array.isArray(item) && item.length >= 2) {
            return {
              label: String(item[0] ?? "").trim(),
              value: String(item[1] ?? "").trim() || "—",
            };
          }

          if (item && typeof item === "object") {
            const row = item as Record<string, unknown>;
            const label =
              typeof row.label === "string" ? row.label.trim() : "";
            const value =
              typeof row.value === "string" ? row.value.trim() : "";
            if (!label) {
              return null;
            }
            return { label, value: value || "—" };
          }

          return null;
        })
        .filter((item): item is { label: string; value: string } =>
          Boolean(item)
        );

      if (parsed.length) {
        fields = parsed;
      }
    }

    result[method] = { title, fields };
  }

  return result;
}
