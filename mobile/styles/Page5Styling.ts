import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backButton: {
    padding: 8,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
    paddingBottom: 40,
  },

  // Heading Container
  headingContainer: {
    marginBottom: 20, 
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headingMain: {
    fontSize: 26,
    fontWeight: "700",
    color: "#613829", 
    textAlign: "center",
    lineHeight: 34,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
    opacity: 1.0,
    textShadowColor: 'rgba(97, 56, 41, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  headingAccent: {
    color: "#FF6B35",
    fontWeight: "800",
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
    marginVertical: 10, 
    paddingHorizontal: 10,
  },

  illustration: {
    width: width * 0.95, 
    height: width * 0.95 * 0.65, 
    maxWidth: 380, 
    maxHeight: 250, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  progressContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressDot: {
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B35",
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  getStartedBtn: {
    width: '100%',
    height: 56,
    backgroundColor: "#FF6B35", 
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },

  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },

  buttonIcon: {
    marginLeft: 8,
  },

  exploreBtn: {
    width: '100%',
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6138294D", 
  },

  exploreBtnText: {
    color: "#2c1811ff", 
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.9,
  },

  // Bottom Bar 
  bottomBar: {
    width: 140,
    height: 8,
    backgroundColor: "#613829", 
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 10,
    opacity: 1.0,
    shadowColor: '#613829',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});