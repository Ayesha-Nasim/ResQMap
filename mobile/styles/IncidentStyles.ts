import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const IncidentStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Background Images
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImageLight: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
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

  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.12,
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: 3,
    fontFamily: 'Inter_300Light',
  },
  welcomeTextDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeTextLight: {
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
    fontSize: 48,
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

  // Incidents Section
  incidentsSection: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 30,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    elevation: 15,
  },
  incidentsSectionDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  incidentsSectionLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    borderWidth: 1.5,
  },

  // Stats Overview
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsContainerLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#FF6B35',
  },
  statValueLight: {
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  statLabelDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statLabelLight: {
    color: '#666',
  },

  // Incidents List
  incidentsList: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionTitleLight: {
    color: '#1A202C',
  },

  // Incident Card
  incidentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  incidentCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
  },
  incidentCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.15)',
    shadowColor: '#FF6B35',
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typeIconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeIconContainerLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  typeIcon: {
    marginRight: 8,
  },
  typeText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  typeTextDark: {
    color: '#FFFFFF',
  },
  typeTextLight: {
    color: '#1A202C',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  severityHigh: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderColor: 'rgba(255, 107, 53, 0.4)',
  },
  severityMedium: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderColor: 'rgba(255, 193, 7, 0.4)',
  },
  severityLow: {
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    borderColor: 'rgba(40, 167, 69, 0.4)',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  severityTextHigh: {
    color: '#FF6B35',
  },
  severityTextMedium: {
    color: '#FFC107',
  },
  severityTextLow: {
    color: '#28A745',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  descriptionDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  descriptionLight: {
    color: '#444',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailIconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  detailIconContainerLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.15)',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  detailTextDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailTextLight: {
    color: '#666',
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  addressTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  addressTextLight: {
    color: '#777',
  },

  // Emergency Glow Effect
  emergencyGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    zIndex: -1,
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
  },
  emptyIconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyIconContainerLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyTitleDark: {
    color: '#FFFFFF',
  },
  emptyTitleLight: {
    color: '#1A202C',
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySubtitleDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptySubtitleLight: {
    color: '#666',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  emptyDescriptionDark: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyDescriptionLight: {
    color: '#777',
  },

  // Loading
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});