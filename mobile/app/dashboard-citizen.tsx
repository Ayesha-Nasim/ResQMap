import { View, Text, TouchableOpacity, ScrollView, Animated, TextInput, Image, Modal, Alert } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { CitizenStyles } from "../styles/CitizenStyling";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [featureModalVisible, setFeatureModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  // Add scroll view ref for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Feature data
  const featuresData = [
    {
      id: 0,
      title: "Real-time Reporting",
      description: "Report incidents instantly with photos, location, and detailed descriptions. Our system processes reports within seconds.",
      longDescription: "Our real-time reporting system allows you to instantly report incidents with photos, precise location data, and detailed descriptions. The system processes reports within seconds and forwards them to the appropriate authorities. Key features include:\n\n• Instant photo upload with compression\n• Automatic location detection\n• Priority level selection\n• Anonymous reporting option\n• Real-time status updates",
      icon: "⚡",
      stats: "Average response time: 15 minutes"
    },
    {
      id: 1,
      title: "Live Safety Map",
      description: "Interactive map showing real-time incidents, safety zones, and community alerts in your neighborhood.",
      longDescription: "The Live Safety Map provides a comprehensive view of safety in your area. See real-time incidents, safe zones, police patrols, and community alerts all in one interactive interface.\n\n• Real-time incident heatmaps\n• Safe route suggestions\n• Police station locations\n• Emergency service coverage\n• Historical incident data\n• Community safety ratings",
      icon: "🗺️",
      stats: "Updated every 5 minutes"
    },
    {
      id: 2,
      title: "Community Network",
      description: "Connect with neighbors, local authorities, and safety volunteers to collaborate on community initiatives.",
      longDescription: "Build a safer community by connecting with neighbors, local authorities, and safety volunteers. Collaborate on neighborhood watch programs, safety initiatives, and emergency response planning.\n\n• Private neighborhood groups\n• Direct messaging with authorities\n• Volunteer coordination\n• Event planning tools\n• Resource sharing\n• Emergency contact networks",
      icon: "👥",
      stats: "10,000+ active community members"
    }
  ];

  // Scroll animation for header
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Enhanced animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const heroTextAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const featureModalAnim = useRef(new Animated.Value(0)).current;

  // Header animation based on scroll
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -140],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    // Enhanced animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(heroTextAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSubmitIncident = () => {
    console.log("Navigating to submit-incident");
    router.navigate("/submit-incident");
  };

  const handleNavigateToProfile = () => {
    console.log("Navigating to profile");
    router.navigate("/profile");
  };

  const handleNavigateToReports = () => {
    console.log("Navigating to reports");
    router.navigate("/submit-incident");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const menuTranslateX = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const menuOpacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleMenuOption = (option: string) => {
    toggleMenu();
    switch(option) {
      case 'homepage':
        Alert.alert("Info", "You are already on the homepage");
        break;
      case 'map':
        router.navigate("/live-map");
        break;
      case 'reports':
        router.navigate("/submit-incident");
        break;
      case 'settings':
        Alert.alert(
          "Coming Soon",
          "Settings feature is coming soon! Stay tuned.",
          [{ text: "OK" }]
        );
        break;
      case 'profile':
        router.navigate("/profile");
        break;
      case 'logout':
        logout();
          router.replace("/login");
        break;
    }
  };

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const heroSlideInterpolate = heroTextAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const handleFeaturePress = (featureId: number) => {
    setSelectedFeature(featureId);
    setFeatureModalVisible(true);
    Animated.timing(featureModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFeatureModal = () => {
    Animated.timing(featureModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setFeatureModalVisible(false);
      setSelectedFeature(null);
    });
  };

  const featureModalTranslateY = featureModalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const featureModalOpacity = featureModalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Function to scroll to features section
  const scrollToFeatures = () => {
    scrollViewRef.current?.scrollTo({
      y: 1300, // Adjust this value based on your layout
      animated: true
    });
  };

  return (
    <View style={[CitizenStyles.container, isDarkMode && CitizenStyles.containerDark]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Feature Detail Modal */}
      <Modal
        visible={featureModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeFeatureModal}
      >
        <TouchableOpacity 
          style={CitizenStyles.featureModalBackdrop}
          activeOpacity={1}
          onPress={closeFeatureModal}
        >
          <Animated.View 
            style={[
              CitizenStyles.featureModalContainer,
              {
                opacity: featureModalOpacity,
                transform: [{ translateY: featureModalTranslateY }]
              }
            ]}
          >
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{ flex: 1 }}
            >
              <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={CitizenStyles.featureModalBlurView}>
                <LinearGradient
                  colors={isDarkMode 
                    ? ['rgba(26, 32, 44, 0.98)', 'rgba(45, 55, 72, 0.95)']
                    : ['rgba(255, 255, 255, 0.98)', 'rgba(250, 251, 252, 0.95)']
                  }
                  style={CitizenStyles.featureModalGradient}
                />
                
                <View style={CitizenStyles.featureModalHeader}>
                  <View style={CitizenStyles.featureModalTitleContainer}>
                    <View style={[CitizenStyles.featureModalIconContainer, isDarkMode && CitizenStyles.featureModalIconContainerDark]}>
                      <Text style={CitizenStyles.featureModalIcon}>
                        {selectedFeature !== null ? featuresData[selectedFeature].icon : ""}
                      </Text>
                    </View>
                    <Text style={[CitizenStyles.featureModalTitle, isDarkMode && CitizenStyles.featureModalTitleDark]}>
                      {selectedFeature !== null ? featuresData[selectedFeature].title : ""}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={closeFeatureModal} style={CitizenStyles.featureModalCloseButton}>
                    <Text style={[CitizenStyles.featureModalCloseIcon, isDarkMode && CitizenStyles.featureModalCloseIconDark]}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={CitizenStyles.featureModalContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={CitizenStyles.featureModalStats}>
                    <Text style={[CitizenStyles.featureModalStatsText, isDarkMode && CitizenStyles.featureModalStatsTextDark]}>
                      {selectedFeature !== null ? featuresData[selectedFeature].stats : ""}
                    </Text>
                  </View>
                  
                  <Text style={[CitizenStyles.featureModalDescription, isDarkMode && CitizenStyles.featureModalDescriptionDark]}>
                    {selectedFeature !== null ? featuresData[selectedFeature].longDescription : ""}
                  </Text>
                  
                  <View style={CitizenStyles.featureModalBenefits}>
                    <Text style={[CitizenStyles.featureModalBenefitsTitle, isDarkMode && CitizenStyles.featureModalBenefitsTitleDark]}>
                      Key Benefits
                    </Text>
                    <View style={CitizenStyles.featureModalBenefitsList}>
                      <View style={[CitizenStyles.featureModalBenefitItem, isDarkMode && CitizenStyles.featureModalBenefitItemDark]}>
                        <Text style={CitizenStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[CitizenStyles.featureModalBenefitText, isDarkMode && CitizenStyles.featureModalBenefitTextDark]}>
                          Enhanced community safety
                        </Text>
                      </View>
                      <View style={[CitizenStyles.featureModalBenefitItem, isDarkMode && CitizenStyles.featureModalBenefitItemDark]}>
                        <Text style={CitizenStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[CitizenStyles.featureModalBenefitText, isDarkMode && CitizenStyles.featureModalBenefitTextDark]}>
                          Faster emergency response
                        </Text>
                      </View>
                      <View style={[CitizenStyles.featureModalBenefitItem, isDarkMode && CitizenStyles.featureModalBenefitItemDark]}>
                        <Text style={CitizenStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[CitizenStyles.featureModalBenefitText, isDarkMode && CitizenStyles.featureModalBenefitTextDark]}>
                          Real-time updates
                        </Text>
                      </View>
                      <View style={[CitizenStyles.featureModalBenefitItem, isDarkMode && CitizenStyles.featureModalBenefitItemDark]}>
                        <Text style={CitizenStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[CitizenStyles.featureModalBenefitText, isDarkMode && CitizenStyles.featureModalBenefitTextDark]}>
                          Easy to use interface
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={CitizenStyles.featureModalFooter}>
                  <TouchableOpacity 
                    style={[CitizenStyles.featureModalButton, isDarkMode && CitizenStyles.featureModalButtonDark]}
                    onPress={() => {
                      closeFeatureModal();
                      if (selectedFeature === 0) {
                        router.navigate("/submit-incident");
                      } else if (selectedFeature === 1) {
                        Alert.alert(
                          "Coming Soon",
                          "Map feature is coming soon! Stay tuned.",
                          [{ text: "OK" }]
                        );
                      } else if (selectedFeature === 2) {
                        Alert.alert(
                          "Coming Soon",
                          "Community Network is coming soon! Stay tuned.",
                          [{ text: "OK" }]
                        );
                      }
                    }}
                  >
                    <LinearGradient
                      colors={['#FF6B35', '#FF8E35', '#FFA235']}
                      style={CitizenStyles.featureModalButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={CitizenStyles.featureModalButtonText}>
                        {selectedFeature === 0 ? "Report Now" : 
                         selectedFeature === 1 ? "View Map" : 
                         "Join Community"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={CitizenStyles.menuBackdrop}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View 
            style={[
              CitizenStyles.menuContainer,
              {
                transform: [{ translateX: menuTranslateX }],
                opacity: menuOpacity,
              }
            ]}
          >
            <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={CitizenStyles.menuBlurView}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(26, 32, 44, 0.98)', 'rgba(45, 55, 72, 0.95)']
                  : ['rgba(255, 255, 255, 0.98)', 'rgba(250, 251, 252, 0.95)']
                }
                style={CitizenStyles.menuGradient}
              />
              
              <View style={CitizenStyles.menuHeader}>
                <Text style={[CitizenStyles.menuTitle, isDarkMode && CitizenStyles.menuTitleDark]}>
                  Menu
                </Text>
                <TouchableOpacity onPress={toggleMenu} style={CitizenStyles.menuCloseButton}>
                  <Text style={[CitizenStyles.menuCloseIcon, isDarkMode && CitizenStyles.menuCloseIconDark]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={CitizenStyles.menuItems}>
                <TouchableOpacity 
                  style={[CitizenStyles.menuItem, CitizenStyles.menuItemActive]}
                  onPress={() => handleMenuOption('homepage')}
                >
                  <View style={[CitizenStyles.menuIconContainer, CitizenStyles.menuIconActive]}>
                    <Text style={CitizenStyles.menuIcon}>🏠</Text>
                  </View>
                  <Text style={[CitizenStyles.menuItemText, CitizenStyles.menuItemTextActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={CitizenStyles.menuItem}
                  onPress={() => handleMenuOption('map')}
                >
                  <View style={CitizenStyles.menuIconContainer}>
                    <Text style={[CitizenStyles.menuIcon, isDarkMode && CitizenStyles.menuIconDark]}>🗺️</Text>
                  </View>
                  <Text style={[CitizenStyles.menuItemText, isDarkMode && CitizenStyles.menuItemTextDark]}>Map</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={CitizenStyles.menuItem}
                  onPress={() => handleMenuOption('reports')}
                >
                  <View style={CitizenStyles.menuIconContainer}>
                    <Text style={[CitizenStyles.menuIcon, isDarkMode && CitizenStyles.menuIconDark]}>📋</Text>
                  </View>
                  <Text style={[CitizenStyles.menuItemText, isDarkMode && CitizenStyles.menuItemTextDark]}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={CitizenStyles.menuItem}
                  onPress={() => handleMenuOption('profile')}
                >
                  <View style={CitizenStyles.menuIconContainer}>
                    <Text style={[CitizenStyles.menuIcon, isDarkMode && CitizenStyles.menuIconDark]}>👤</Text>
                  </View>
                  <Text style={[CitizenStyles.menuItemText, isDarkMode && CitizenStyles.menuItemTextDark]}>Profile</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity 
                  style={[CitizenStyles.menuItem, CitizenStyles.menuItemLogout]}
                  onPress={() => handleMenuOption('logout')}
                >
                  <View style={[CitizenStyles.menuIconContainer, CitizenStyles.menuIconLogout]}>
                    <Text style={CitizenStyles.menuIconLogoutText}>🚪</Text>
                  </View>
                  <Text style={[CitizenStyles.menuItemText, CitizenStyles.menuItemTextLogout]}>Logout</Text>
                </TouchableOpacity>
              </View>

              <View style={CitizenStyles.menuFooter}>
                <Text style={[CitizenStyles.menuFooterText, isDarkMode && CitizenStyles.menuFooterTextDark]}>
                  ResQMap v1.0 • {user?.name || "Guest"}
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Enhanced Fixed Header Section */}
      <Animated.View 
        style={[
          CitizenStyles.headerSection, 
          isDarkMode && CitizenStyles.headerSectionDark,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(139, 69, 19, 0.9)', 'rgba(160, 82, 45, 0.85)', 'rgba(139, 69, 19, 0.8)']
            : ['#FF6B35', '#FF8E35', '#FFA235']
          }
          style={[CitizenStyles.headerGradient, isDarkMode && CitizenStyles.headerGradientDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={CitizenStyles.headerPattern}>
          {[...Array(20)].map((_, i) => (
            <View 
              key={i}
              style={[
                CitizenStyles.headerPatternDot,
                isDarkMode && CitizenStyles.headerPatternDotDark,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.1 + 0.05,
                  transform: [{ scale: Math.random() * 0.5 + 0.5 }]
                }
              ]}
            />
          ))}
        </View>

        <View style={CitizenStyles.headerContent}>
          <Animated.View 
            style={[
              CitizenStyles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={[CitizenStyles.welcomeText, isDarkMode && CitizenStyles.welcomeTextDark]}>
              Welcome Back,
            </Text>
            <Text style={CitizenStyles.welcomeName}>
              {user?.name || "Sara Ahmad"} 👋
            </Text>
            <Text style={[CitizenStyles.welcomeSubtitle, isDarkMode && CitizenStyles.welcomeSubtitleDark]}>
              Community Safety Advocate • Level 5
            </Text>
          </Animated.View>

          <View style={CitizenStyles.headerControls}>
            <TouchableOpacity 
              style={[CitizenStyles.darkModeToggle, isDarkMode && CitizenStyles.darkModeToggleActive]}
              onPress={toggleDarkMode}
            >
              <View style={[CitizenStyles.toggleKnob, isDarkMode && CitizenStyles.toggleKnobActive]}>
                <Text style={CitizenStyles.toggleIcon}>
                  {isDarkMode ? '🌙' : '☀️'}
                </Text>
              </View>
              <Text style={[CitizenStyles.toggleText, isDarkMode && CitizenStyles.toggleTextDark]}>
                {isDarkMode ? 'Dark' : 'Light'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[CitizenStyles.menuButton, isDarkMode && CitizenStyles.menuButtonDark]}
              onPress={toggleMenu}
            >
              <View style={[CitizenStyles.menuLine, isDarkMode && CitizenStyles.menuLineDark]} />
              <View style={[CitizenStyles.menuLine, isDarkMode && CitizenStyles.menuLineDark]} />
              <View style={[CitizenStyles.menuLine, isDarkMode && CitizenStyles.menuLineDark]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={CitizenStyles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Mission Section */}
        <View style={[CitizenStyles.heroSection, isDarkMode && CitizenStyles.heroSectionDark]}>
          <Image 
            source={require('../assets/images/mission-bg.jpg')}
            style={[CitizenStyles.heroBackgroundImage, isDarkMode && CitizenStyles.heroBackgroundImageDark]}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(26, 21, 18, 0.7)', 'rgba(139, 69, 19, 0.4)', 'rgba(26, 21, 18, 0.8)']
              : ['rgba(255, 255, 255, 0.85)', 'rgba(255, 107, 53, 0.15)', 'rgba(255, 255, 255, 0.9)']
            }
            style={[CitizenStyles.heroOverlay, isDarkMode && CitizenStyles.heroOverlayDark]}
          />

          <View style={CitizenStyles.heroParticlesContainer}>
            {[...Array(15)].map((_, i) => (
              <View 
                key={i}
                style={[
                  CitizenStyles.heroParticle,
                  isDarkMode ? CitizenStyles.heroParticleDark : CitizenStyles.heroParticleLight,
                  {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3 + 0.1,
                    transform: [{ scale: Math.random() * 0.5 + 0.5 }]
                  }
                ]}
              />
            ))}
          </View>

          <Animated.View 
            style={[
              CitizenStyles.heroContent,
              {
                opacity: heroTextAnim,
                transform: [{ translateY: heroSlideInterpolate }]
              }
            ]}
          >
            <Animated.View 
              style={[
                CitizenStyles.missionIconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={CitizenStyles.missionIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={CitizenStyles.missionIconInner}>
                  <Text style={CitizenStyles.missionEmoji}>🚀</Text>
                </View>
              </LinearGradient>
              <View style={CitizenStyles.missionIconGlow} />
            </Animated.View>

            <View style={CitizenStyles.missionTextContainer}>
              <Text style={[CitizenStyles.missionTagline, isDarkMode && CitizenStyles.missionTaglineDark]}>
                Empowering Communities
              </Text>
              <Text style={[CitizenStyles.missionText, isDarkMode && CitizenStyles.missionTextDark]}>
                <Text style={CitizenStyles.missionAccent}>ResQMap</Text> transforms citizen-reported data into actionable insights for safer neighborhoods
              </Text>
            </View>

            <View style={[CitizenStyles.missionStats, isDarkMode && CitizenStyles.missionStatsDark]}>
              <View style={CitizenStyles.heroStatItem}>
                <Text style={[CitizenStyles.heroStatNumber, isDarkMode && CitizenStyles.heroStatNumberDark]}>10K+</Text>
                <Text style={[CitizenStyles.heroStatLabel, isDarkMode && CitizenStyles.heroStatLabelDark]}>Active Users</Text>
              </View>
              <View style={CitizenStyles.statDivider} />
              <View style={CitizenStyles.heroStatItem}>
                <Text style={[CitizenStyles.heroStatNumber, isDarkMode && CitizenStyles.heroStatNumberDark]}>24/7</Text>
                <Text style={[CitizenStyles.heroStatLabel, isDarkMode && CitizenStyles.heroStatLabelDark]}>Monitoring</Text>
              </View>
              <View style={CitizenStyles.statDivider} />
              <View style={CitizenStyles.heroStatItem}>
                <Text style={[CitizenStyles.heroStatNumber, isDarkMode && CitizenStyles.heroStatNumberDark]}>98%</Text>
                <Text style={[CitizenStyles.heroStatLabel, isDarkMode && CitizenStyles.heroStatLabelDark]}>Satisfaction</Text>
              </View>
            </View>

            {/* UPDATED: "Learn How It Works" Button - Now scrolls to features section */}
            <TouchableOpacity 
              style={[CitizenStyles.heroCTA, isDarkMode && CitizenStyles.heroCTADark]}
              onPress={scrollToFeatures}
            >
              <Text style={CitizenStyles.heroCTAText}>Learn How It Works</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Enhanced Card Container Section */}
        <View style={CitizenStyles.sectionHeaderContainer}>
          <View style={CitizenStyles.sectionHeaderContent}>
            <Text style={[CitizenStyles.sectionHeaderTitle, isDarkMode && CitizenStyles.sectionHeaderTitleDark]}>
              Report Incident
            </Text>
            <Text style={[CitizenStyles.sectionHeaderSubtitle, isDarkMode && CitizenStyles.sectionHeaderSubtitleDark]}>
              Help keep your community safe with quick reporting
            </Text>
          </View>
          <View style={CitizenStyles.sectionHeaderIcon}>
            <Text style={CitizenStyles.sectionHeaderIconText}>📋</Text>
          </View>
        </View>

        <Animated.View 
          style={[
            CitizenStyles.enhancedCardContainer,
            isDarkMode && CitizenStyles.enhancedCardContainerDark,
            {
              opacity: fadeAnim,
              transform: [{ scale: cardScaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(30, 30, 30, 0.95)', 'rgba(40, 40, 40, 0.98)']
              : ['#FFFFFF', '#F8FAFC']
            }
            style={CitizenStyles.enhancedCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={CitizenStyles.cardPatternOverlay}>
            {[...Array(8)].map((_, i) => (
              <View 
                key={i}
                style={[
                  CitizenStyles.cardPatternCircle,
                  isDarkMode && CitizenStyles.cardPatternCircleDark,
                  {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.05 + 0.02,
                    transform: [{ scale: Math.random() * 0.5 + 0.3 }]
                  }
                ]}
              />
            ))}
          </View>
          
          <LinearGradient
            colors={['#FF6B35', '#FF8E35', '#FFA235']}
            style={CitizenStyles.cardBorderGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={CitizenStyles.enhancedCardContent}>
            <View style={CitizenStyles.enhancedCardHeader}>
              <View style={[CitizenStyles.enhancedCardBadge, isDarkMode && CitizenStyles.enhancedCardBadgeDark]}>
                <Text style={CitizenStyles.enhancedCardBadgeText}>🚨 URGENT</Text>
              </View>
              <View style={CitizenStyles.enhancedCardIconContainer}>
                <LinearGradient
                  colors={['#FF6B35', '#FF8E35']}
                  style={CitizenStyles.enhancedCardIconGradient}
                >
                </LinearGradient>
              </View>
            </View>
            
            <View style={CitizenStyles.enhancedCardMain}>
              <Text style={[CitizenStyles.enhancedCardTitle, isDarkMode && CitizenStyles.enhancedCardTitleDark]}>
                Report Community Incident
              </Text>
              
              <Text style={[CitizenStyles.enhancedCardDescription, isDarkMode && CitizenStyles.enhancedCardDescriptionDark]}>
                Submit detailed reports with photos, location, and incident information. Your reports help authorities respond faster and keep everyone safe.
              </Text>
              
              <View style={CitizenStyles.enhancedFeaturesRow}>
                <View style={[CitizenStyles.enhancedFeature, isDarkMode && CitizenStyles.enhancedFeatureDark]}>
                  <View style={[CitizenStyles.enhancedFeatureIcon, isDarkMode && CitizenStyles.enhancedFeatureIconDark]}>
                    <Text style={CitizenStyles.enhancedFeatureIconText}>📸</Text>
                  </View>
                  <Text style={[CitizenStyles.enhancedFeatureLabel, isDarkMode && CitizenStyles.enhancedFeatureLabelDark]}>
                    Add Photos
                  </Text>
                </View>
                
                <View style={[CitizenStyles.enhancedFeature, isDarkMode && CitizenStyles.enhancedFeatureDark]}>
                  <View style={[CitizenStyles.enhancedFeatureIcon, isDarkMode && CitizenStyles.enhancedFeatureIconDark]}>
                    <Text style={CitizenStyles.enhancedFeatureIconText}>📍</Text>
                  </View>
                  <Text style={[CitizenStyles.enhancedFeatureLabel, isDarkMode && CitizenStyles.enhancedFeatureLabelDark]}>
                    Live Location
                  </Text>
                </View>
                
                <View style={[CitizenStyles.enhancedFeature, isDarkMode && CitizenStyles.enhancedFeatureDark]}>
                  <View style={[CitizenStyles.enhancedFeatureIcon, isDarkMode && CitizenStyles.enhancedFeatureIconDark]}>
                    <Text style={CitizenStyles.enhancedFeatureIconText}>⚡</Text>
                  </View>
                  <Text style={[CitizenStyles.enhancedFeatureLabel, isDarkMode && CitizenStyles.enhancedFeatureLabelDark]}>
                    24/7 Support
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[CitizenStyles.enhancedActionButton, isDarkMode && CitizenStyles.enhancedActionButtonDark]}
              onPress={handleSubmitIncident}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={CitizenStyles.enhancedActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={CitizenStyles.enhancedActionButtonContent}>
                  <Text style={CitizenStyles.enhancedActionButtonText}>
                    Report Incident Now
                  </Text>
                  <View style={CitizenStyles.enhancedActionButtonIcon}>
                    <Text style={CitizenStyles.enhancedActionButtonIconText}>🚀</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={[CitizenStyles.enhancedCardFooter, isDarkMode && CitizenStyles.enhancedCardFooterDark]}>
              Reports are reviewed by local authorities within 15 minutes
            </Text>
          </View>
        </Animated.View>

        {/* Features Section Header */}
        <View style={CitizenStyles.sectionHeaderContainer}>
          <View style={CitizenStyles.sectionHeaderContent}>
            <Text style={[CitizenStyles.sectionHeaderTitle, isDarkMode && CitizenStyles.sectionHeaderTitleDark]}>
              Key Features
            </Text>
            <Text style={[CitizenStyles.sectionHeaderSubtitle, isDarkMode && CitizenStyles.sectionHeaderSubtitleDark]}>
              Everything you need for community safety
            </Text>
          </View>
        </View>

        {/* Responsive Features Section - WITH HOVER AND CLICK FUNCTIONALITY */}
        <View style={[CitizenStyles.featuresSectionWithImage, isDarkMode && CitizenStyles.featuresSectionWithImageDark]}>
          
          {/* Left Column - Image (Shown on Left on Web, Top on Mobile) */}
          <View style={CitizenStyles.featuresLeftColumn}>
            <View style={[CitizenStyles.featuresImageWrapper, isDarkMode && CitizenStyles.featuresImageWrapperDark]}>
              <Image 
                source={isDarkMode 
                  ? require('../assets/images/features-illustration-dark.png')
                  : require('../assets/images/features-illustration-light.png')
                }
                style={CitizenStyles.featuresImage}
                resizeMode="cover"
              />
              {/* Image Overlay Gradient */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.1)']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 60,
                  borderRadius: 20,
                }}
              />
            </View>
          </View>

          {/* Right Column - Features Content (Shown on Right on Web, Bottom on Mobile) */}
          <View style={[CitizenStyles.featuresRightColumn, isDarkMode && CitizenStyles.featuresRightColumnDark]}>
            
            {/* Background Image only on right side */}
            <Image 
              source={isDarkMode 
                ? require('../assets/images/features-bg-dark2.jpg')
                : require('../assets/images/features-bg-light.jpg')
              }
              style={CitizenStyles.featuresBackgroundImage}
              resizeMode="cover"
            />
            
            {/* Decorative Elements */}
            <View style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              opacity: 0.5,
            }} />
            
            {/* Features Content */}
            <View style={CitizenStyles.featuresHeader}>
              <Text style={CitizenStyles.featuresTagline}>POWERFUL TOOLS</Text>
              <Text style={[CitizenStyles.featuresTitle, isDarkMode && CitizenStyles.featuresTitleDark]}>
                Community Safety Made Simple
              </Text>
              <Text style={[CitizenStyles.featuresSubtitle, isDarkMode && CitizenStyles.featuresSubtitleDark]}>
                Our comprehensive suite of features empowers citizens to actively participate in keeping neighborhoods safe
              </Text>
            </View>

            <View style={CitizenStyles.featuresContentGrid}>
              {/* Feature 1: Real-time Reporting - WITH HOVER */}
              {featuresData.map((feature) => (
                <TouchableOpacity 
                  key={feature.id}
                  style={[
                    hoveredFeature === feature.id ? CitizenStyles.featuresContentItemHovered : CitizenStyles.featuresContentItem,
                    isDarkMode && CitizenStyles.featuresContentItemDark,
                    hoveredFeature === feature.id && isDarkMode && CitizenStyles.featuresContentItemHoveredDark
                  ]}
                  activeOpacity={0.9}
                  onPressIn={() => setHoveredFeature(feature.id)}
                  onPressOut={() => setHoveredFeature(null)}
                  onPress={() => handleFeaturePress(feature.id)}
                >
                  <View style={[CitizenStyles.featuresContentIconContainer, isDarkMode && CitizenStyles.featuresContentIconContainerDark]}>
                    <Text style={CitizenStyles.featuresContentIcon}>{feature.icon}</Text>
                  </View>
                  <View style={CitizenStyles.featuresContentTextContainer}>
                    <Text style={[CitizenStyles.featuresContentTitle, isDarkMode && CitizenStyles.featuresContentTitleDark]}>
                      {feature.title}
                    </Text>
                    <Text style={[CitizenStyles.featuresContentDescription, isDarkMode && CitizenStyles.featuresContentDescriptionDark]}>
                      {feature.description}
                    </Text>
                  </View>
                  <Text style={{ color: '#FF6B35', fontSize: 20, marginLeft: 8 }}>→</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </View>

        {/* Community Stats Section Header */}
        <View style={CitizenStyles.sectionHeaderContainer}>
          <View style={CitizenStyles.sectionHeaderContent}>
            <Text style={[CitizenStyles.sectionHeaderTitle, isDarkMode && CitizenStyles.sectionHeaderTitleDark]}>
              Community Impact
            </Text>
            <Text style={[CitizenStyles.sectionHeaderSubtitle, isDarkMode && CitizenStyles.sectionHeaderSubtitleDark]}>
              Making a difference together
            </Text>
          </View>
        </View>

        {/* Enhanced Community Stats Section WITHOUT Hover Effect */}
        <View style={[CitizenStyles.statsSection, isDarkMode && CitizenStyles.statsSectionDark]}>
          {!isDarkMode && (
            <View style={CitizenStyles.statsBackgroundShade} />
          )}
          
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(26, 21, 18, 0.95)', 'rgba(139, 69, 19, 0.85)', 'rgba(26, 21, 18, 0.9)']
              : ['rgba(255, 255, 255, 0.95)', 'rgba(250, 251, 252, 0.98)']
            }
            style={[CitizenStyles.statsGradient, isDarkMode && CitizenStyles.statsGradientDark]}
          >
            <View style={CitizenStyles.statsGrid}>
              {/* Stat 1 - WITHOUT HOVER (View instead of TouchableOpacity) */}
              <View
                style={[
                  CitizenStyles.statsCard,
                  isDarkMode && CitizenStyles.statsCardDark,
                ]}
              >
                <View style={[CitizenStyles.statsIconContainer, isDarkMode && CitizenStyles.statsIconContainerDark]}>
                  <Text style={CitizenStyles.statsIcon}>📈</Text>
                </View>
                <Text style={[CitizenStyles.statsNumber, isDarkMode && CitizenStyles.statsNumberDark]}>
                  1,254
                </Text>
                <Text style={[CitizenStyles.statsLabel, isDarkMode && CitizenStyles.statsLabelDark]}>
                  Incidents Reported
                </Text>
              </View>
              
              {/* Stat 2 - WITHOUT HOVER (View instead of TouchableOpacity) */}
              <View
                style={[
                  CitizenStyles.statsCard,
                  isDarkMode && CitizenStyles.statsCardDark,
                ]}
              >
                <View style={[CitizenStyles.statsIconContainer, isDarkMode && CitizenStyles.statsIconContainerDark]}>
                  <Text style={CitizenStyles.statsIcon}>⚡</Text>
                </View>
                <Text style={[CitizenStyles.statsNumber, isDarkMode && CitizenStyles.statsNumberDark]}>
                  98.2%
                </Text>
                <Text style={[CitizenStyles.statsLabel, isDarkMode && CitizenStyles.statsLabelDark]}>
                  Response Rate
                </Text>
              </View>
              
              {/* Stat 3 - WITHOUT HOVER (View instead of TouchableOpacity) */}
              <View
                style={[
                  CitizenStyles.statsCard,
                  isDarkMode && CitizenStyles.statsCardDark,
                ]}
              >
                <View style={[CitizenStyles.statsIconContainer, isDarkMode && CitizenStyles.statsIconContainerDark]}>
                  <Text style={CitizenStyles.statsIcon}>⏱️</Text>
                </View>
                <Text style={[CitizenStyles.statsNumber, isDarkMode && CitizenStyles.statsNumberDark]}>
                  42 min
                </Text>
                <Text style={[CitizenStyles.statsLabel, isDarkMode && CitizenStyles.statsLabelDark]}>
                  Avg. Resolution Time
                </Text>
              </View>
              
              {/* Stat 4 - WITHOUT HOVER (View instead of TouchableOpacity) */}
              <View
                style={[
                  CitizenStyles.statsCard,
                  isDarkMode && CitizenStyles.statsCardDark,
                ]}
              >
                <View style={[CitizenStyles.statsIconContainer, isDarkMode && CitizenStyles.statsIconContainerDark]}>
                  <Text style={CitizenStyles.statsIcon}>😊</Text>
                </View>
                <Text style={[CitizenStyles.statsNumber, isDarkMode && CitizenStyles.statsNumberDark]}>
                  98%
                </Text>
                <Text style={[CitizenStyles.statsLabel, isDarkMode && CitizenStyles.statsLabelDark]}>
                  User Satisfaction
                </Text>
              </View>
            </View>

            <View style={[CitizenStyles.statsFooter, isDarkMode && CitizenStyles.statsFooterDark]}>
              <Text style={[CitizenStyles.statsFooterText, isDarkMode && CitizenStyles.statsFooterTextDark]}>
                Last updated: Today • Data updated in real-time
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={CitizenStyles.navBarBlur}>
        <View style={[CitizenStyles.navBar, isDarkMode && CitizenStyles.navBarDark]}>
          <TouchableOpacity style={CitizenStyles.navItem}>
            <Animated.View 
              style={[
                CitizenStyles.navIconContainer,
                CitizenStyles.navIconContainerActive,
                { transform: [{ translateY: bounceAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35']}
                style={CitizenStyles.navIconGradient}
              >
                <Text style={CitizenStyles.navIcon}>🏠</Text>
              </LinearGradient>
            </Animated.View>
            <Text style={[CitizenStyles.navText, CitizenStyles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={CitizenStyles.navItem}
            onPress={() => handleMenuOption('map')}
          >
            <View style={[CitizenStyles.navIconContainer, CitizenStyles.navIconContainerInactive]}>
              <Text style={[CitizenStyles.navIcon, CitizenStyles.navIconInactive]}>🗺️</Text>
            </View>
            <Text style={[CitizenStyles.navText, CitizenStyles.navTextInactive]}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={CitizenStyles.navItem}
            onPress={handleNavigateToReports}
          >
            <View style={[CitizenStyles.navIconContainer, CitizenStyles.navIconContainerInactive]}>
              <Text style={[CitizenStyles.navIcon, CitizenStyles.navIconInactive]}>📋</Text>
            </View>
            <Text style={[CitizenStyles.navText, CitizenStyles.navTextInactive]}>Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={CitizenStyles.navItem}
            onPress={handleNavigateToProfile}
          >
            <View style={[CitizenStyles.navIconContainer, CitizenStyles.navIconContainerInactive]}>
              <Text style={[CitizenStyles.navIcon, CitizenStyles.navIconInactive]}>👤</Text>
            </View>
            <Text style={[CitizenStyles.navText, CitizenStyles.navTextInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}