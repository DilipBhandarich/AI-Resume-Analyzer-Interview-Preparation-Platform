import React, { useEffect, useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate, useParams } from "react-router";
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={children} />
  </svg>
);

const TechnicalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5h16v2H4V5Zm0 6h16v2H4v-2Zm0 6h10v2H4v-2Z" />
    <path d="M17 16h2v2h-2v-2Zm0 3h2v2h-2v-2Z" />
  </svg>
);

const RoadmapIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h14V5H5Z" />
    <path d="M7 8h10v2H7V8Zm0 4h7v2H7v-2Zm0 4h5v2H7v-2Z" />
  </svg>
);

const QuestionCard = ({ item, index }) => (
  <article className="question-card">
    <div className="question-card__number">
      {String(index + 1).padStart(2, "0")}
    </div>
    <div className="question-card__content">
      <h3>{item.question}</h3>
      <div className="question-card__section">
        <span className="question-card__label">Intention</span>
        <p>{item.intention}</p>
      </div>
      <div className="question-card__section question-card__section--answer">
        <span className="question-card__label">Suggested answer</span>
        <p>{item.answer}</p>
      </div>
    </div>
  </article>
);

const Interview = () => {
  const sectionIds = ["technical", "behavioral", "roadmap"];
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.slice(1);
    return sectionIds.includes(hash) ? hash : "technical";
  });
  const { report, getReportById, generateResumePdfReport, loading } =
    useInterview();
  const { interviewId } = useParams();
  const reportId = report?._id;

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const scrollToSection = (sectionId, behavior = "smooth") => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior, block: "start" });
  };

  useEffect(() => {
    const updateFromHash = (behavior = "smooth") => {
      const hash = window.location.hash.slice(1);
      if (!sectionIds.includes(hash)) {
        return;
      }

      setActiveSection(hash);
      scrollToSection(hash, behavior);
    };

    const updateFromScroll = () => {
      const headerOffset = 88;
      let currentSection = "technical";

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= headerOffset) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
      if (window.location.hash !== `#${currentSection}`) {
        window.history.replaceState(null, "", `#${currentSection}`);
      }
    };

    window.addEventListener("hashchange", updateFromHash);
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    if (sectionIds.includes(window.location.hash.slice(1))) {
      const initialHash = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        updateFromHash("auto");
        window.setTimeout(() => scrollToSection(initialHash, "auto"), 100);
      });
    } else {
      updateFromScroll();
    }

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, []);

  const handleSectionNavigation = (event, sectionId) => {
    event.preventDefault();
    setActiveSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
    scrollToSection(sectionId);
  };

  if (loading || !report) {
    return (
      <main className="loading-screen" role="status" aria-live="polite">
        <span className="loading-screen__spinner" aria-hidden="true" />
        <h1>Loading your interview plan...</h1>
        <p>Our AI is reviewing your profile and preparing your strategy.</p>
        <p className="loading-screen__note">This may take a few moments.</p>
      </main>
    );
  }
  return (
    <main className="interview">
      <header className="interview__topbar">
        <a className="interview__brand" href="/">
          <span className="interview__brand-mark">IA</span>
          <span>
            Interview<span>AI</span>
          </span>
        </a>
        <div className="interview__topbar-actions">
          <span className="interview__status">
            <span className="interview__status-dot" />
            Strategy ready
          </span>
          <a className="interview__back-link" href="/">
            <Icon>m9 19-7-7 7-7 1.4 1.4L5.8 11H21v2H5.8l4.6 4.6L9 19Z</Icon>
            New plan
          </a>
        </div>
      </header>

      <div className="interview__layout">
        <aside className="interview__sidebar">
          <div className="interview__sidebar-heading">
            <span className="eyebrow">Your interview plan</span>
            <h1>Frontend / Full-Stack Engineer</h1>
          </div>

          <nav className="interview__nav" aria-label="Interview plan sections">
            <a
              className={`interview__nav-item ${
                activeSection === "technical"
                  ? "interview__nav-item--active"
                  : ""
              }`}
              href="#technical"
              aria-current={activeSection === "technical" ? "page" : undefined}
              onClick={(event) => handleSectionNavigation(event, "technical")}
            >
              <TechnicalIcon />
              Technical questions
              <span>{report.technicalQuestions.length}</span>
            </a>
            <a
              className={`interview__nav-item ${
                activeSection === "behavioral"
                  ? "interview__nav-item--active"
                  : ""
              }`}
              href="#behavioral"
              aria-current={activeSection === "behavioral" ? "page" : undefined}
              onClick={(event) => handleSectionNavigation(event, "behavioral")}
            >
              <Icon>
                m12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a3 3 0 1 1 0 6 3 3 0
                0 1 0-6Zm0 12a7.9 7.9 0 0 1-5.3-2.05A5.99 5.99 0 0 1 12 14a5.99
                5.99 0 0 1 5.3 2.95A7.9 7.9 0 0 1 12 19Z
              </Icon>
              Behavioral questions
              <span>{report.behavioralQuestions.length}</span>
            </a>
            <a
              className={`interview__nav-item ${
                activeSection === "roadmap" ? "interview__nav-item--active" : ""
              }`}
              href="#roadmap"
              aria-current={activeSection === "roadmap" ? "page" : undefined}
              onClick={(event) => handleSectionNavigation(event, "roadmap")}
            >
              <RoadmapIcon />
              Preparation roadmap
              <span>{report.preparationPlan.length}d</span>
            </a>
          </nav>

          <button
            className="button primary-button interview__download-button"
            onClick={() =>
              generateResumePdfReport({ interviewReportId: reportId })
            }
            disabled={loading || !reportId}
            aria-busy={loading}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 2 1.42 5.58L19 9l-5.58 1.42L12 16l-1.42-5.58L5 9l5.58-1.42L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15ZM5 15l.54 1.46L7 17l-1.46.54L5 19l-.54-1.46L3 17l1.46-.54L5 15Z"></path>
            </svg>
            Download Resume
          </button>

          <div className="interview__sidebar-footer">
            <div className="interview__sidebar-score">
              <span>Profile match</span>
              <strong>{report.matchScore}%</strong>
            </div>
            <div className="interview__progress">
              <span style={{ width: `${report.matchScore}%` }} />
            </div>
            <p>Built from your resume and target role.</p>
          </div>
        </aside>

        <section className="interview__main-content">
          <div className="interview__page-heading" id="technical">
            <div>
              <span className="eyebrow">01 / Technical round</span>
              <h2>Technical questions</h2>
              <p>
                Focus areas tailored to the projects and technologies in your
                profile.
              </p>
            </div>
            <span className="interview__count-badge">
              {report.technicalQuestions.length} questions
            </span>
          </div>

          <div className="interview__question-list">
            {report.technicalQuestions.map((item, index) => (
              <QuestionCard item={item} index={index} key={item.question} />
            ))}
          </div>

          <div className="interview__section-heading" id="behavioral">
            <div>
              <span className="eyebrow">02 / Culture round</span>
              <h2>Behavioral questions</h2>
              <p>
                Use the STAR method to turn your experience into clear stories.
              </p>
            </div>
            <span className="interview__count-badge">
              {report.behavioralQuestions.length} questions
            </span>
          </div>
          <div className="interview__question-list">
            {report.behavioralQuestions.map((item, index) => (
              <QuestionCard item={item} index={index} key={item.question} />
            ))}
          </div>

          <div className="interview__section-heading" id="roadmap">
            <div>
              <span className="eyebrow">03 / Action plan</span>
              <h2>Preparation roadmap</h2>
              <p>
                A focused five-day plan to sharpen your interview readiness.
              </p>
            </div>
          </div>
          <div className="roadmap">
            {report.preparationPlan.map((plan) => (
              <article className="roadmap__item" key={plan.day}>
                <span className="roadmap__day">
                  DAY {String(plan.day).padStart(2, "0")}
                </span>
                <div>
                  <h3>{plan.focus}</h3>
                  <ul>
                    {plan.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="interview__insights">
          <div className="score-card">
            <div className="score-card__ring">
              <strong>{report.matchScore}</strong>
              <span>/ 100</span>
            </div>
            <div>
              <span className="eyebrow">Overall fit</span>
              <h2>Strong match</h2>
              <p>Your profile aligns well with this role.</p>
            </div>
          </div>

          <section className="insight-panel">
            <div className="insight-panel__heading">
              <div>
                <span className="eyebrow">Focus areas</span>
                <h2>Skill gaps</h2>
              </div>
              <span className="insight-panel__icon">+</span>
            </div>
            <div className="skill-list">
              {report.skillGaps.map((gap) => (
                <span
                  className={`skill-tag skill-tag--${gap.severity}`}
                  key={gap.skill}
                >
                  {gap.skill}
                  <small>{gap.severity}</small>
                </span>
              ))}
            </div>
          </section>

          <section className="insight-panel insight-panel--summary">
            <span className="eyebrow">Quick briefing</span>
            <h2>How to use this plan</h2>
            <p>
              Start with the technical questions, then rehearse your behavioral
              stories before following the roadmap each day.
            </p>
            <div className="briefing-tip">
              <span>✦</span>
              <p>
                Keep answers specific: name the decision, trade-off, and result.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
