import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7h3.5A2.5 2.5 0 0 1 21 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-7A2.5 2.5 0 0 1 5.5 7H9V5.5Zm2 0V7h2V5.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5ZM5.5 9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H5.5Z" />
    <path d="M3.5 11.25h17v2h-17v-2Z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 16a1 1 0 0 1-1-1V8.41l-2.3 2.3-1.4-1.42L12 4.59l4.7 4.7-1.4 1.42-2.3-2.3V15a1 1 0 0 1-1 1Zm-6 2h12v2H6v-2Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 2 1.42 5.58L19 9l-5.58 1.42L12 16l-1.42-5.58L5 9l5.58-1.42L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15ZM5 15l.54 1.46L7 17l-1.46.54L5 19l-.54-1.46L3 17l1.46-.54L5 15Z" />
  </svg>
);

const formatReportDate = (report) => {
  let date = report.createdAt ? new Date(report.createdAt) : null;

  if (!date || Number.isNaN(date.getTime())) {
    const idTimestamp = report._id?.toString().slice(0, 8);
    date = idTimestamp
      ? new Date(parseInt(idTimestamp, 16) * 1000)
      : null;
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return `Generated ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const resumeInputRef = useRef(null);

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (!data?._id) {
      return;
    }
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
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
    <main className="home">
      <div className="home__content">
        <header className="home__header">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a
            <br className="home__header-break" /> winning strategy.
          </p>
          <span className="home__scroll-dot" aria-hidden="true">
            ↓
          </span>
        </header>

        <section className="interview-card" aria-label="Interview plan details">
          <div className="interview-card__body">
            <div className="interview-input-group">
              <div className="left">
                <div className="section-heading">
                  <div className="section-heading__title">
                    <BriefcaseIcon />
                    <label htmlFor="jobDescription">
                      Target Job Description
                    </label>
                  </div>
                  <span className="required-badge">Required</span>
                </div>
                <div className="textarea-wrap textarea-wrap--large">
                  <textarea
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                    }}
                    name="jobDescription"
                    id="jobDescription"
                    maxLength="5000"
                    placeholder={
                      'Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'
                    }
                  />
                  <span className="character-count">0 / 5000 chars</span>
                </div>
              </div>

              <div className="right">
                <div className="section-heading section-heading--profile">
                  <div className="section-heading__title">
                    <UserIcon />
                    <h2>Your Profile</h2>
                  </div>
                </div>
                <div className="input_group">
                  <p className="field-label">
                    <span>Upload Resume</span>{" "}
                    <small className="highlight">(Best Results)</small>
                  </p>
                  <label className="file-label" htmlFor="resume">
                    <span className="upload-icon">
                      <UploadIcon />
                    </span>
                    <strong>Click to upload or drag &amp; drop</strong>
                    <small>PDF or DOCX (Max 5MB)</small>
                  </label>
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.docx"
                  />
                </div>

                <div className="form-divider">
                  <span>OR</span>
                </div>

                <div className="input_group self-description">
                  <label className="field-label" htmlFor="selfDescription">
                    Quick Self-Description
                  </label>
                  <textarea
                    onChange={(e) => {
                      setSelfDescription(e.target.value);
                    }}
                    name="selfDescription"
                    id="selfDescription"
                    maxLength="1000"
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  />
                </div>

                <div className="form-notice">
                  <span aria-hidden="true">i</span>
                  <p>
                    Either a <strong>Resume</strong> or a{" "}
                    <strong>Self Description</strong> is required to generate a
                    personalized plan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="interview-card__footer">
            <span className="footer-note">
              AI-Powered Strategy Generation <b>•</b> Approx 30s
            </span>
            <button
              onClick={handleGenerateReport}
              className="button primary-button"
              type="button"
              disabled={loading}
              aria-busy={loading}
            >
              <SparkleIcon />
              {loading
                ? "Generating Your Interview Strategy..."
                : "Generate My Interview Strategy"}
            </button>
          </footer>
        </section>

        {/* Recent report list */}
        {reports.length > 0 && (
          <section className="recent-reports">
            <div className="recent-reports__header">
              <div>
                <span className="recent-reports__eyebrow">Your workspace</span>
                <h2>My Recent Interview Plans</h2>
              </div>
              <span className="recent-reports__count">
                {reports.length} {reports.length === 1 ? "plan" : "plans"}
              </span>
            </div>
            <ul className="recent-reports__list">
              {reports.map((report, index) => (
                <li key={report._id}>
                  <a href={`/interview/${report._id}`}>
                    <span className="recent-reports__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="recent-reports__icon" aria-hidden="true">
                      ✦
                    </span>
                    <span className="recent-reports__details">
                      <strong className="report-job">
                        {report.title ||
                          report.jobDescription?.slice(0, 60) ||
                          "Untitled interview plan"}
                      </strong>
                      <span className="report-date">
                        {formatReportDate(report)}
                      </span>
                    </span>
                    <span className="recent-reports__score">
                      <strong>{report.matchScore ?? "--"}%</strong>
                      <small>match</small>
                    </span>
                    <span className="recent-reports__open" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="home__footer">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </footer>
      </div>
    </main>
  );
};
export default Home;
