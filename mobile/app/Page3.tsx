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
import { router } from "expo-router";
import { styles } from "../styles/Page3Styling";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

export default function Page3() {
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
      <LinearGradient
        colors={["#FFFFFF", "#F0F8FF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FF6B35" />
            </TouchableOpacity>
            
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
                Every second counts,{"\n"}
                <Text style={styles.headingAccent}>your report could save lives.</Text>
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/page3-illustration.png")}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>

            {/* Progress Bar - Only first dot colored */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.activeProgressDot]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* NEXT PAGE → Page4 */}
              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={() => router.push("/Page4")}
              >
                <Text style={styles.getStartedText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* SKIP → LOGIN */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.skipBtnText}>Explore Features</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}