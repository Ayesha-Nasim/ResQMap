import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SubmitStyles = StyleSheet.create({
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
  scrollContainer: {
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

  // Form Container
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

  // Picker Wrapper
  pickerWrapper: {
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pickerWrapperDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pickerWrapperLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  picker: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  pickerDark: {
    color: '#FFFFFF',
  },
  pickerLight: {
    color: '#1A202C',
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

  // Text Area
  textArea: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textAreaDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFFFFF',
  },
  textAreaLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
    color: '#1A202C',
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#FF3B30',
  },

  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dropdownButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dropdownButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  dropdownButtonTextDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownButtonTextLight: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  dropdownButtonTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },

  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '80%',
    maxHeight: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownContainerDark: {
    backgroundColor: '#1A202C',
  },
  dropdownContainerLight: {
    backgroundColor: '#FFFFFF',
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  dropdownItemDark: {
    backgroundColor: '#1A202C',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownItemSelectedDark: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  dropdownItemSelectedLight: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },

  dropdownItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dropdownItemIconDark: {
    color: '#FFFFFF',
  },
  dropdownItemIconLight: {
    color: '#1A202C',
  },

  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  dropdownItemTextDark: {
    color: '#FFFFFF',
  },
  dropdownItemTextLight: {
    color: '#1A202C',
  },
  dropdownItemTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },

  // Image Button
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 18,
    borderStyle: 'dashed',
  },
  imageButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  imageButtonTextDark: {
    color: '#FFFFFF',
  },
  imageButtonTextLight: {
    color: '#1A202C',
  },
  imageButtonIcon: {
    marginRight: 8,
  },

  // Image Preview
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
  },

  // Location Styles
  locationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  locationInfoContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationInfoContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  coordinatesText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  coordinatesTextDark: {
    color: '#FFFFFF',
  },
  coordinatesTextLight: {
    color: '#1A202C',
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  addressTextDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  addressTextLight: {
    color: '#666',
  },

  // Location Loading Container with Dark/Light variants
  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  locationLoadingContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationLoadingContainerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  locationLoadingText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
  },
  locationLoadingTextDark: {
    color: '#FFFFFF',
  },
  locationLoadingTextLight: {
    color: '#1A202C',
  },

  // Get Location Button
  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  getLocationButtonDark: {
    backgroundColor: '#FF6B35',
  },
  getLocationButtonLight: {
    backgroundColor: '#FF6B35',
  },
  getLocationIcon: {
    marginRight: 10,
  },
  getLocationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },

  // Info Text
  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
    padding: 20,
    textAlign: 'center',
    borderRadius: 16,
  },
  infoTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoTextLight: {
    color: '#666',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },

  // Loading Card
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  loadingCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  loadingCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
  },
  loadingTextDark: {
    color: '#FFFFFF',
  },
  loadingTextLight: {
    color: '#1A202C',
  },

  // Map Styles
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 200,
  },
  mapInstructions: {
    padding: 12,
    alignItems: 'center',
  },
  mapInstructionsText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  mapInstructionsTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  mapInstructionsTextLight: {
    color: '#666',
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  mapPlaceholderDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapPlaceholderLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  mapPlaceholderText: {
    fontSize: 14,
    marginTop: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  mapPlaceholderTextDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  mapPlaceholderTextLight: {
    color: '#666',
  },

  // Map Card
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  mapHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    fontFamily: 'Inter_500Medium',
    paddingHorizontal: 10,
  },
  mapHintDark: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  mapHintLight: {
    color: '#666',
  },
  nudgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nudgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    minWidth: 120,
  },
  nudgeButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nudgeButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  nudgeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
  nudgeButtonTextDark: {
    color: '#FFFFFF',
  },
  nudgeButtonTextLight: {
    color: '#1A202C',
  },

  // Submit Button
  submitButton: {
    marginTop: 20,
    borderRadius: 16,
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
  submitButtonInner: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#FF6B35',
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: 'Inter_700Bold',
    marginLeft: 12,
  },
  submitIcon: {
    marginRight: 8,
  },

  // Primary Button
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

  // Footer
  footer: {
    marginTop: 20,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
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
    color: '#666',
  },

  // Disclaimer
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    fontFamily: 'Inter_400Regular',
  },
  disclaimerDark: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  disclaimerLight: {
    color: '#666',
  },
});