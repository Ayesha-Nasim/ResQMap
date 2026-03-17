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
import { styles } from "../styles/Page5Styling";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

export default function Page5() {
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
        colors={["#FFFFFF", "#FFF8F0"]} 
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
            
            {/* Final page - no skip button, just spacing */}
            <View style={{ width: 60 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Main Heading with dark brown color and orange accent */}
            <View style={styles.headingContainer}>
              <Text style={styles.headingMain}>
                Every helper, every voice,{"\n"}
                <Text style={styles.headingAccent}>every report — it all matters.</Text>
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/page5-illustration.png")}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>

            {/* Progress Bar - ALL THREE active (Final page) */}
           {/* Progress Bar - ALL THREE active (Final page) */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
              {/* FINAL BUTTON → LOGIN */}
              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.getStartedText}>Join ResQMap</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* Optional: Explore Features */}
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.exploreBtnText}>Explore Features First</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}