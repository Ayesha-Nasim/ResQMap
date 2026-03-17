import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ViewStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Background Overlay
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundOverlayDark: {
    backgroundColor: 'rgba(10, 11, 14, 0.85)',
  },
  backgroundOverlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  // Theme Toggle
  themeToggleContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 1000,
  },
  themeToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  themeToggleDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeToggleLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.12,
    paddingBottom: 40,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: 3,
    fontFamily: 'Inter_300Light',
  },
  titleTextDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  titleTextLight: {
    color: '#FF6B35',
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1.5,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleDark: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 107, 53, 0.4)',
  },
  titleLight: {
    color: '#1A202C',
    textShadowColor: 'rgba(255, 107, 53, 0.4)',
  },
  titleAccent: {
    color: '#FF6B35',
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.8,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  subtitleDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  subtitleLight: {
    color: '#FF6B35',
    fontWeight: '500',
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionRowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    gap: 8,
  },
  actionRowButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionRowButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  actionRowButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },

  // Error Container
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Incidents List
  incidentsList: {
    marginBottom: 20,
  },

  // Loading Container
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  emptyIconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  emptyIconContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: 'Inter_400Regular',
  },

  // Incident Card
  incidentCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  incidentCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
  },
  incidentCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
  },
  incidentCardExpanded: {
    marginBottom: 20,
  },

  // Incident Card Header
  incidentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incidentCardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  incidentCardHeaderText: {
    flex: 1,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  incidentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentAddress: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
    fontFamily: 'Inter_400Regular',
  },
  incidentCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },

  // Incident Details
  incidentDetails: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  detailStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  mapButton: {
    backgroundColor: '#FF6B35',
  },
  imageButton: {
    backgroundColor: '#4A5568',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },

  // Status Update
  statusUpdateContainer: {
    marginTop: 8,
  },
  statusUpdateLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  inProgressButton: {
    backgroundColor: '#FF6B35',
  },
  resolvedButton: {
    backgroundColor: '#4CAF50',
  },
  statusButtonDisabled: {
    backgroundColor: 'rgba(102, 102, 102, 0.5)',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },

  // Text Colors
  textDark: {
    color: '#FFFFFF',
  },
  textLight: {
    color: '#1A202C',
  },
  textSecondaryDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  textSecondaryLight: {
    color: '#666666',
  },

  // Footer
  footer: {
    marginTop: 20,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  footerInfoDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerInfoLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  infoIcon: {
    marginRight: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  footerTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerTextLight: {
    color: '#666666',
  },

  // Animation
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
});