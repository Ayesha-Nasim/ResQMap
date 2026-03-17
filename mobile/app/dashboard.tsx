import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { View, Text } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }

    if (user.role === "citizen") {
      router.replace("/dashboard-citizen");
    } else if (user.role === "responder") {
      router.replace("/dashboard-responder");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user]);

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      <Text>Loading dashboard...</Text>
    </View>
  );
}
