import React from "react"; 
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/Page2Styling";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

export default function Page2() {
  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Three-color gradient: top-left → center → bottom-right */}
      <LinearGradient
        colors={["#FFFFFF", "#FFE4D6", "#FFB085"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}   
        locations={[0, 0.5, 1]} 
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with Skip Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Main Heading with dark brown color and orange accent */}
            <View style={styles.headingContainer}>
              <Text style={styles.headingMain}>
                Together, we build{"\n"}
                <Text style={styles.headingAccent}>safer cities, one report at a time.</Text>
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/page2-illustration.png")}
                style={styles.centerImage}
                resizeMode="contain"
              />
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* NEXT PAGE → Page3 */}
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => router.push("/Page3")}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* SKIP → LOGIN */}
              <TouchableOpacity
                style={styles.discoverButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.discoverBtnText}>Discover ResQMap</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}