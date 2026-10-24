import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setError("");
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account. Check your details and try again.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
      setError("Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return { user, loading, error, handleLogin, handleRegister, handleLogout };
};
