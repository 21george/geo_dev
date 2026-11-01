import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Smartphone,
  Globe2,
  Database,
  Gauge,
  Wrench,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Services — geo_dev | Developer in Munich",
  description:
    "Custom websites, web applications, mobile apps, APIs and integrations for businesses and private clients.",
};
const services = [
  {
    n: "01",
    icon: Globe2,
    title: "Websites & landing pages",
    intro: "Fast, responsive websites with a clear purpose.",
    items: [
      "Business websites and company profiles",
      "Landing pages and portfolios",
      "Responsive design and accessibility",
      "CMS setup and content architecture",
    ],
  },
  {
    n: "02",
    icon: Code2,
    title: "Web applications",
    intro: "Tailored tools that make everyday work easier.",
    items: [
      "Client and staff portals",
      "Dashboards and administration tools",
      "Booking and workflow systems",
      "Custom business software",
    ],
  },
  {
    n: "03",
    icon: Smartphone,
    title: "Mobile applications",
    intro: "Useful, polished experiences for iOS and Android.",
    items: [
      "React Native and Expo applications",
      "Mobile UI and user experience",
      "Authentication and secure data flows",
      "App backend integration",
    ],
  },
  {
    n: "04",
    icon: Database,
    title: "Backend & integrations",
    intro: "Reliable infrastructure behind the interface.",
    items: [
      "REST APIs and Laravel development",
      "Supabase, MongoDB and SQL databases",
      "Stripe and third-party integrations",
      "Authentication and access control",
    ],
  },
  {
    n: "05",
    icon: Gauge,
    title: "Performance & optimization",
    intro: "Improve an existing product's usability and speed.",
    items: [
      "Performance and responsiveness reviews",
      "Technical SEO foundations",
      "Accessibility improvements",
      "Code quality and maintainability",
    ],
  },
  {
    n: "06",
    icon: Wrench,
    title: "Maintenance & support",
    intro: "Keep your project dependable after launch.",
    items: [
      "Bug fixes and feature updates",
      "Deployment and hosting assistance",
      "Database and API improvements",
      "Ongoing technical support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="site inner-page">
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <p className="inner-eyebrow">WHAT I DO / MUNICH, GERMANY</p>
          <h1>
            Digital products,
            <br />
            <em>built with purpose.</em>
          </h1>
          <p>
            From an idea to a finished product, I help individuals and
            businesses create websites, web applications and mobile experiences
            that feel great and work reliably.
          </p>
        </section>
        <section className="service-list">
          {services.map(({ n, icon: Icon, title, intro, items }) => (
            <article className="service-entry" key={n}>
              <div className="service-id">{n} / SERVICE</div>
              <div>
                <div className="service-title">
                  <Icon size={24} strokeWidth={1.3} />
                  <h2>{title}</h2>
                </div>
                <p>{intro}</p>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
        <section className="process-block">
          <div>
            <p className="inner-eyebrow">HOW WE WORK</p>
            <h2>
              A clear process
              <br />
              from start to launch.
            </h2>
          </div>
          <div className="process-steps">
            {[
              [
                "01",
                "Discover",
                "Understand your goals, audience and requirements.",
              ],
              [
                "02",
                "Plan & design",
                "Define structure, features and the user experience.",
              ],
              [
                "03",
                "Build & test",
                "Develop, iterate, and test across devices.",
              ],
              [
                "04",
                "Launch & support",
                "Deploy your project and keep improving it.",
              ],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span>{n}</span>
                <strong>{t}</strong>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="inner-cta">
          <p>READY TO START?</p>
          <h2>Let's build your next project.</h2>
          <Link href="/contact?type=call">
            SCHEDULE A CALL <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
