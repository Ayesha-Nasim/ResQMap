import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ProfileStyles = StyleSheet.create({
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
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 50,
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

  // Profile Section
  profileSection: {
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
  profileSectionDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  profileSectionLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    borderWidth: 1.5,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarPlaceholderDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarPlaceholderLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileNameDark: {
    color: '#FFFFFF',
  },
  profileNameLight: {
    color: '#1A202C',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  profileEmailDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  profileEmailLight: {
    color: '#666',
  },

  // Display Field Styles
  displayField: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  displayFieldDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  displayFieldLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  displayText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  displayTextDark: {
    color: '#FFFFFF',
  },
  displayTextLight: {
    color: '#1A202C',
  },

  // Form Container
  formContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
  },
  formTitleDark: {
    color: '#FFFFFF',
  },
  formTitleLight: {
    color: '#1A202C',
  },
  inputContainer: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 1.5,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  inputLabelDark: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputLabelLight: {
    color: '#FF6B35',
  },

  // Input Wrapper
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  inputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFFFFF',
  },
  inputLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
    color: '#1A202C',
  },
  inputFocusedDark: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  inputFocusedLight: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  inputDisabled: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  inputDisabledDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  inputDisabledLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: 'rgba(0, 0, 0, 0.5)',
  },

  // Action Buttons
  actionButtonsContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.5)',
    overflow: 'hidden',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: 'Inter_700Bold',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryButtonDark: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonLight: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButtonTextDark: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryButtonTextLight: {
    color: '#FF6B35',
  },

  // Loading
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});