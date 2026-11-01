# Editorial portfolio — Next.js / TypeScript

Reference-inspired dark developer portfolio with Tailwind 4, GSAP ScrollTrigger and Lenis.

## Local run

1. Run `npm install` (this also refreshes the lockfile for GSAP and Lenis).
2. Run `npm run dev`.
3. Open the local URL printed by the dev server.

## Supabase preparation

1. Create your Supabase project and execute `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and enter your project URL and publishable/anon key.
3. Insert records into `projects` and `testimonials`. Keep the column names from the schema; `images` is an array of public image URLs.
4. The `/api/portfolio` route reads the published rows ordered by `sort_order`. Without environment variables it uses local seed data in `lib/portfolio-data.ts`.

RLS permits public SELECT only. Keep project publishing and editing behind an authenticated admin backend; do not expose service-role keys in browser variables.

## Customize

- Replace the demo hero image and project photographs in `app/globals.css` and `lib/portfolio-data.ts`.
- The seed project screenshot URLs reference assets belonging to the original portfolio at cagd.as. The sample projects and shortened testimonials are reference material, not claims about your own work. Replace them before publishing your personal portfolio.
- Replace the name, introduction, navigation and email placeholders in `app/page.tsx`.
- Project screenshots, titles and the "View the website" links now open the live reference project websites in a new tab.
- The biography is now written for George, a Munich-based freelance developer building websites and applications for individuals and businesses. Replace `hello@example.com` with George's actual business email before launch.
- Replace illustrative testimonials with verified client reviews before public launch.
- The original reference's actual screenshots and portrait were not available. Current images and copy are visual placeholders.

## Motion

GSAP and ScrollTrigger drive reveal/parallax animation. Lenis is connected to the GSAP ticker for smooth wheel scrolling. Reduced-motion preferences disable this motion layer.

## Version 4 — motion and brand assets

- The supplied `geo_dev` image is stored at `public/geo-dev-logo.png`, used as the header brand mark and large hero art.
- Scroll effects adapt ideas from the attached racing-site motion prompt only: staggered hero text, smooth Lenis scrolling, project gallery parallax, subtle section recession, service reveals and a scroll progress line.
- No F1-specific visuals, WebGL helmet, circuit animation or racing copy are included.
- Mobile uses the same content with softer imagery and smaller type. Reduced-motion preference disables the JS motion layer.

## Contact, call requests and email notifications

The site now includes `/services`, `/rates` and `/contact`. The Contact page has two modes:

- `/contact?type=call`: request a 30-minute introductory call (weekdays, 09:00–17:30, Europe/Berlin). This is a **request**, not a confirmed calendar booking.
- `/contact?type=message`: send a general project enquiry.

Both forms POST to `/api/inquiries`. The API validates all fields, checks a hidden honeypot and minimum form completion time, stores the request in Supabase, then sends one email notification to the site owner using Nodemailer. The Supabase row records whether notification succeeded. If SMTP fails, the form submission remains stored for follow-up.

### Configuration

1. Run `supabase/inquiries.sql` in your Supabase SQL editor.
2. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `CONTACT_TO_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
3. Use an SMTP provider that supports authenticated SMTP. The `SMTP_FROM` address must be authorized by that provider. `CONTACT_TO_EMAIL` is the inbox where George receives notifications.
4. Run `npm install` to install Nodemailer, GSAP and Lenis, then `npm run dev`.
5. Submit a test message and call request. Verify both that the records appear in Supabase and that the notification emails reach your inbox.

### Gmail example configuration

The supplied `.env.example` is prefilled for Gmail SMTP:

- Host `smtp.gmail.com`, port `465` (TLS).
- Replace `yourname@gmail.com` with the Gmail account receiving notifications.
- Use the Google **App Password** generated for that account in `SMTP_PASS` — not the normal Gmail sign-in password. Google requires 2-Step Verification for App Passwords, and some account configurations do not offer them.
- Keep `SMTP_FROM` aligned with the Gmail account (or a sender alias Gmail permits).
- The displayed email is an example only. Nothing can send until you enter real credentials in `.env.local`.

Never commit `.env.local` to Git or upload it with the website source.

## Version 7 — mobile navigation and favicon

- Mobile navigation is a full-screen menu with Escape-key closing and background scroll locking.
- The hero places the supplied `geo_dev` artwork below the intro on narrow phones for improved readability.
- Project screenshots, testimonials, service cards and contact forms have refined tablet/phone spacing.
- Heavy scroll-linked transforms are disabled on phone widths; reduced-motion preferences still skip the motion engine.
- The browser favicon, shortcut icon and Apple touch icon all use the supplied `public/geo-dev-logo.png`.
- Removed the unused starter ChatGPT sign-in helper and starter favicon. No analytics, pixel or AI tracking script was found in the rendered app source; external project images and Google Fonts remain third-party resources.

**Security:** Keep `SUPABASE_SECRET_KEY` and SMTP credentials in server-only environment variables. Do not add `NEXT_PUBLIC_` to their names. RLS denies direct visitor access to enquiries. Add production-grade abuse protection (rate limiting/Turnstile) and a reviewed privacy notice before public launch.

**Hosting:** Nodemailer uses outbound SMTP, which requires a Node.js runtime with network access to SMTP. The Sites Cloudflare Worker runtime does not support raw TCP SMTP; this Nodemailer route is intended for compatible Node hosting. Use a provider HTTP email API if you deploy on a Worker-only host.

**Reliability:** Enquiries are stored first. Notifications are immediate best-effort attempts; monitor rows where `email_status = 'failed'` because there is no automated retry queue yet. No calendar invites or availability checks are sent, so George must manually confirm call requests.
