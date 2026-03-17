import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const MapStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a202c',
  },

  // Menu styles
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    zIndex: 1001,
  },
  menuBlurView: {
    flex: 1,
  },
  menuGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  menuTitleDark: {
    color: '#fff',
  },
  menuCloseButton: {
    padding: 8,
  },
  menuCloseIcon: {
    fontSize: 20,
    color: '#4a5568',
  },
  menuCloseIconDark: {
    color: '#cbd5e0',
  },
  menuItems: {
    padding: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  menuItemLogout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIconActive: {
    backgroundColor: '#FF6B35',
  },
  menuIconLogout: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuIcon: {
    fontSize: 16,
    color: '#4a5568',
  },
  menuIconDark: {
    color: '#cbd5e0',
  },
  menuIconLogoutText: {
    fontSize: 16,
    color: '#ef4444',
  },
  menuItemText: {
    fontSize: 15,
    color: '#4a5568',
    fontWeight: '500',
  },
  menuItemTextDark: {
    color: '#cbd5e0',
  },
  menuItemTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  menuItemTextLogout: {
    color: '#ef4444',
    fontWeight: '600',
  },
  menuFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuFooterText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  menuFooterTextDark: {
    color: '#a0aec0',
  },

  // Top Navigation Bar - Compact like dashboard
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 10,
  },
  topNavBarDark: {
    backgroundColor: '#1a202c',
    borderBottomColor: '#2d3748',
  },
  topNavBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  topNavBarLeft: {
    flex: 1,
  },
  topNavBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  pageTitleDark: {
    color: '#fff',
  },
  
  // Page Subtitle
  pageSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  pageSubtitleDark: {
    color: '#a0aec0',
  },

  // Dark mode toggle - Compact
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  darkModeToggleActive: {
    backgroundColor: '#2d3748',
    borderColor: '#4a5568',
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  toggleKnobActive: {
    backgroundColor: '#4a5568',
  },
  toggleIcon: {
    fontSize: 11,
  },
  toggleText: {
    fontSize: 11,
    color: '#4a5568',
    fontWeight: '500',
  },
  toggleTextDark: {
    color: '#cbd5e0',
  },

  // Menu button - Compact
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuLine: {
    height: 2,
    backgroundColor: '#4a5568',
    borderRadius: 1,
  },
  menuLineDark: {
    backgroundColor: '#cbd5e0',
  },

  // Feature Controls
  featureControls: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureControlsDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
  },
  featureButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  featureButtonActive: {
    backgroundColor: '#3b82f6',
  },
  featureButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  featureButtonTextActive: {
    color: 'white',
  },

  // Weather Controls - Compact
  weatherControls: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherControlsDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
  },
  controlBtnText: { 
    fontWeight: "600",
    fontSize: 11,
  },

  // 🟢 Feature 6: Nearby Alert Styles
  alertBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  alertText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  alertClose: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 12,
  },

  // Callout styles - Enhanced
  calloutContainer: {
    width: 220,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  calloutContainerDark: {
    backgroundColor: '#2d3748',
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 8,
    borderLeftWidth: 4,
  },
  calloutTitle: {
    fontWeight: "700",
    color: '#1a202c',
    fontSize: 14,
    flex: 1,
  },
  calloutTitleDark: {
    color: '#fff',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  calloutAddress: {
    marginTop: 4,
    color: '#4a5568',
    fontSize: 12,
  },
  calloutAddressDark: {
    color: '#cbd5e0',
  },
  calloutDescription: {
    marginTop: 4,
    color: '#4a5568',
    fontSize: 12,
  },
  calloutDescriptionDark: {
    color: '#cbd5e0',
  },
  calloutTap: {
    marginTop: 6,
    color: "#2563eb",
    fontSize: 11,
    fontWeight: '600',
  },
  calloutTapDark: {
    color: '#63b3ed',
  },

  // Legend panel - Enhanced
  legend: {
    position: "absolute",
    right: 10,
    top: Platform.OS === "android" ? 260 : 280,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: 180,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendDark: {
    backgroundColor: "rgba(31, 41, 55, 0.95)",
    borderColor: "#4a5568",
  },
  legendTitle: { 
    fontWeight: "800", 
    marginBottom: 8,
    color: '#1a202c',
    fontSize: 15,
  },
  legendTitleDark: {
    color: '#fff',
  },
  legendSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  legendTextSmall: { 
    fontSize: 11, 
    color: "#4a5568",
    marginBottom: 2,
  },
  legendTextSmallDark: {
    color: '#cbd5e0',
  },
  smallBtn: {
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    backgroundColor: "white",
    color: '#1a202c',
    fontSize: 10,
  },
  smallBtnDark: {
    backgroundColor: "#4a5568",
    borderColor: "#718096",
    color: '#cbd5e0',
  },

  // Active Layer Legend
  activeLayerLegend: {
    position: "absolute",
    right: 10,
    top: Platform.OS === "android" ? 130 : 150,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: 200,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeLayerLegendDark: {
    backgroundColor: "rgba(31, 41, 55, 0.95)",
    borderColor: "#4a5568",
  },
  activeLayerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  activeLayerTitleDark: {
    color: '#fff',
  },
  activeLayerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  activeLayerSubtitleDark: {
    color: '#a0aec0',
  },
  legendItems: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 11,
    color: '#4a5568',
  },
  legendLabelDark: {
    color: '#cbd5e0',
  },

  // Weather Settings Modal
  weatherSettingsModal: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    width: 200,
    zIndex: 1002,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherSettingsModalDark: {
    backgroundColor: 'rgba(45, 55, 72, 0.95)',
  },
  weatherSettingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 12,
  },
  weatherSettingsTitleDark: {
    color: '#fff',
  },
  weatherSettingsLabel: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 8,
  },
  weatherSettingsLabelDark: {
    color: '#cbd5e0',
  },
  weatherSettingsButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  weatherSettingsButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  weatherSettingsButtonDark: {
    backgroundColor: '#4a5568',
  },
  weatherSettingsButtonActive: {
    backgroundColor: '#4299e1',
  },
  weatherSettingsButtonText: {
    fontSize: 11,
    color: '#4a5568',
    fontWeight: '500',
  },
  weatherSettingsButtonTextDark: {
    color: '#cbd5e0',
  },
  weatherSettingsButtonTextActive: {
    color: '#fff',
  },
  weatherSettingsSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherSettingsTrack: {
    width: 100,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  weatherSettingsTrackDark: {
    backgroundColor: '#4a5568',
  },
  weatherSettingsProgress: {
    height: '100%',
    backgroundColor: '#4299e1',
    borderRadius: 2,
  },
  weatherSettingsIcon: {
    fontSize: 20,
    color: '#4a5568',
  },
  weatherSettingsIconDark: {
    color: '#cbd5e0',
  },
  weatherSettingsDone: {
    alignSelf: 'flex-end',
  },
  weatherSettingsDoneText: {
    color: '#4299e1',
    fontWeight: '600',
  },

  // ✅ contrast tint overlay
  contrastTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },

  // 🥇 Feature 1: Incident Focus Styles
  selectedInfoBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  selectedText: {
    fontSize: 14,
    color: '#4a5568',
  },

  // 🥇 Feature 1: Detail Sheet Styles
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  sheetHandleDark: {
    backgroundColor: '#4b5563',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  severityPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityPillText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sheetCloseButton: {
    padding: 8,
  },
  sheetCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetImageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    position: 'relative',
  },
  sheetImage: {
    width: '100%',
    height: '100%',
  },
  sheetImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  sheetImageOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  sheetImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sheetNoImage: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  sheetNoImageText: {
    fontSize: 14,
  },
  sheetGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  sheetCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  sheetCardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sheetCardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sheetCardSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  sheetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  sheetButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  sheetStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  weatherItem: {
    flex: 1,
    minWidth: 80,
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sheetActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
  },
  sheetActionButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Toast
  toastWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: Platform.OS === "android" ? 230 : 250,
    alignItems: "center",
    zIndex: 60,
  },
  toast: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "85%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: { 
    color: "white", 
    fontWeight: "600",
    fontSize: 13,
  },

  // Loading overlay
  loadingWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    alignItems: "center",
    zIndex: 60,
  },
  loadingCard: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingCardDark: {
    backgroundColor: "#2d3748",
  },

  // Bottom Navigation
  navBarBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  navBarDark: {
    backgroundColor: 'rgba(26, 32, 44, 0.95)',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  navIconGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
  },
  navIconInactive: {
    color: '#718096',
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
  },
  navTextInactive: {
    color: '#718096',
  },
  navTextActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },

  // Error and Warning messages
  errorContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7d7',
    zIndex: 100,
  },
  errorContainerDark: {
    backgroundColor: '#2d3748',
    borderColor: '#4a5568',
  },
  errorText: {
    color: 'crimson',
    fontSize: 12,
  },
  warningContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#feebc8',
    zIndex: 100,
  },
  warningContainerDark: {
    backgroundColor: '#2d3748',
    borderColor: '#4a5568',
  },
  warningText: {
    color: '#7a5d00',
    fontSize: 12,
  },
  warningTextDark: {
    color: '#d69e2e',
  },

  // Map container
  mapContainer: {
    flex: 1,
  },

  // 🥇 Feature 1: Dim Overlay (for incident focus)
  dimOverlay: {
    flex: 1,
    backgroundColor: 'black',
  },

  // 🟡 Feature 4: Selected boundary highlight
  selectedBoundary: {
    borderWidth: 3,
    borderColor: '#ff0000',
  },

  // Boundary Panel Styles
boundaryPanel: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 320,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 10,
  zIndex: 1000,
},
boundaryPanelHeader: {
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 16,
},
boundaryPanelHeaderContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
boundaryPanelTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
},
boundaryPanelSubtitle: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.9)',
  marginTop: 2,
},
boundaryPanelClose: {
  padding: 8,
},
boundaryPanelCloseText: {
  fontSize: 20,
  color: '#fff',
  fontWeight: 'bold',
},
boundaryPanelContent: {
  flex: 1,
  paddingHorizontal: 16,
},
boundaryPanelCard: {
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
},
boundaryPanelCardTitle: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 8,
},
boundaryPanelCardText: {
  fontSize: 13,
  lineHeight: 20,
},
boundaryPanelGrid: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 12,
},
boundaryPanelStatCard: {
  flex: 1,
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
},
boundaryPanelStatValue: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 4,
},
boundaryPanelStatLabel: {
  fontSize: 12,
},
boundaryPanelRiskBadge: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  marginBottom: 8,
},
boundaryPanelRiskText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '600',
},
boundaryPanelContactItem: {
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(0, 0, 0, 0.1)',
},
boundaryPanelContactText: {
  fontSize: 13,
},
boundaryPanelFacilities: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
},
boundaryPanelFacilityTag: {
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(59, 130, 246, 0.3)',
},
boundaryPanelFacilityText: {
  fontSize: 12,
  color: '#3b82f6',
  fontWeight: '500',
},
boundaryPanelLegend: {
  marginTop: 8,
  gap: 8,
},
boundaryPanelLegendItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
boundaryPanelLegendColor: {
  width: 16,
  height: 16,
  borderRadius: 8,
},
boundaryPanelLegendText: {
  fontSize: 12,
},

});