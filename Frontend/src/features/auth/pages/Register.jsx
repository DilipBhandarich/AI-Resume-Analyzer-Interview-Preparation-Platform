import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };
  return (
    <main className="auth-page">
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
            ></input>
          </div>

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
            Register
          </button>
        </form>
        <p>
          Already have a account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
