/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import "../styles/MyAccount.css";

interface Account {
  username?: string;
  email?: string;
  role?: string;
  status?: string;
}

function MyAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axiosClient.get("/user");
        const data = response.data?.data ?? response.data;

        setAccount({
          username: data.username ?? data.name,
          email: data.email,
          role: data.role,
          status: data.status,
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message ??
            "Could not load account information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  if (loading) {
    return (
      <div className="my-account-page">
        <p>Loading account...</p>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="my-account-page">
        <h1>My Account</h1>
        <p className="account-error">
          {error || "Account information is unavailable."}
        </p>
      </div>
    );
  }

  const role = account.role || "User";
  const status = account.status || "Active";

  return (
    <div className="my-account-page">
      <div className="account-page-header">
        <h1>My Account</h1>
        <p>View your account information.</p>
      </div>

      <div className="account-content">
        <section className="account-profile">
          <div className="account-avatar">
            {(account.username || account.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2>{account.username || "User"}</h2>
          <p>{account.email || "Email not available"}</p>

          <span className={`account-role role-${role.toLowerCase()}`}>
            {role}
          </span>
        </section>

        <section className="account-details">
          <h2>Personal Information</h2>

          <div className="account-field">
            <label>Username</label>
            <input
              value={account.username || ""}
              placeholder="Username not available"
              readOnly
            />
          </div>

          <div className="account-field">
            <label>Email</label>
            <input
              value={account.email || ""}
              placeholder="Email not available"
              readOnly
            />
          </div>

          <div className="account-field">
            <label>Role</label>
            <input value={role} readOnly />
          </div>

          <div className="account-field">
            <label>Status</label>
            <input value={status} readOnly />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyAccount;
