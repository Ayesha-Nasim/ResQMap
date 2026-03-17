import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();
const NATIVE_REDIRECT_URI = "https://auth.expo.dev/@ayena/mobile";
const WEB_REDIRECT_URI = "http://localhost:8081/redirect";

export function useGoogleAuth() {
  const redirectUri =
    Platform.OS === "web" ? WEB_REDIRECT_URI : NATIVE_REDIRECT_URI;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "1063358640985-8l0c1luv17umno22ehhapts0mhj1thor.apps.googleusercontent.com",
    redirectUri,               
    scopes: ["openid", "profile", "email"],
  });

  const loginWithGoogle = async () => {
    const res = await promptAsync(); 

    if (res?.type === "success") {
      return res.authentication?.idToken ?? null;
    }

    return null;
  };

  return { loginWithGoogle, response, request };
}
