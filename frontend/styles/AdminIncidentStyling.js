export const AdminIncidentStyles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0A0B0E",
    padding: "32px 24px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Header Styles
  header: {
    marginBottom: "32px",
    position: "relative",
  },
  titleContainer: {
    textAlign: "center",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    letterSpacing: "-1.5px",
    color: "#FFFFFF",
    textShadow: "0 0 10px rgba(255, 107, 53, 0.4)",
    marginBottom: "8px",
  },
  titleAccent: {
    color: "#FF6B35",
  },
  subtitle: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "300",
    letterSpacing: "0.5px",
  },

  // Tabs Container
  tabsContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  // Tab Buttons
  tabButton: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  tabButtonActive: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    borderColor: "#FF6B35",
    boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
  },
  tabBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#FF6B35",
  },

  // Refresh Button
  refreshButton: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid #FF6B35",
    backgroundColor: "#FF6B35",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "auto",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },
  refreshIcon: {
    fontSize: "18px",
  },

  // Stats Container
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },

  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255, 107, 53, 0.3)",
    borderTopColor: "#FF6B35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "16px",
  },

  // Error Container
  errorContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    border: "1px solid #FF3B30",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  errorIcon: {
    fontSize: "20px",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: "14px",
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    textAlign: "center",
    padding: "60px 0",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.5",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.5)",
  },

  // Table Container
  tableContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  tableHeader: {
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FF6B35",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(255, 107, 53, 0.3)",
  },
  tableRow: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "background-color 0.2s ease",
    animation: "slideIn 0.3s ease forwards",
  },
  tableCell: {
    padding: "16px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  // Incident Type
  incidentType: {
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Description Cell
  descriptionCell: {
    maxWidth: "250px",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.5",
  },
  truncated: {
    color: "#FF6B35",
  },

  // Severity Badge
  severityBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    textTransform: "capitalize",
  },

  // Address Cell
  addressCell: {
    maxWidth: "200px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Image Link
  imageLink: {
    color: "#FF6B35",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  imageIcon: {
    fontSize: "16px",
  },
  noImage: {
    color: "rgba(255, 255, 255, 0.3)",
  },

  // Action Buttons
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  verifyButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  rejectButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FF3B30",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  // Status Badge
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    textTransform: "capitalize",
  },

  // Assign Container
  assignContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  selectInput: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 107, 53, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
    fontSize: "13px",
    minWidth: "140px",
    outline: "none",
    cursor: "pointer",
  },
  assignButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FF6B35",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  // Responder Cell
  responderCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "rgba(255, 255, 255, 0.9)",
  },
  responderIcon: {
    fontSize: "14px",
  },

  // Progress Badge
  progressBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    textTransform: "capitalize",
  },

  // Date Cell
  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
  },
  dateIcon: {
    fontSize: "12px",
  },

  // Global animations (to be added in your global CSS)
  // @keyframes spin {
  //   0% { transform: rotate(0deg); }
  //   100% { transform: rotate(360deg); }
  // }
  // @keyframes slideIn {
  //   from {
  //     opacity: 0;
  //     transform: translateY(20px);
  //   }
  //   to {
  //     opacity: 1;
  //     transform: translateY(0);
  //   }
  // }
};