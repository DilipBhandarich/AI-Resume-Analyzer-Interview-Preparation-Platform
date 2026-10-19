import { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  if (loading) {
    return (
      <main className="auth-page">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            ></input>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            ></input>
          </div>

          <button type="submit" className="button primary-button">
            Login
          </button>
        </form>
        <p>
          don't have accout? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
