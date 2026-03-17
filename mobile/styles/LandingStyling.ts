import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const isWeb = Platform.OS === "web";
const maxWidth = isWeb ? 428 : width; 
const containerWidth = isWeb ? Math.min(width, maxWidth) : width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    ...(isWeb && {
      maxWidth: maxWidth,
      marginHorizontal: "auto",
      width: "100%",
    }),
  },

  wavesContainer: {
    width: "100%",
    height: "45%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "visible",
  },

  topImage: {
    width: "100%",
    height: "130%",
    position: "absolute",
    top: "-30%",
  },

  whiteSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "#FFFFFF",
  },

  logoWrapper: {
    position: "absolute",
    top: "45%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  // Logo styling
  logo: {
    width: 360,
    height: 360,
  },

  arrowContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FF6B35",
    zIndex: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});