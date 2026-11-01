import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../logout.scss";

const LogoutButton = ({ className = "" }) => {
  const { loading, error, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    const loggedOut = await handleLogout();
    if (loggedOut) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={`logout-control ${className}`.trim()}>
      <button
        className="logout-button"
        type="button"
        onClick={onLogout}
        disabled={loading}
      >
        {loading ? "Signing out…" : "Log out"}
      </button>
      {error && <span className="logout-error" role="alert">{error}</span>}
    </div>
  );
};

export default LogoutButton;
