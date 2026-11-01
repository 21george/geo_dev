import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "Rates & Project Pricing — geo_dev",
  description:
    "Understand how geo_dev prices websites, mobile apps and custom software. Request a tailored quote.",
};
const models = [
  {
    n: "01",
    title: "Fixed project",
    subtitle: "For clearly defined websites and app builds.",
    details: [
      "Agreed scope and milestones",
      "Transparent project quotation",
      "Design and development deliverables",
      "Testing and handover",
    ],
  },
  {
    n: "02",
    title: "Hourly development",
    subtitle: "For improvements, fixes and ongoing technical tasks.",
    details: [
      "Flexible, tracked development time",
      "Best for evolving requirements",
      "Regular progress updates",
      "Time estimates before work starts",
    ],
  },
  {
    n: "03",
    title: "Ongoing support",
    subtitle: "For businesses that need a dependable technical partner.",
    details: [
      "Maintenance and regular updates",
      "Priority planning for new features",
      "Technical reviews and advice",
      "Flexible monthly scope",
    ],
  },
];

export default function RatesPage() {
  return (
    <div className="site inner-page">
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <p className="inner-eyebrow">PRICING / NO SURPRISES</p>
          <h1>
            Clear scope.
            <br />
            <em>Fair pricing.</em>
          </h1>
          <p>
            Every project is different. I prepare a transparent quotation based
            on the features, design, integrations and timeline you actually
            need.
          </p>
        </section>
        <section className="pricing-layout">
          {models.map((model) => (
            <article key={model.n} className="pricing-card">
              <span>{model.n} / ENGAGEMENT</span>
              <h2>{model.title}</h2>
              <p>{model.subtitle}</p>
              <div className="pricing-value">Custom quotation</div>
              <ul>
                {model.details.map((detail) => (
                  <li key={detail}>
                    <Check size={16} />
                    {detail}
                  </li>
                ))}
              </ul>
              <Link href="/contact?type=message">
                REQUEST A QUOTE <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </section>
        <section className="rate-note">
          <h2>What affects the cost?</h2>
          <div>
            {[
              [
                "Complexity",
                "A simple landing page and a multi-role web application require different amounts of work.",
              ],
              [
                "Content & design",
                "Existing designs, copy and assets can shorten delivery time.",
              ],
              [
                "Integrations",
                "Payments, authentication, APIs and back-office workflows affect scope.",
              ],
              [
                "Support",
                "Hosting, maintenance and future feature development can be quoted separately.",
              ],
            ].map(([t, d]) => (
              <article key={t}>
                <strong>{t}</strong>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="inner-cta">
          <p>LET'S TALK THROUGH YOUR IDEA</p>
          <h2>Get a quotation tailored to your project.</h2>
          <Link href="/contact?type=call">
            BOOK AN INTRODUCTORY CALL <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
