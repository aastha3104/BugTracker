import ThemeToggle from "./ThemeToggle";

function AuthBackground({ children, message, submessage }) {
  return (
    <main className="auth-shell">
      <div className="auth-theme-control"><ThemeToggle /></div>
      <div className="auth-grid" />
      <div className="auth-orbit auth-orbit-one" />
      <div className="auth-orbit auth-orbit-two" />
      <div className="auth-particles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>
      <div className="auth-bugs" aria-hidden="true">
        <span>•</span><span>•</span><span>•</span><span>•</span>
      </div>
      <section className="auth-layout">
        <div className="auth-message"><span className="eyebrow">BugTrack / QA command center</span><h1>{message}</h1><p>{submessage}</p></div>
        {children}
      </section>
    </main>
  );
}

export default AuthBackground;
