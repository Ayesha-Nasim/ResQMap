import React, { useEffect, useRef } from "react";
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Animated
} from "react-native";
import { router } from "expo-router";
import { styles } from "../styles/LandingStyling";
import { 
  useFonts, 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Top waves background */}
      <View style={styles.wavesContainer}>
        <Image
          source={require("../assets/images/top-waves.png")}
          style={styles.topImage}
          resizeMode="cover"
        />
      </View>

      {/* White background for bottom section */}
      <View style={styles.whiteSection} />

      {/* Logo in center with animation */}
      <Animated.View 
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        <Image
          source={require("../assets/images/resqmap-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Arrow Button */}
      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => router.push("/Page2")}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-forward" size={24} color="#FF6B35" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}