import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import PageFooter from "@/components/PageFooter";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact & Schedule a Call — geo_dev",
  description:
    "Contact George, freelance developer in Munich. Request a 30-minute introductory call or send a project enquiry.",
};

export default function ContactPage() {
  return (
    <div className="site inner-page">
      <SiteHeader />
      <main>
        <section className="inner-hero contact-hero">
          <p className="inner-eyebrow">GET IN TOUCH / MUNICH, GERMANY</p>
          <h1>
            Let's make your
            <br />
            <em>idea happen.</em>
          </h1>
          <p>
            Whether you need a professional business website, a custom web
            application or a mobile app, tell me what you're planning.
          </p>
        </section>
        <section className="contact-layout">
          <div className="contact-aside">
            <p className="inner-eyebrow">WORK TOGETHER</p>
            <h2>Start with a conversation.</h2>
            <p>
              Choose a call time or leave a message. I'll review your enquiry
              and respond as soon as possible.
            </p>
            <div className="contact-facts">
              <div>
                <span>LOCATION</span>
                <strong>Munich, Germany</strong>
              </div>
              <div>
                <span>PROJECTS</span>
                <strong>Websites · Web apps · Mobile apps</strong>
              </div>
              <div>
                <span>CALL TIMES</span>
                <strong>Weekdays, 09:00–17:30 (Munich)</strong>
              </div>
            </div>
          </div>
          <InquiryForm />
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
