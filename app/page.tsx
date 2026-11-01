"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { projects, testimonials, type Project } from "@/lib/portfolio-data";
import SiteHeader from "@/components/SiteHeader";

function SiteTiles({ project, n }: { project: Project; n: number }) {
  return (
    <div className="tiles reveal">
      {project.images.map((src, i) => (
        <a
          className={`tile screenshot ${i % 4 === 0 ? "wide" : ""}`}
          key={src}
          href={project.url || "#contact"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.client} website in a new tab`}
        >
          <img
            src={src}
            alt={`${project.client} website screenshot ${i + 1}`}
            loading="lazy"
          />
          <span className="tile-open">
            VISIT WEBSITE <ArrowUpRight size={14} />
          </span>
        </a>
      ))}
    </div>
  );
}
function ProjectRow({ project, n }: { project: Project; n: number }) {
  return (
    <article className="project-row" id={`project-${n + 1}`}>
      <div className="project-copy reveal">
        <p className="index">
          0{n + 1} / 0{projects.length} <span>SELECTED WORK</span>
        </p>
        <h2>
          <a
            className="project-title-link"
            href={project.url || "#contact"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.title}
          </a>
        </h2>
        <p className="summary">{project.summary}</p>
        <a
          href={project.url || "#contact"}
          target="_blank"
          rel="noreferrer"
          className="underlink"
        >
          View the website <ArrowUpRight size={13} />
        </a>
        <dl className="details">
          <div>
            <dt>AGENCY</dt>
            <dd>{project.agency || "Independent"}</dd>
          </div>
          <div>
            <dt>CLIENT</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>ROLE</dt>
            <dd>{project.services}</dd>
          </div>
          <div>
            <dt>YEAR</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
        <p className="description">{project.description}</p>
      </div>
      <SiteTiles project={project} n={n} />
    </article>
  );
}
export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState({ projects, testimonials });
  useEffect(() => {
    let alive = true;
    fetch("/api/portfolio")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data?.projects?.length)
          setContent({
            projects: data.projects,
            testimonials: data.testimonials?.length
              ? data.testimonials
              : testimonials,
          });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    let lenis: any;
    let ticker: any;
    let context: any;
    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (!active) return;
      gsap.registerPlugin(ScrollTrigger);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lenis = new Lenis({ duration: 1.18, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        context = gsap.context(() => {
          const phone = window.matchMedia("(max-width: 639px)").matches;
          gsap.fromTo(
            ".hero-word",
            { opacity: 0, y: "0.35em" },
            {
              opacity: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.095,
              ease: "power3.out",
              delay: 0.1,
            },
          );
          gsap.fromTo(
            ".hero-copy .intro, .hero-copy .status, .hero-copy .underlink",
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.16,
              ease: "power3.out",
              delay: 0.55,
            },
          );
          gsap.fromTo(
            ".hero-visual",
            { opacity: 0, y: 70, scale: 1.06 },
            { opacity: 1, y: 0, scale: 1, duration: 1.65, ease: "power3.out" },
          );
          gsap.utils
            .toArray<HTMLElement>(".reveal")
            .forEach((el) =>
              gsap.fromTo(
                el,
                { opacity: 0, y: 46 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.1,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 88%", once: true },
                },
              ),
            );
          gsap.utils
            .toArray<HTMLElement>(".project-row")
            .forEach((row, index) => {
              const next = row.nextElementSibling;
              if (next?.classList.contains("project-row") && !phone)
                gsap.to(row, {
                  scale: 0.975,
                  opacity: 0.56,
                  transformOrigin: "center top",
                  ease: "none",
                  scrollTrigger: {
                    trigger: next,
                    start: "top bottom",
                    end: "top 15%",
                    scrub: 1.25,
                  },
                });
              if (!phone) {
                gsap.fromTo(
                  row.querySelectorAll(".tile img"),
                  { scale: 1.13 },
                  {
                    scale: 1,
                    ease: "none",
                    stagger: 0.05,
                    scrollTrigger: {
                      trigger: row,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.5,
                    },
                  },
                );
                gsap.fromTo(
                  row.querySelectorAll(".tile"),
                  { y: 25 },
                  {
                    y: -24,
                    ease: "none",
                    stagger: 0.04,
                    scrollTrigger: {
                      trigger: row,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.8,
                    },
                  },
                );
              }
            });
          if (!phone)
            gsap.to(".hero-visual", {
              yPercent: 16,
              scale: 1.07,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          gsap.fromTo(
            ".services-grid > div",
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.13,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".services-grid",
                start: "top 80%",
                once: true,
              },
            },
          );
          gsap.to(".scroll-progress", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
          });
        }, root);
      }
    })();
    return () => {
      active = false;
      context?.revert();
      if (ticker)
        import("gsap").then(({ default: gsap }) => gsap.ticker.remove(ticker));
      lenis?.destroy();
    };
  }, []);
  return (
    <div ref={root} className="site">
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader />
      <main id="top">
        <section className="hero" id="about">
          <div className="hero-copy">
            <h1 aria-label="Freelance Developer building websites and apps that work beautifully.">
              <span aria-hidden="true">
                <span className="hero-word">Freelance</span>{" "}
                <em className="hero-word">Developer</em>
                <br />
                <span className="hero-word">building</span>{" "}
                <span className="hero-word">websites</span>{" "}
                <span className="hero-word">and</span>{" "}
                <span className="hero-word">apps</span>{" "}
                <span className="hero-word">that</span>{" "}
                <span className="hero-word">work</span>{" "}
                <span className="hero-word">beautifully.</span>
              </span>
            </h1>
            <p className="intro">
              I'm George, a freelance software developer based in Munich,
              Germany. I design and build modern websites, web applications and
              mobile apps for individuals and businesses — from first idea to
              launch.
            </p>
            <p className="status">
              <i /> Available for new projects &nbsp; – &nbsp; Munich, Germany
            </p>
            <a className="underlink" href="#work">
              Explore my portfolio <ArrowDownRight size={14} />
            </a>
          </div>
          <div
            className="hero-visual"
            role="img"
            aria-label="geo_dev — Build, Code, Create logo"
          />
          <span className="side-label">MUNICH · GERMANY</span>
        </section>
        <section className="work" id="work">
          <div className="portfolio-disclaimer">
            REFERENCE PROJECTS{" "}
            <span>
              These example case studies link to their original websites.
              Replace them with George's completed work before publishing
              publicly.
            </span>
          </div>
          {content.projects.map((project, n) => (
            <ProjectRow project={project} n={n} key={project.id} />
          ))}
        </section>
        <section className="testimonials" id="testimonials">
          <div className="testimonial-heading reveal">
            <h2>
              Selected
              <br />
              testimonials.
            </h2>
            <p>
              Illustrative testimonials.
              <br />
              Replace with verified client feedback.
            </p>
          </div>
          <div className="quotes">
            {content.testimonials.map((t, i) => (
              <figure key={i} className="quote reveal">
                <div className="avatar">{t.initials}</div>
                <div>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <span>
                      {t.name}
                      <small>{t.role}</small>
                    </span>
                    <span>{t.company}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
        <section className="services-section reveal" id="services">
          <p>FREELANCE SOFTWARE DEVELOPMENT · MUNICH</p>
          <h2>Digital solutions for people and businesses.</h2>
          <div className="services-grid">
            <div>
              <b>01</b>
              <h3>Business websites</h3>
              <p>
                Responsive, professional websites that help your business stand
                out and reach customers.
              </p>
            </div>
            <div>
              <b>02</b>
              <h3>Web applications</h3>
              <p>
                Custom dashboards, booking systems, portals and business tools
                built around your workflow.
              </p>
            </div>
            <div>
              <b>03</b>
              <h3>Mobile apps</h3>
              <p>
                Modern iOS and Android apps, from polished interfaces to secure
                backend integrations.
              </p>
            </div>
            <div>
              <b>04</b>
              <h3>APIs & integrations</h3>
              <p>
                Reliable backends, databases, payments and integrations that
                connect your systems.
              </p>
            </div>
          </div>
        </section>
        <section className="contact reveal" id="contact">
          <p>BASED IN MUNICH · WORKING WORLDWIDE</p>
          <h2>
            Have a website or app idea?
            <br />
            Let's build something great.
          </h2>
          <div className="contact-actions">
            <a className="underlink" href="/contact?type=call">
              SCHEDULE A CALL <ArrowUpRight size={16} />
            </a>
            <a className="underlink" href="/contact?type=message">
              SEND A MESSAGE <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <a href="#top" className="logo">
          geo_dev — FREELANCE DEVELOPER
        </a>
        <div>
          <a href="https://cagd.as/" target="_blank" rel="noreferrer">
            Design reference
          </a>
          <a href="/contact?type=message">Contact</a>
        </div>
        <span>© {new Date().getFullYear()} George · Munich, Germany</span>
      </footer>
    </div>
  );
}
