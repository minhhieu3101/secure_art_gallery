
import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../services/axiosClient";
import "../styles/Login.css";

type LoginView = "login" | "register" | "verify" | "forgot";
type ForgotStep = "email" | "reset";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [view, setView] = useState<LoginView>("login");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const changeView = (nextView: LoginView) => {
    setView(nextView);
    clearMessages();
    setPassword("");
    setConfirmPassword("");

    if (nextView !== "forgot" && nextView !== "verify") {
      setOtp("");
      setForgotStep("email");
    }

    if (nextView === "forgot") {
      setForgotStep("email");
      setOtp("");
    }
  };

  const getErrorMessage = (err: unknown): string => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const response = (
        err as {
          response?: { data?: { message?: string | string[] } };
        }
      ).response;

      const apiMessage = response?.data?.message;

      if (Array.isArray(apiMessage)) return apiMessage.join(", ");
      if (apiMessage) return apiMessage;
    }

    if (err instanceof Error) return err.message;

    return "Something went wrong. Please try again.";
  };

  // LOGIN
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // CREATE ACCOUNT
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();

    if (username.trim().length < 6) {
      setError("Username must be at least 6 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      // Account created; continue to email verification.
      setView("verify");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setMessage(
        "Account created. Enter the verification code sent to your email."
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // VERIFY ACCOUNT
  const handleVerifyAccount = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    clearMessages();

    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter the 4-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/user/verify", {
        email: email.trim(),
        otp,
      });

      setView("login");
      setOtp("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setMessage("Email verified successfully. You can now log in.");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // SEND OTP FOR FORGOT PASSWORD
  const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await axiosClient.post("/user/sendOTP", {
        email: email.trim(),
      });

      setForgotStep("reset");
      setMessage("OTP sent. Please check your email.");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    clearMessages();

    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter the 4-digit OTP.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.patch("/user/forgot-password", {
        email: email.trim(),
        otp,
        password,
      });

      setView("login");
      setForgotStep("email");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setMessage("Password reset successfully. Please log in.");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-card">
        <h1>ART GALLERY</h1>
        <p className="login-subtitle">Management System</p>

        {/* LOGIN */}
        {view === "login" && (
          <>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="login-links">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => changeView("forgot")}
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="form-error">{error}</p>}
              {message && <p className="form-success">{message}</p>}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="login-footer">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => changeView("register")}
              >
                Create Account
              </button>
            </p>
          </>
        )}

        {/* CREATE ACCOUNT */}
        {view === "register" && (
          <>
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-description">
              Enter your details to create an account.
            </p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="register-username"
                    type="text"
                    placeholder="Create a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="login-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => changeView("login")}
              >
                Back to Login
              </button>
            </p>
          </>
        )}

        {/* VERIFY ACCOUNT */}
        {view === "verify" && (
          <>
            <h2 className="auth-form-title">Verify Your Account</h2>
            <p className="auth-form-description">
              Enter the 4-digit verification code sent to your email.
            </p>

            <form onSubmit={handleVerifyAccount}>
              <div className="form-group">
                <label htmlFor="verify-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    id="verify-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="verify-otp">Verification Code</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    id="verify-otp"
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}
              {message && <p className="form-success">{message}</p>}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <p className="login-footer">
              Already verified?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => changeView("login")}
              >
                Back to Login
              </button>
            </p>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {view === "forgot" && (
          <>
            <h2 className="auth-form-title">
              {forgotStep === "email" ? "Forgot Password?" : "Reset Password"}
            </h2>

            <p className="auth-form-description">
              {forgotStep === "email"
                ? "Enter your email to receive a password reset code."
                : "Enter the OTP and choose a new password."}
            </p>

            {forgotStep === "email" ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {error && <p className="form-error">{error}</p>}
                {message && <p className="form-success">{message}</p>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="reset-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reset-otp">OTP Code</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input
                      id="reset-otp"
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      inputMode="numeric"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-new-password">
                    Confirm New Password
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {error && <p className="form-error">{error}</p>}
                {message && <p className="form-success">{message}</p>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  className="text-link resend-otp"
                  disabled={loading}
                  onClick={() => {
                    setForgotStep("email");
                    setOtp("");
                    setPassword("");
                    setConfirmPassword("");
                    clearMessages();
                  }}
                >
                  Resend OTP
                </button>
              </form>
            )}

            <p className="login-footer">
              Remember your password?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => changeView("login")}
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
