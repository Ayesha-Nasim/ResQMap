import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const RegisterStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Background Image
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

  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.10,
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
    marginBottom: 8,
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
    marginBottom: 4,
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
  // New Sign Up Title Styles
  signUpTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
    marginBottom: 8,
  },
  signUpTitleDark: {
    color: '#FFFFFF',
  },
  signUpTitleLight: {
    color: '#FF6B35',
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

  // Form Styles
  formContainer: {
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
  formContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  formContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    borderWidth: 1.5,
  },

  // Input Container
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

  // Error Text Styles
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
  },
  errorTextDark: {
    color: '#FF6B35',
  },
  errorTextLight: {
    color: '#FF6B35',
  },

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
    paddingRight: 70,
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
  
  // Input Error States
  inputErrorDark: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  inputErrorLight: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },

  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 14,
    zIndex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  passwordToggleDark: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderColor: 'rgba(255, 107, 53, 0.4)',
  },
  passwordToggleLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  passwordToggleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'Inter_700Bold',
  },
  passwordToggleTextDark: {
    color: '#FF6B35',
  },
  passwordToggleTextLight: {
    color: '#FF6B35',
  },

  // Role Selection Styles
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    marginHorizontal: 6,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  roleButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  roleSelectedDark: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  roleSelectedLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  roleTextDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roleTextLight: {
    color: '#1A202C',
  },
  roleTextSelected: {
    color: '#FF6B35',
    fontWeight: '700',
  },

  primaryButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
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
  
  // Disabled button state
  primaryButtonDisabled: {
    opacity: 0.7,
  },

  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  footerTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerTextLight: {
    color: '#1A202C',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  linkDark: {
    color: '#FF6B35',
  },
  linkLight: {
    color: '#FF6B35',
  },

  floatingParticles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particleDark: {
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
  },
  particleLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
});