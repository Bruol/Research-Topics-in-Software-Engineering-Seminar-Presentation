import { useEffect, useState } from "react";
import type { Slide } from "../types";

function clampIndex(nextIndex: number, max: number) {
  return Math.max(0, Math.min(max - 1, nextIndex));
}

export function PresentationDeck({
  slides,
  deckTitle,
}: {
  slides: Slide[];
  deckTitle: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = slides[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      ) {
        return;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === " " ||
        event.key === "PageDown"
      ) {
        event.preventDefault();
        setCurrentIndex((index) => clampIndex(index + 1, slides.length));
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        setCurrentIndex((index) => clampIndex(index - 1, slides.length));
      }

      if (event.key === "Home") {
        event.preventDefault();
        setCurrentIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setCurrentIndex(slides.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides]);

  const hasVisual = !!(current.visual || current.image || current.image2);

  return (
    <>
      {/* Google Fonts for IBM Plex Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        /* ═══════════════════════════════════
           Presentation Root
           ═══════════════════════════════════ */
        .pres-root {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          overflow: hidden;
        }

        /* ═══════════════════════════════════
           Fixed Header
           ═══════════════════════════════════ */
        .pres-header {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: rgba(245, 240, 232, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(18, 18, 18, 0.08);
        }

        .pres-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pres-header-bar {
          width: 3px;
          height: 28px;
          background: var(--accent);
          border-radius: 2px;
        }

        .pres-header-title {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .pres-header-subtitle {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 2px;
        }

        .pres-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pres-header-hint {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          display: none;
        }

        @media (min-width: 768px) {
          .pres-header-hint {
            display: block;
          }
        }

        .pres-header-counter {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink-soft);
          background: rgba(102, 73, 255, 0.08);
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(102, 73, 255, 0.15);
        }

        /* ═══════════════════════════════════
           Progress Dots (Bottom)
           ═══════════════════════════════════ */
        .pres-progress {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          padding: 0.5rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(102, 73, 255, 0.12);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .pres-progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(18, 18, 18, 0.15);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .pres-progress-dot:hover {
          background: rgba(102, 73, 255, 0.4);
          transform: scale(1.15);
        }

        .pres-progress-dot.active {
          background: var(--accent);
          width: 28px;
          border-radius: 999px;
        }

        .pres-progress-dot.appendix {
          background: rgba(18, 18, 18, 0.08);
          width: 8px;
          height: 8px;
        }

        .pres-progress-dot.appendix.active {
          background: var(--muted);
          width: 24px;
        }

        /* ═══════════════════════════════════
           Slide Base
           ═══════════════════════════════════ */
        .pres-slide {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 4rem;
        }

        .pres-slide::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: var(--accent);
        }

        .pres-slide.appendix::before {
          background: var(--muted);
          opacity: 0.4;
        }

        .pres-slide-inner {
          width: min(1100px, 100%);
          display: grid;
          gap: 3rem;
          padding-left: 1.5rem;
        }

        /* Two-column layout */
        .pres-slide.has-visual .pres-slide-inner {
          grid-template-columns: 1.1fr 0.9fr;
          align-items: start;
        }

        @media (max-width: 900px) {
          .pres-slide.has-visual .pres-slide-inner {
            grid-template-columns: 1fr;
          }
        }

        /* ═══════════════════════════════════
           Slide Content
           ═══════════════════════════════════ */
        .pres-content {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .pres-marker {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }

        .pres-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .pres-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.8rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
          max-width: 18ch;
        }

        .pres-slide.appendix .pres-title {
          color: var(--ink-soft);
        }

        .pres-thesis {
          font-family: var(--font-serif);
          font-size: clamp(1.1rem, 1.6vw, 1.35rem);
          font-style: italic;
          line-height: 1.55;
          color: var(--ink-soft);
          max-width: 52ch;
          margin: 0;
        }

        /* ═══════════════════════════════════
           Stats Grid
           ═══════════════════════════════════ */
        .pres-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .pres-stat {
          background: rgba(255, 255, 255, 0.7);
          border: 1.5px solid rgba(102, 73, 255, 0.12);
          border-radius: 12px;
          padding: 1rem 1.2rem;
        }

        .pres-stat-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.4rem;
        }

        .pres-stat-value {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.2vw, 1.8rem);
          font-weight: 700;
          color: var(--accent-deep);
          line-height: 1.1;
        }

        /* ═══════════════════════════════════
           Bullets
           ═══════════════════════════════════ */
        .pres-bullets {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .pres-bullet {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          font-family: var(--font-serif);
          font-size: clamp(0.95rem, 1.2vw, 1.08rem);
          line-height: 1.55;
          color: var(--ink-soft);
        }

        .pres-bullet::before {
          content: "";
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          background: var(--accent);
          margin-top: 0.55em;
        }

        /* ═══════════════════════════════════
           Sections
           ═══════════════════════════════════ */
        .pres-sections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 700px) {
          .pres-sections {
            grid-template-columns: 1fr;
          }
        }

        .pres-section {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(18, 18, 18, 0.06);
          border-left: 3px solid var(--accent);
          border-radius: 8px;
          padding: 1rem 1.2rem;
        }

        .pres-section-title {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .pres-section-body {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--ink-soft);
          margin: 0;
        }

        /* ═══════════════════════════════════
           Takeaway Box
           ═══════════════════════════════════ */
        .pres-takeaway {
          background: linear-gradient(135deg, rgba(102, 73, 255, 0.08), rgba(255, 73, 135, 0.04));
          border: 1.5px solid rgba(102, 73, 255, 0.15);
          border-radius: 14px;
          padding: 1.2rem 1.5rem;
          margin-top: 1rem;
        }

        .pres-takeaway-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--highlight);
          margin-bottom: 0.5rem;
        }

        .pres-takeaway-text {
          font-family: var(--font-serif);
          font-size: clamp(0.95rem, 1.15vw, 1.05rem);
          font-style: italic;
          line-height: 1.6;
          color: var(--ink);
          margin: 0;
        }

        /* ═══════════════════════════════════
           Citations
           ═══════════════════════════════════ */
        .pres-citations {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.8rem;
        }

        .pres-citation {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          background: rgba(18, 18, 18, 0.04);
          border: 1px solid rgba(18, 18, 18, 0.08);
          border-radius: 999px;
          padding: 0.3rem 0.7rem;
        }

        /* ═══════════════════════════════════
           Visual Panel
           ═══════════════════════════════════ */
        .pres-visual {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .pres-image-wrap {
          background: rgba(255, 255, 255, 0.75);
          border: 2px solid rgba(102, 73, 255, 0.12);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 16px 48px rgba(102, 73, 255, 0.08);
          overflow: hidden;
        }

        .pres-image {
          width: 100%;
          max-height: 55vh;
          object-fit: contain;
          border-radius: 10px;
          display: block;
        }

        .pres-svg-wrap {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(102, 73, 255, 0.12);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 16px 48px rgba(102, 73, 255, 0.08);
        }

        .pres-svg-wrap svg {
          width: 100%;
          height: auto;
          max-height: 50vh;
        }
      `}</style>

      <main className="pres-root">
        {/* Fixed Header */}
        <header className="pres-header">
          <div className="pres-header-left">
            <div className="pres-header-bar" />
            <div>
              <div className="pres-header-title">{deckTitle}</div>
              <div className="pres-header-subtitle">RTSE Seminar</div>
            </div>
          </div>
          <div className="pres-header-right">
            <span className="pres-header-hint">Space / Arrow Keys Navigate</span>
            <div className="pres-header-counter">
              {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        {/* Progress Dots */}
        <nav className="pres-progress" aria-label="Slide navigation">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              onClick={() => setCurrentIndex(index)}
              className={`pres-progress-dot ${index === currentIndex ? "active" : ""} ${slide.appendix ? "appendix" : ""}`}
            />
          ))}
        </nav>

        {/* Current Slide */}
        <section
          className={`pres-slide ${hasVisual ? "has-visual" : ""} ${current.appendix ? "appendix" : ""}`}
        >
          <div className="pres-slide-inner">
            {/* Content Column */}
            <div className="pres-content">
              <span className="pres-marker">
                No. {String(currentIndex + 1).padStart(2, "0")}
              </span>

              <hr className="rule-section" style={{ width: 60 }} />

              <p className="pres-eyebrow">{current.eyebrow}</p>

              <h2 className="pres-title">{current.title}</h2>

              <hr className="rule-thin" style={{ maxWidth: 400 }} />

              <p className="pres-thesis">{current.thesis}</p>

              {current.stats?.length ? (
                <div className="pres-stats">
                  {current.stats.map((stat) => (
                    <div key={`${current.id}-${stat.label}`} className="pres-stat">
                      <div className="pres-stat-label">{stat.label}</div>
                      <div className="pres-stat-value">{stat.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {current.bullets?.length ? (
                <ul className="pres-bullets">
                  {current.bullets.map((bullet) => (
                    <li key={`${current.id}-${bullet}`} className="pres-bullet">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {current.sections?.length ? (
                <div className="pres-sections">
                  {current.sections.map((section) => (
                    <div key={`${current.id}-${section.title}`} className="pres-section">
                      <div className="pres-section-title">{section.title}</div>
                      <p className="pres-section-body">{section.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {current.takeaway ? (
                <div className="pres-takeaway">
                  <div className="pres-takeaway-label">Why This Slide Matters</div>
                  <p className="pres-takeaway-text">{current.takeaway}</p>
                </div>
              ) : null}

              {current.citations?.length ? (
                <div className="pres-citations">
                  {current.citations.map((citation) => (
                    <span key={`${current.id}-${citation}`} className="pres-citation">
                      {citation}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Visual Column */}
            {hasVisual ? (
              <div className="pres-visual">
                {current.visual ? (
                  <div className="pres-svg-wrap">
                    {current.visual}
                  </div>
                ) : null}

                {current.image ? (
                  <div className="pres-image-wrap">
                    <img
                      src={current.image}
                      alt={current.imageAlt ?? "Slide visual"}
                      className="pres-image"
                    />
                  </div>
                ) : null}

                {current.image2 ? (
                  <div className="pres-image-wrap">
                    <img
                      src={current.image2}
                      alt={current.image2Alt ?? "Secondary visual"}
                      className="pres-image"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
