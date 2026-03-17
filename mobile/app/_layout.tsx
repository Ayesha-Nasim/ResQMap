import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../src/context/AuthContext";
import { initApi } from "../src/services/api";

export default function RootLayout() {
  useEffect(() => {
    initApi();
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

  
