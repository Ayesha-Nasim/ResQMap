import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function formatDate(val) {
  if (!val) return "—";

  if (typeof val === "object") {
    if (typeof val.toDate === "function") return val.toDate().toLocaleString();
    if (typeof val._seconds === "number") return new Date(val._seconds * 1000).toLocaleString();
    if (typeof val.seconds === "number") return new Date(val.seconds * 1000).toLocaleString();
  }

  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

const PIE_COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#a855f7",
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e5e7eb",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },
  nav: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  linkBtn: {
    textDecoration: "none",
    background: "#1e293b",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    background: "#0ea5e9",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #0284c7",
    cursor: "pointer",
    fontSize: "14px",
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "16px",
    padding: "18px",
  },
  metric: {
    fontSize: "26px",
    fontWeight: "700",
    marginTop: "8px",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "18px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #1f2937",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #374151",
    color: "#cbd5e1",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #1f2937",
    fontSize: "14px",
    verticalAlign: "top",
  },
  error: {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "16px",
  },
  chartBox: {
    width: "100%",
    height: "320px",
  },
  infoText: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "16px",
  },
};

export default function AdminReportsAnalytics() {
  const [data, setData] = useState(null);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrMsg("");

      try {
        const summary = await apiFetch("/api/reports/summary");
        setData(summary);
        setLoading(false);

        apiFetch("/api/profile/responders")
          .then((responderData) => {
            setResponders(responderData.responders || []);
          })
          .catch(() => {
            setResponders([]);
          });
      } catch (err) {
        setErrMsg(err?.message || "Failed to load reports");
        setLoading(false);
      }
    };

    load();
  }, []);

  const responderNameMap = useMemo(() => {
    const map = {};
    for (const r of responders) {
      map[r.id] = r.name || r.email || r.id;
    }
    return map;
  }, [responders]);

  const severityPieData = useMemo(() => {
    if (!data?.severityCounts) return [];
    return Object.entries(data.severityCounts)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .filter((item) => item.value > 0);
  }, [data]);

  const statusBarData = useMemo(() => {
    if (!data?.summaryCards) return [];
    return Object.entries(data.summaryCards)
      .filter(([key]) => key !== "total")
      .map(([name, count]) => ({
        name: name.replaceAll("_", " "),
        count,
      }));
  }, [data]);

  const typeBarData = useMemo(() => {
    return (data?.types || []).slice(0, 6).map((item) => ({
      name: item.label,
      count: item.count,
    }));
  }, [data]);

  const trendLineData = useMemo(() => {
    return (data?.incidentTrend7Days || []).map((item) => ({
      date: item.label,
      count: item.count,
    }));
  }, [data]);

  const responderChartData = useMemo(() => {
    return (data?.responderWorkload || []).slice(0, 6).map((r) => ({
      name: responderNameMap[r.responderId] || r.responderId,
      Assigned: r.assignedCount,
      "In Progress": r.inProgressCount,
      Resolved: r.resolvedCount,
    }));
  }, [data, responderNameMap]);

  const exportPDF = async () => {
    if (!data) return;

    try {
      setExporting(true);

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("ResQMap - Admin Reports & Analytics", 14, 18);

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

      doc.setFontSize(12);
      doc.text("Summary", 14, 36);

      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Count"]],
        body: [
          ["Total Incidents", data.summaryCards?.total ?? 0],
          ["Pending Review", data.summaryCards?.pending_review ?? 0],
          ["Verified", data.summaryCards?.verified ?? 0],
          ["Triaged", data.summaryCards?.triaged ?? 0],
          ["Assigned", data.summaryCards?.assigned ?? 0],
          ["In Progress", data.summaryCards?.in_progress ?? 0],
          ["Resolved", data.summaryCards?.resolved ?? 0],
          ["Rejected", data.summaryCards?.rejected ?? 0],
        ],
        theme: "grid",
      });

      doc.text("Severity Breakdown", 14, doc.lastAutoTable.finalY + 12);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [["Severity", "Count"]],
        body: Object.entries(data.severityCounts || {}).map(([label, count]) => [label, count]),
        theme: "grid",
      });

      doc.text("Incidents by Type", 14, doc.lastAutoTable.finalY + 12);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [["Type", "Count"]],
        body: (data.types || []).map((item) => [item.label, item.count]),
        theme: "grid",
      });

      doc.text("Top Affected Areas", 14, doc.lastAutoTable.finalY + 12);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [["Area", "Count"]],
        body: (data.topAreas || []).map((item) => [item.label, item.count]),
        theme: "grid",
      });

      doc.addPage();
      doc.setFontSize(14);
      doc.text("Responder Workload", 14, 18);

      autoTable(doc, {
        startY: 24,
        head: [["Responder", "Assigned", "In Progress", "Resolved"]],
        body: (data.responderWorkload || []).map((r) => [
          responderNameMap[r.responderId] || r.responderId,
          r.assignedCount,
          r.inProgressCount,
          r.resolvedCount,
        ]),
        theme: "grid",
      });

      doc.text("Incident Trend (Last 7 Days)", 14, doc.lastAutoTable.finalY + 12);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [["Date", "Incident Count"]],
        body: (data.incidentTrend7Days || []).map((item) => [item.label, item.count]),
        theme: "grid",
      });

      doc.addPage();
      doc.setFontSize(14);
      doc.text("Recent High Severity Incidents", 14, 18);

      autoTable(doc, {
        startY: 24,
        head: [["Type", "Severity", "Status", "Location", "Created"]],
        body: (data.recentCritical || []).map((item) => [
          item.type,
          item.severity,
          item.status,
          item.fullAddress,
          formatDate(item.createdAt),
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
        },
        columnStyles: {
          3: { cellWidth: 65 },
          4: { cellWidth: 35 },
        },
        theme: "grid",
      });

      doc.save(`ResQMap_Admin_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div style={styles.page}>Loading reports...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Reports & Analytics</h1>

        <div style={styles.nav}>
          <a href="/admin/incidents" style={styles.linkBtn}>
            Incident Review
          </a>
          <a href="/admin/reports" style={styles.linkBtn}>
            Reports
          </a>
          <button
            onClick={exportPDF}
            disabled={!data || exporting}
            style={{
              ...styles.actionBtn,
              opacity: !data || exporting ? 0.7 : 1,
              cursor: !data || exporting ? "not-allowed" : "pointer",
            }}
          >
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {data?.note && <div style={styles.infoText}>{data.note}</div>}

      {errMsg && <div style={styles.error}>{errMsg}</div>}

      {data && (
        <>
          <div style={styles.grid4}>
            <div style={styles.card}>
              <div>Total Incidents</div>
              <div style={styles.metric}>{data.summaryCards?.total ?? 0}</div>
            </div>
            <div style={styles.card}>
              <div>Pending Review</div>
              <div style={styles.metric}>{data.summaryCards?.pending_review ?? 0}</div>
            </div>
            <div style={styles.card}>
              <div>In Progress</div>
              <div style={styles.metric}>{data.summaryCards?.in_progress ?? 0}</div>
            </div>
            <div style={styles.card}>
              <div>Resolved</div>
              <div style={styles.metric}>{data.summaryCards?.resolved ?? 0}</div>
            </div>
          </div>

          <div style={styles.sectionGrid}>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Status Overview</h3>
              <div style={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Severity Distribution</h3>
              <div style={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {severityPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={styles.sectionGrid}>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Incidents by Type</h3>
              <div style={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Incident Trend (Last 7 Days)</h3>
              <div style={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={styles.sectionGrid}>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Responder Workload Chart</h3>
              <div style={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responderChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Assigned" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Top Affected Areas</h3>
              {(data.topAreas || []).map((item) => (
                <div key={item.label} style={styles.row}>
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.sectionGrid}>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Responder Workload Table</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Responder</th>
                    <th style={styles.th}>Assigned</th>
                    <th style={styles.th}>In Progress</th>
                    <th style={styles.th}>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.responderWorkload || []).slice(0, 8).map((r) => (
                    <tr key={r.responderId}>
                      <td style={styles.td}>{responderNameMap[r.responderId] || r.responderId}</td>
                      <td style={styles.td}>{r.assignedCount}</td>
                      <td style={styles.td}>{r.inProgressCount}</td>
                      <td style={styles.td}>{r.resolvedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Severity Breakdown Table</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Severity</th>
                    <th style={styles.th}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.severityCounts || {}).map(([label, count]) => (
                    <tr key={label}>
                      <td style={styles.td}>{label}</td>
                      <td style={styles.td}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Recent High Severity Incidents</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentCritical || []).map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.type}</td>
                    <td style={styles.td}>{item.severity}</td>
                    <td style={styles.td}>{item.status}</td>
                    <td style={styles.td}>{item.fullAddress}</td>
                    <td style={styles.td}>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}