import Constants from "expo-constants";

export function getLocalIP(): string {
  // New Expo structure
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    console.log("⚠️ Could not detect Expo host, using localhost");
    return "localhost";
  }

  // Example: 192.168.132.48:8081
  const ip = hostUri.split(":")[0];

  console.log("📡 Detected Expo IP:", ip);
  return ip;
}