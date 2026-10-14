/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../services/axiosClient";
import "../styles/Audit.css";

interface AuditLog {
  auditId: string;
  userId: string;
  email: string;
  action: string;
  createdAt: string;
}

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.get("/dashboard/log");
      const data = response.data;

      setLogs(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    const keyword = searchEmail.trim().toLowerCase();

    if (!keyword) return logs;

    return logs.filter((log) =>
      (log.email ?? "").toLowerCase().includes(keyword)
    );
  }, [logs, searchEmail]);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleString();
  };

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div>
          <h1>Audit Logs</h1>
          <p>Review and track recorded system activities.</p>
        </div>

        <button
          className="audit-refresh-btn"
          onClick={() => void fetchLogs()}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="audit-stats">
        <span>Total Activities</span>
        <strong>{filteredLogs.length}</strong>
      </div>

      <section className="audit-history">
        <div className="audit-history-header">
          <div>
            <h2>Activity History</h2>
            <p>{filteredLogs.length} records found</p>
          </div>

          <input
            type="text"
            className="audit-search-input"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>

        {error && <p className="audit-error">{error}</p>}

        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Action</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="audit-empty">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="audit-empty">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.auditId}>
                    <td>
                      <div className="audit-user">
                        <div className="audit-avatar">
                          {(log.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <span>{log.email || "Unknown user"}</span>
                      </div>
                    </td>

                    <td>
                      <span className="audit-action">{log.action}</span>
                    </td>

                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AuditLogs;
