import { Link } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../landing.scss";

const steps = [
  {
    number: "01",
    title: "Choose your target role",
    description: "Paste the job description so the preparation matches the position you want.",
  },
  {
    number: "02",
    title: "Add your experience",
    description: "Upload a PDF resume or describe your skills and experience in your own words.",
  },
  {
    number: "03",
    title: "Prepare with a plan",
    description: "Review role-specific questions, skill gaps, and practical next steps for your interview.",
  },
];

const Landing = () => {
  const { user } = useAuth();
  const destination = user ? "/workspace" : "/register";

  return (
    <main className="landing">
      <nav className="landing__nav" aria-label="Main navigation">
        <Link className="landing__brand" to="/" aria-label="Interview Prep home">
          <span className="landing__brand-mark" aria-hidden="true">✦</span>
          Interview<span>Prep</span>
        </Link>
        <div className="landing__nav-actions">
          <Link className="landing__login" to={user ? "/workspace" : "/login"}>
            {user ? "My workspace" : "Log in"}
          </Link>
          <Link className="landing__button landing__button--small" to={destination}>
            {user ? "Get started" : "Create account"}
          </Link>
        </div>
      </nav>

      <section className="landing__hero">
        <div className="landing__hero-copy">
          <p className="landing__eyebrow"><span /> AI-powered interview preparation</p>
          <h1>Walk into your next interview <em>ready.</em></h1>
          <p className="landing__lead">
            Turn your resume and a job description into a personal preparation plan—with likely questions,
            skill gaps, and clear steps to help you practice with confidence.
          </p>
          <div className="landing__hero-actions">
            <Link className="landing__button" to={destination}>Get started <span aria-hidden="true">→</span></Link>
            {!user && <Link className="landing__text-link" to="/login">Already have an account? Log in</Link>}
          </div>
          <p className="landing__privacy">Start with a PDF resume, or use a short self-description.</p>
        </div>

        <aside className="landing__preview" aria-label="Example interview preparation plan">
          <div className="landing__preview-top"><span>YOUR PREPARATION PLAN</span><span className="landing__live-dot">● Ready</span></div>
          <h2>Frontend Developer</h2>
          <p className="landing__preview-subtitle">A focused plan built around your target role</p>
          <div className="landing__preview-score"><span className="landing__score-ring">3</span><span><strong>Areas to practice</strong><small>Small steps make a difference</small></span></div>
          <ul className="landing__preview-list">
            <li><span>✓</span> React and component design</li>
            <li><span>✓</span> JavaScript fundamentals</li>
            <li><span>✓</span> Behavioral interview stories</li>
          </ul>
          <div className="landing__preview-footer"><span>Questions</span><span>Skill gaps</span><span>Action plan</span></div>
        </aside>
      </section>

      <section className="landing__how" id="how-it-works">
        <div className="landing__section-heading">
          <p className="landing__eyebrow">A simple way to get ready</p>
          <h2>From job post to practice plan</h2>
          <p>Know what to focus on before the interview starts.</p>
        </div>
        <div className="landing__steps">
          {steps.map((step) => (
            <article className="landing__step" key={step.number}>
              <span className="landing__step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing__benefit">
        <div><p className="landing__eyebrow">Practice with direction</p><h2>Spend your time on the things that matter.</h2></div>
        <p>See how your experience connects to the role, discover topics to strengthen, and practice answering questions before the real conversation.</p>
        <Link className="landing__text-link" to={destination}>Build my preparation plan <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="landing__footer"><Link className="landing__brand" to="/">✦ Interview<span>Prep</span></Link><span>Prepare thoughtfully. Interview confidently.</span></footer>
    </main>
  );
};

export default Landing;
