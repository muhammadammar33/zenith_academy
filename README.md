# Zenith Academy website

Public website and administration portal for **Zenith Academy**, a professional
learning platform operated by **Islami Jamiat Talaba**, Islamabad Chapter.

Visitors browse domains and courses, then submit a paid registration with a
receipt upload. Administrators review students, manage catalogue content, media,
registration settings, and email delivery.

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 4 + custom CSS in `app/globals.css` |
| Database | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Single admin account (email + bcrypt hash + JWT cookie) |
| Email | SMTP via Nodemailer, with delivery logs in the database |
| Media | Cloudinary (env vars use `MEDIA_*`; legacy `CLOUDINARY_*` still accepted) |

Static fallback content lives in `app/content.ts`. Public pages load published
domains/courses from the database when `DATABASE_URL` is available, and fall
back to that file if the database is missing or unreachable.

## Site map and visitor flow

```text
Home (/)
  → Domains (/domains)
  → Courses (/courses)
  → Registration (/registration)
       1. Choose course
       2. Enter personal + academic details
       3. Choose payment method and pay offline
       4. Upload payment receipt (signed direct upload)
       5. Submit → PENDING registration
       6. Confirmation emails to student + admin
Admin reviews receipt → CONFIRMED or REJECTED → status email to student
```

### Public pages

| Route | Purpose |
| --- | --- |
| `/` | Brand hero, about, vision/mission, objectives, featured domains/courses, registration overview |
| `/domains` | Learning domains (themes, outcomes, related courses) |
| `/courses` | Published course catalogue (fee, duration, mode, audience, etc.) |
| `/registration` | Full registration form when registration is open |

Navigation: About, Domains, Courses, Registration (header). Brand logos live in
`public/images/`.

### Registration flow (detail)

1. **Gate** — Admin Settings control whether registration is open. If closed,
   the form shows a closed state and `POST /api/register` returns `403`.
2. **Course** — Student picks a published course. Fee/mode are snapshotted onto
   the registration record.
3. **Personal details** — Name, CNIC, date of birth, gender, phone, email.
4. **Academic details** — Conditional by education level:
   - **School** — school name + Class 1–10
   - **College** — college name + 1st/2nd year (11th/12th)
   - **Graduation** — institution, degree, semester (1st–10th) or Graduation
   - **Post Graduation** — program type (MS, PhD, …), field, stage
5. **Payment** — Bank transfer, JazzCash, or EasyPaisa (instructions shown in
   the form; update account details in the registration UI/content as needed).
6. **Receipt** — Client requests a signed upload (`/api/uploads/signature`),
   uploads the file directly to media storage, then submits `publicId` with the
   form. The server verifies the upload before saving.
7. **Rate limit** — About 5 submissions per IP per hour on `POST /api/register`.
8. **Outcome** — Status starts as `PENDING`. Student and admin receive email
   notifications. Admin later confirms or rejects; student gets a status email.

## Admin portal

| Route | Purpose |
| --- | --- |
| `/admin/login` | Email + password sign-in |
| `/admin` | Dashboard (requires valid session cookie) |

Credentials come from environment variables (one admin account). Session uses
`ADMIN_SESSION_SECRET` and a JWT cookie.

### Dashboard tabs

| Tab | Functionality |
| --- | --- |
| **Overview** | Counts for registrations, pending reviews, courses, domains, media, and recent activity |
| **Students** | List/filter registrations (search, course, status, education, payment). View receipt. Update status (`PENDING` / `CONFIRMED` / `REJECTED`) and admin notes. Confirm/reject triggers student email |
| **Courses** | Create, update, publish/unpublish courses; set domain, fee, seats, sessions, images, sort order |
| **Domains** | Create, update, publish/unpublish domains; themes, imagery, sort order |
| **Media** | Upload assets for site use; delete unused assets from storage + database |
| **Settings** | Toggle registration open/closed and related site settings stored in `SiteSetting` |
| **Email** | Browse email delivery log (`PENDING` / `SENT` / `FAILED`) |

## API surface

| Endpoint | Role |
| --- | --- |
| `GET /api/courses` | Public published courses (+ registration open flag) |
| `POST /api/register` | Submit registration |
| `POST /api/uploads/signature` | Signed receipt upload parameters |
| `POST /api/admin/login` | Admin sign-in |
| `POST /api/admin/logout` | Admin sign-out |
| `PATCH`/`PUT` style routes under `/api/admin/*` | Registrations, courses, domains, settings, media upload |

Admin APIs require an authenticated session.

## Data model (Prisma)

- **Domain** — catalogue grouping; has many courses
- **Course** — published offering; belongs to a domain; has many registrations
- **Registration** — student application + payment receipt + status snapshot
- **MediaAsset** — uploaded image/file metadata
- **SiteSetting** — key/value JSON settings (e.g. registration open)
- **EmailLog** — outbound mail audit trail

Schema: `prisma/schema.prisma`. Seed data: `prisma/seed.ts` (from `app/content.ts`).

## Project layout

```text
app/                 # Pages, layout, API routes, fonts, content fallback
components/          # Header, Footer, toast, admin UI
lib/                 # prisma, auth, mail, media, validation, public-data, education
prisma/              # schema, migrations, seed
public/images/       # Logo and static brand assets
.env.example         # Required environment variables (template)
```

Generated Prisma client output: `app/generated/prisma` (gitignored; created by
`prisma generate` / `postinstall`).

## Environment variables

Copy `.env.example` to **`.env.local`** for local Next.js development (or `.env`
for Prisma CLI / tooling if you prefer a shared file). Never commit secrets.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Hosted DBs: prefer `sslmode=verify-full` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password |
| `ADMIN_SESSION_SECRET` | Random secret (≥ 32 characters) for JWT cookies |
| `NEXT_PUBLIC_APP_URL` | Optional public site URL (reserved; not required by current code) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP server |
| `SMTP_USER` / `SMTP_PASSWORD` | SMTP auth |
| `SMTP_FROM` | From header |
| `SMTP_ADMIN_TO` | Admin notification inbox for new registrations |
| `MEDIA_CLOUD_NAME` / `MEDIA_API_KEY` / `MEDIA_API_SECRET` | Media storage |
| `MEDIA_FOLDER` | Base folder (default `zenith-academy`) |

Legacy aliases `CLOUDINARY_*` still work if `MEDIA_*` is unset.

### Admin password hash

```bash
node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"
```

Bcrypt hashes contain `$`. Both Next.js and Vercel treat `$` as variable
interpolation, so the value must be escaped or login returns **401**.

| Where | How to store the hash |
| --- | --- |
| Local `.env.local` | Escape each `$` as `\$` → `\$2b\$12\$...` |
| **Vercel** env settings | Escape each `$` as `$$` → `$$2b$$12$$...` |

Example: if the generator prints `$2b$12$abcd...`, set on Vercel:

```text
ADMIN_PASSWORD_HASH=$$2b$$12$$abcd...
```

Also set `ADMIN_EMAIL` to the exact address you sign in with, and
`ADMIN_SESSION_SECRET` to a random string (≥ 32 characters). After changing
env vars on Vercel, **redeploy** so the new values load.

Use a random value of at least 32 characters for `ADMIN_SESSION_SECRET`.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure env from `.env.example` → `.env.local` (and ensure Prisma can read
   `DATABASE_URL`; this project loads env via `prisma.config.ts` / seed).

3. Apply migrations and seed catalogue data:

```bash
npm run db:deploy
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Useful scripts

| Script | Action |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations (CI / production) |
| `npm run db:seed` | Seed domains/courses from `app/content.ts` |
| `npm run lint` | ESLint |

`postinstall` runs `prisma generate` automatically after `npm install`.

## Production checklist

1. Set every required variable from `.env.example` on the host (never ship
   `.env.local`).
2. Point `DATABASE_URL` at managed Postgres with TLS as required by the provider.
3. Run `npm run db:deploy` on deploy (or in the release pipeline).
4. Configure real SMTP and media credentials.
5. Update payment instruction copy on the registration page to live account details.
6. Sign in at `/admin`, confirm seed content, then adjust courses/domains and
   open registration from Settings when ready.

## Operational notes

- **Without a database**, public pages still render from `app/content.ts`, but
  registration and admin mutations will not work.
- **Receipts** are verified server-side against media storage before a
  registration is stored.
- **Emails** are logged in `EmailLog`; failures appear under the Email tab.
- **Publishing** — only `isPublished` domains/courses appear on the public site.
