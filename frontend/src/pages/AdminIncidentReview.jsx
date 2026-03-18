import { useEffect, useMemo, useState, useCallback } from "react";
import { AdminIncidentStyles } from "../../styles/AdminIncidentStyling";
import { apiFetch } from "../services/api.js";

export default function AdminIncidentReview() {
  // "pending" | "verified" | "triaged" | "assigned"
  const [tab, setTab] = useState("pending");

  const [pending, setPending] = useState([]);
  const [verified, setVerified] = useState([]);
  const [triaged, setTriaged] = useState([]);
  const [assigned, setAssigned] = useState([]); // ✅ includes triaged too

  const [responders, setResponders] = useState([]);
  const [selectedResponder, setSelectedResponder] = useState({});

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [verifyingTriagedId, setVerifyingTriagedId] = useState(null);

  // ✅ Robust date formatter (Firestore Timestamp, {_seconds}, ISO strings, numbers)
  const formatDate = (val) => {
    if (!val) return "—";

    if (typeof val === "object") {
      if (typeof val.toDate === "function") return val.toDate().toLocaleString();
      if (typeof val._seconds === "number") return new Date(val._seconds * 1000).toLocaleString();
      if (typeof val.seconds === "number") return new Date(val.seconds * 1000).toLocaleString();
    }

    const d = new Date(val);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  };

  const fetchPending = useCallback(async () => {
    const data = await apiFetch("/api/incidents/pending");
    setPending(data.incidents || []);
  }, []);

  const fetchVerified = useCallback(async () => {
    const data = await apiFetch("/api/incidents/verified");
    setVerified(data.incidents || []);
  }, []);

  /**
   * ✅ KEY FIX:
   * /api/incidents/assigned returns:
   * - triaged
   * - assigned
   * - in_progress
   * - resolved
   *
   * We must show triaged in BOTH:
   *  - Triaged tab (only triaged)
   *  - Assigned tab (triaged + assigned + in_progress + resolved)
   */
  const fetchAssigned = useCallback(async () => {
    const data = await apiFetch("/api/incidents/assigned");
    const list = data.incidents || [];

    const tri = list.filter((x) => String(x.status || "").toLowerCase() === "triaged");

    setTriaged(tri);
    setAssigned(list); // ✅ do NOT remove triaged from assigned
  }, []);

  const fetchResponders = useCallback(async () => {
    try {
      const data = await apiFetch("/api/profile/responders");
      setResponders(data.responders || []);
    } catch (err) {
      console.log("Failed to fetch responders:", err?.message);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setErrMsg("");
    setLoading(true);
    try {
      await Promise.all([fetchPending(), fetchVerified(), fetchAssigned(), fetchResponders()]);
    } catch (err) {
      setErrMsg(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [fetchAssigned, fetchPending, fetchResponders, fetchVerified]);

  useEffect(() => {
    refreshAll();

    // ✅ Poll triaged/assigned for progress changes
    const t = setInterval(() => {
      fetchAssigned().catch(() => {});
    }, 8000);

    return () => clearInterval(t);
  }, [fetchAssigned, refreshAll]);

  const reviewIncident = async (id, decision) => {
    const ok = window.confirm(`Are you sure you want to ${decision.toUpperCase()} this incident?`);
    if (!ok) return;

    const severity = prompt("Override severity? (low/medium/high) or leave blank:");

    try {
      await apiFetch(`/api/incidents/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          ...(severity ? { severity } : {}),
        }),
      });

      if (decision === "rejected") {
        setPending((prev) => prev.filter((x) => x.id !== id));
        return;
      }

      const verifiedItem = pending.find((x) => x.id === id);
      setPending((prev) => prev.filter((x) => x.id !== id));

      if (verifiedItem) {
        setVerified((prev) => [
          {
            ...verifiedItem,
            status: "verified",
            ...(severity ? { severity } : {}),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      alert(err?.message || "Failed to review incident");
    }
  };

  const assignIncident = async (incidentId) => {
    const responderId = selectedResponder[incidentId];
    if (!responderId) return alert("Select a responder first");

    try {
      await apiFetch(`/api/incidents/${incidentId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responderId }),
      });

      alert("Incident assigned ✅");

      setVerified((prev) => prev.filter((x) => x.id !== incidentId));

      // safest to refresh from server (keeps triaged/assigned consistent)
      await fetchAssigned();
    } catch (err) {
      alert(err?.message || "Failed to assign incident");
    }
  };

  /**
   * ✅ Verify triaged = ONLY status change: triaged -> assigned
   * No re-assign.
   */
  const verifyTriagedIncident = async (incidentId) => {
    const ok = window.confirm("Verify this triaged incident and move it to Assigned?");
    if (!ok) return;

    try {
      setVerifyingTriagedId(incidentId);
      setErrMsg("");

      await apiFetch(`/api/incidents/${incidentId}/verify-triaged`, {
        method: "PATCH",
      });

      await fetchAssigned();
      alert("Triaged incident verified ✅");
    } catch (err) {
      alert(err?.message || "Failed to verify triaged incident");
    } finally {
      setVerifyingTriagedId(null);
    }
  };

  const rows = useMemo(() => {
    if (tab === "pending") return pending;
    if (tab === "verified") return verified;
    if (tab === "triaged") return triaged;

    // ✅ Assigned tab should show triaged too (so responder activity is visible)
    return assigned;
  }, [assigned, pending, tab, triaged, verified]);

  const statusLabel = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "triaged") return "Triaged";
    if (v === "assigned") return "Assigned";
    if (v === "in_progress") return "In Progress";
    if (v === "resolved") return "Resolved";
    if (v === "verified") return "Verified";
    if (v === "pending_review") return "Pending Review";
    if (v === "rejected") return "Rejected";
    return s || "—";
  };

  const responderName = (incident) => {
    if (incident.assignedResponder?.name) return incident.assignedResponder.name;
    if (incident.assignedResponder?.email) return incident.assignedResponder.email;

    const rid = incident.assignedTo || incident.triagedBy;
    const r = responders.find((x) => x.id === rid);
    return r?.name || r?.email || (rid ? rid : "—");
  };

  const getSeverityColor = (severity) => {
    switch (String(severity || "").toLowerCase()) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FFA500";
      case "low":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "pending_review":
        return "#FFA500";
      case "verified":
        return "#4CAF50";
      case "triaged":
        return "#8B5CF6";
      case "assigned":
        return "#FF6B35";
      case "in_progress":
        return "#FF6B35";
      case "resolved":
        return "#4CAF50";
      case "rejected":
        return "#FF3B30";
      default:
        return "#999";
    }
  };

  const resolvedCount = assigned.filter((i) => String(i.status || "").toLowerCase() === "resolved").length;

  return (
    <div style={AdminIncidentStyles.container}>
      {/* Header */}
      <div style={AdminIncidentStyles.header}>
        <div style={AdminIncidentStyles.titleContainer}>
          <h1 style={AdminIncidentStyles.title}>
            ResQ<span style={AdminIncidentStyles.titleAccent}>Admin</span>
          </h1>
          <p style={AdminIncidentStyles.subtitle}>Incident Management Panel</p>
        </div>

        {/* ✅ Added navigation buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => (window.location.href = "/admin/incidents")}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #1e40af",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            Review Incidents
          </button>

          <button
            onClick={() => (window.location.href = "/admin/reports")}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid #0f766e",
              background: "#14b8a6",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(20, 184, 166, 0.25)",
            }}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={AdminIncidentStyles.tabsContainer}>
        <button
          onClick={() => setTab("pending")}
          style={{
            ...AdminIncidentStyles.tabButton,
            ...(tab === "pending" ? AdminIncidentStyles.tabButtonActive : {}),
          }}
        >
          <span>Pending Review</span>
          <span style={AdminIncidentStyles.tabBadge}>{pending.length}</span>
        </button>

        <button
          onClick={() => setTab("verified")}
          style={{
            ...AdminIncidentStyles.tabButton,
            ...(tab === "verified" ? AdminIncidentStyles.tabButtonActive : {}),
          }}
        >
          <span>Verified</span>
          <span style={AdminIncidentStyles.tabBadge}>{verified.length}</span>
        </button>

        <button
          onClick={() => setTab("triaged")}
          style={{
            ...AdminIncidentStyles.tabButton,
            ...(tab === "triaged" ? AdminIncidentStyles.tabButtonActive : {}),
          }}
        >
          <span>Triaged</span>
          <span style={AdminIncidentStyles.tabBadge}>{triaged.length}</span>
        </button>

        <button
          onClick={() => setTab("assigned")}
          style={{
            ...AdminIncidentStyles.tabButton,
            ...(tab === "assigned" ? AdminIncidentStyles.tabButtonActive : {}),
          }}
        >
          <span>Assigned</span>
          <span style={AdminIncidentStyles.tabBadge}>{assigned.length}</span>
        </button>

        <button onClick={refreshAll} style={AdminIncidentStyles.refreshButton}>
          <span style={AdminIncidentStyles.refreshIcon}>↻</span>
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div style={AdminIncidentStyles.statsContainer}>
        <div style={AdminIncidentStyles.statCard}>
          <div style={AdminIncidentStyles.statValue}>{pending.length}</div>
          <div style={AdminIncidentStyles.statLabel}>Pending Review</div>
        </div>
        <div style={AdminIncidentStyles.statCard}>
          <div style={{ ...AdminIncidentStyles.statValue, color: "#4CAF50" }}>{verified.length}</div>
          <div style={AdminIncidentStyles.statLabel}>Verified</div>
        </div>
        <div style={AdminIncidentStyles.statCard}>
          <div style={{ ...AdminIncidentStyles.statValue, color: "#8B5CF6" }}>{triaged.length}</div>
          <div style={AdminIncidentStyles.statLabel}>Triaged</div>
        </div>
        <div style={AdminIncidentStyles.statCard}>
          <div style={{ ...AdminIncidentStyles.statValue, color: "#FF6B35" }}>{assigned.length}</div>
          <div style={AdminIncidentStyles.statLabel}>Assigned</div>
        </div>
        <div style={AdminIncidentStyles.statCard}>
          <div style={{ ...AdminIncidentStyles.statValue, color: "#4CAF50" }}>{resolvedCount}</div>
          <div style={AdminIncidentStyles.statLabel}>Resolved</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={AdminIncidentStyles.loadingContainer}>
          <div style={AdminIncidentStyles.loadingSpinner}></div>
          <p style={AdminIncidentStyles.loadingText}>Loading incidents...</p>
        </div>
      )}

      {/* Error Message */}
      {errMsg && (
        <div style={AdminIncidentStyles.errorContainer}>
          <span style={AdminIncidentStyles.errorIcon}>⚠️</span>
          <span style={AdminIncidentStyles.errorText}>{errMsg}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !errMsg && rows.length === 0 && (
        <div style={AdminIncidentStyles.emptyContainer}>
          <div style={AdminIncidentStyles.emptyIcon}>📋</div>
          <h3 style={AdminIncidentStyles.emptyTitle}>No records found</h3>
          <p style={AdminIncidentStyles.emptyText}>
            {tab === "pending" && "No pending incidents to review."}
            {tab === "verified" && "No verified incidents to assign."}
            {tab === "triaged" && "No triaged incidents at the moment."}
            {tab === "assigned" && "No assigned incidents at the moment."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !errMsg && rows.length > 0 && (
        <div style={AdminIncidentStyles.tableContainer}>
          <table style={AdminIncidentStyles.table}>
            <thead style={AdminIncidentStyles.tableHead}>
              <tr>
                <th style={AdminIncidentStyles.tableHeader}>Type</th>
                <th style={AdminIncidentStyles.tableHeader}>Description</th>
                <th style={AdminIncidentStyles.tableHeader}>Severity</th>
                <th style={AdminIncidentStyles.tableHeader}>Address</th>
                <th style={AdminIncidentStyles.tableHeader}>Image</th>

                {tab === "pending" && <th style={AdminIncidentStyles.tableHeader}>Actions</th>}
                {tab !== "pending" && <th style={AdminIncidentStyles.tableHeader}>Status</th>}
                {tab === "verified" && <th style={AdminIncidentStyles.tableHeader}>Assign Responder</th>}
                {tab === "triaged" && <th style={AdminIncidentStyles.tableHeader}>Verify Triaged</th>}

                {(tab === "triaged" || tab === "assigned") && (
                  <>
                    <th style={AdminIncidentStyles.tableHeader}>Responder</th>
                    <th style={AdminIncidentStyles.tableHeader}>Progress</th>
                    <th style={AdminIncidentStyles.tableHeader}>{tab === "triaged" ? "Triaged At" : "Last Updated"}</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((i, index) => (
                <tr
                  key={i.id}
                  style={{
                    ...AdminIncidentStyles.tableRow,
                    animation: `slideIn 0.3s ease ${index * 0.05}s both`,
                  }}
                >
                  <td style={AdminIncidentStyles.tableCell}>
                    <span style={AdminIncidentStyles.incidentType}>{i.type || "—"}</span>
                  </td>

                  <td style={AdminIncidentStyles.tableCell}>
                    <div style={AdminIncidentStyles.descriptionCell}>
                      {(i.description || "").slice(0, 80)}
                      {(i.description || "").length > 80 && (
                        <span style={AdminIncidentStyles.truncated}>...</span>
                      )}
                    </div>
                  </td>

                  <td style={AdminIncidentStyles.tableCell}>
                    {i.severity ? (
                      <span
                        style={{
                          ...AdminIncidentStyles.severityBadge,
                          backgroundColor: getSeverityColor(i.severity) + "20",
                          color: getSeverityColor(i.severity),
                        }}
                      >
                        {i.severity}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td style={AdminIncidentStyles.tableCell}>
                    <div style={AdminIncidentStyles.addressCell}>{i.fullAddress || "—"}</div>
                  </td>

                  <td style={AdminIncidentStyles.tableCell}>
                    {i.imageUrl ? (
                      <a
                        href={i.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={AdminIncidentStyles.imageLink}
                      >
                        <span style={AdminIncidentStyles.imageIcon}>🖼️</span>
                        View Image
                      </a>
                    ) : (
                      <span style={AdminIncidentStyles.noImage}>—</span>
                    )}
                  </td>

                  {tab === "pending" && (
                    <td style={AdminIncidentStyles.tableCell}>
                      <div style={AdminIncidentStyles.actionButtons}>
                        <button onClick={() => reviewIncident(i.id, "verified")} style={AdminIncidentStyles.verifyButton}>
                          ✓ Verify
                        </button>
                        <button onClick={() => reviewIncident(i.id, "rejected")} style={AdminIncidentStyles.rejectButton}>
                          ✗ Reject
                        </button>
                      </div>
                    </td>
                  )}

                  {tab !== "pending" && (
                    <td style={AdminIncidentStyles.tableCell}>
                      <span
                        style={{
                          ...AdminIncidentStyles.statusBadge,
                          backgroundColor: getStatusColor(i.status) + "20",
                          color: getStatusColor(i.status),
                        }}
                      >
                        {statusLabel(i.status)}
                      </span>
                    </td>
                  )}

                  {tab === "verified" && (
                    <td style={AdminIncidentStyles.tableCell}>
                      <div style={AdminIncidentStyles.assignContainer}>
                        <select
                          value={selectedResponder[i.id] || ""}
                          onChange={(e) =>
                            setSelectedResponder((prev) => ({
                              ...prev,
                              [i.id]: e.target.value,
                            }))
                          }
                          style={AdminIncidentStyles.selectInput}
                        >
                          <option value="">Select responder</option>
                          {responders.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name || r.email}
                            </option>
                          ))}
                        </select>

                        <button onClick={() => assignIncident(i.id)} style={AdminIncidentStyles.assignButton}>
                          Assign
                        </button>
                      </div>
                    </td>
                  )}

                  {tab === "triaged" && (
                    <td style={AdminIncidentStyles.tableCell}>
                      <button
                        onClick={() => verifyTriagedIncident(i.id)}
                        style={{
                          ...AdminIncidentStyles.assignButton,
                          opacity: verifyingTriagedId === i.id ? 0.7 : 1,
                        }}
                        disabled={verifyingTriagedId === i.id}
                      >
                        {verifyingTriagedId === i.id ? "Verifying..." : "✓ Verify"}
                      </button>
                    </td>
                  )}

                  {(tab === "triaged" || tab === "assigned") && (
                    <>
                      <td style={AdminIncidentStyles.tableCell}>
                        <div style={AdminIncidentStyles.responderCell}>
                          <span style={AdminIncidentStyles.responderIcon}>👤</span>
                          {responderName(i)}
                        </div>
                      </td>

                      <td style={AdminIncidentStyles.tableCell}>
                        <span
                          style={{
                            ...AdminIncidentStyles.progressBadge,
                            backgroundColor: getStatusColor(i.status) + "20",
                            color: getStatusColor(i.status),
                          }}
                        >
                          {statusLabel(i.status)}
                        </span>
                      </td>

                      <td style={AdminIncidentStyles.tableCell}>
                        <div style={AdminIncidentStyles.dateCell}>
                          <span style={AdminIncidentStyles.dateIcon}>🕒</span>
                          {tab === "triaged" ? formatDate(i.triagedAt) : formatDate(i.updatedAt)}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}