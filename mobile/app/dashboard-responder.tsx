import { View, Text, TouchableOpacity, ScrollView, Animated, Image, Modal, Alert } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ResponderStyles } from "../styles/ResponderStyling";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

export default function ResponderDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [featureModalVisible, setFeatureModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  // Refs for scroll position
  const scrollViewRef = useRef<ScrollView>(null);
  const savedScrollOffset = useRef(0);
  const isFirstMount = useRef(true);

  // Scroll animation for header
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Enhanced animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const heroTextAnim = useRef(new Animated.Value(1)).current;
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

  // Save scroll position when leaving
  useFocusEffect(
    useCallback(() => {
      // This runs when screen focuses
      console.log("Dashboard focused");
      
      // Restore scroll position after a tiny delay to ensure rendering is complete
      if (!isFirstMount.current && savedScrollOffset.current > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: savedScrollOffset.current,
            animated: false
          });
        }, 50);
      }
      
      isFirstMount.current = false;
      
      return () => {
        // This runs when screen unfocuses
        console.log("Dashboard unfocused - saving scroll position:", savedScrollOffset.current);
      };
    }, [])
  );

  useEffect(() => {
    // Initial animations only
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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
  }, []);

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
        // Already on homepage
        break;
      case 'incidents':
        router.push('/ViewIncidents');
        break;
      case 'live-incidents':
        router.push('/ResponderLiveIncidents');
        break;
      case 'map':
        router.push("/live-map");
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'reports':
        router.push('/submit-incident');
        break;
      case 'logout':
        logout();
        router.replace('/login');
        break;
    }
  };

  // Handle navbar navigation
  const handleNavbarNavigation = (option: string) => {
    switch(option) {
      case 'homepage':
        // Already on homepage
        break;
      case 'incidents':
        router.push('/ViewIncidents');
        break;
      case 'map':
        router.push("/live-map");
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'reports':
        router.push('/submit-incident');
        break;
    }
  };

  // View Incidents function
  const handleViewIncidents = () => {
    router.push('/ViewIncidents');
  };

  // Handle live incidents function
  const handleLiveIncidents = () => {
    router.push("/ResponderLiveIncidents");
  };

  // Handle submit incident function
  const handleSubmitIncident = () => {
    router.push("/submit-incident");
  };

  // Feature Data for Responders
  const responderFeaturesData = [
    {
      id: 0,
      title: "Real-time Incident Response",
      description: "Respond to incidents instantly with access to photos, location, and detailed descriptions. Prioritize and manage emergency situations efficiently.",
      longDescription: "Our real-time response system allows you to instantly access incident reports with photos, precise location data, and detailed descriptions. Prioritize emergencies and coordinate response teams effectively. Key features include:\n\n• Instant incident notification system\n• Priority level assignment\n• Team coordination tools\n• Real-time status updates\n• Resource allocation management",
      icon: "🚨",
      stats: "Average response time: 5 minutes"
    },
    {
      id: 1,
      title: "Live Response Map",
      description: "Interactive map showing all active incidents, responder locations, and emergency resources in your area.",
      longDescription: "The Live Response Map provides a comprehensive view of all emergency situations in your jurisdiction. See real-time incidents, responder locations, hospital facilities, and emergency resources all in one interactive interface.\n\n• Real-time incident heatmaps\n• Responder location tracking\n• Emergency facility locations\n• Route optimization for response\n• Resource distribution overview",
      icon: "🗺️",
      stats: "Updated every 30 seconds"
    },
    {
      id: 2,
      title: "Team Coordination",
      description: "Coordinate with other responders, dispatch centers, and emergency services for collaborative response efforts.",
      longDescription: "Build an efficient emergency response network by coordinating with other responders, dispatch centers, and emergency services. Collaborate on incident management, resource sharing, and emergency response planning.\n\n• Multi-agency communication\n• Team assignment management\n• Resource request system\n• Incident debriefing tools\n• Performance analytics",
      icon: "👥",
      stats: "500+ active emergency responders"
    }
  ];

  // Feature Modal Functions
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

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const heroSlideInterpolate = heroTextAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={[ResponderStyles.container, isDarkMode && ResponderStyles.containerDark]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Feature Detail Modal */}
      <Modal
        visible={featureModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeFeatureModal}
      >
        <TouchableOpacity 
          style={ResponderStyles.featureModalBackdrop}
          activeOpacity={1}
          onPress={closeFeatureModal}
        >
          <Animated.View 
            style={[
              ResponderStyles.featureModalContainer,
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
              <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={ResponderStyles.featureModalBlurView}>
                <LinearGradient
                  colors={isDarkMode 
                    ? ['rgba(26, 32, 44, 0.98)', 'rgba(45, 55, 72, 0.95)']
                    : ['rgba(255, 255, 255, 0.98)', 'rgba(250, 251, 252, 0.95)']
                  }
                  style={ResponderStyles.featureModalGradient}
                />
                
                <View style={ResponderStyles.featureModalHeader}>
                  <View style={ResponderStyles.featureModalTitleContainer}>
                    <View style={[ResponderStyles.featureModalIconContainer, isDarkMode && ResponderStyles.featureModalIconContainerDark]}>
                      <Text style={ResponderStyles.featureModalIcon}>
                        {selectedFeature !== null ? responderFeaturesData[selectedFeature].icon : ""}
                      </Text>
                    </View>
                    <Text style={[ResponderStyles.featureModalTitle, isDarkMode && ResponderStyles.featureModalTitleDark]}>
                      {selectedFeature !== null ? responderFeaturesData[selectedFeature].title : ""}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={closeFeatureModal} style={ResponderStyles.featureModalCloseButton}>
                    <Text style={[ResponderStyles.featureModalCloseIcon, isDarkMode && ResponderStyles.featureModalCloseIconDark]}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={ResponderStyles.featureModalContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={ResponderStyles.featureModalStats}>
                    <Text style={[ResponderStyles.featureModalStatsText, isDarkMode && ResponderStyles.featureModalStatsTextDark]}>
                      {selectedFeature !== null ? responderFeaturesData[selectedFeature].stats : ""}
                    </Text>
                  </View>
                  
                  <Text style={[ResponderStyles.featureModalDescription, isDarkMode && ResponderStyles.featureModalDescriptionDark]}>
                    {selectedFeature !== null ? responderFeaturesData[selectedFeature].longDescription : ""}
                  </Text>
                  
                  <View style={ResponderStyles.featureModalBenefits}>
                    <Text style={[ResponderStyles.featureModalBenefitsTitle, isDarkMode && ResponderStyles.featureModalBenefitsTitleDark]}>
                      Key Benefits
                    </Text>
                    <View style={ResponderStyles.featureModalBenefitsList}>
                      <View style={[ResponderStyles.featureModalBenefitItem, isDarkMode && ResponderStyles.featureModalBenefitItemDark]}>
                        <Text style={ResponderStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[ResponderStyles.featureModalBenefitText, isDarkMode && ResponderStyles.featureModalBenefitTextDark]}>
                          Faster emergency response
                        </Text>
                      </View>
                      <View style={[ResponderStyles.featureModalBenefitItem, isDarkMode && ResponderStyles.featureModalBenefitItemDark]}>
                        <Text style={ResponderStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[ResponderStyles.featureModalBenefitText, isDarkMode && ResponderStyles.featureModalBenefitTextDark]}>
                          Enhanced team coordination
                        </Text>
                      </View>
                      <View style={[ResponderStyles.featureModalBenefitItem, isDarkMode && ResponderStyles.featureModalBenefitItemDark]}>
                        <Text style={ResponderStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[ResponderStyles.featureModalBenefitText, isDarkMode && ResponderStyles.featureModalBenefitTextDark]}>
                          Real-time incident updates
                        </Text>
                      </View>
                      <View style={[ResponderStyles.featureModalBenefitItem, isDarkMode && ResponderStyles.featureModalBenefitItemDark]}>
                        <Text style={ResponderStyles.featureModalBenefitIcon}>✓</Text>
                        <Text style={[ResponderStyles.featureModalBenefitText, isDarkMode && ResponderStyles.featureModalBenefitTextDark]}>
                          Efficient resource management
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={ResponderStyles.featureModalFooter}>
                  <TouchableOpacity 
                    style={[ResponderStyles.featureModalButton, isDarkMode && ResponderStyles.featureModalButtonDark]}
                    onPress={() => {
                      closeFeatureModal();
                      if (selectedFeature === 0) {
                        router.push("/ViewIncidents");
                      } else if (selectedFeature === 1) {
                        router.push('/ViewIncidents');
                      } else if (selectedFeature === 2) {
                        Alert.alert(
                          "Coming Soon",
                          "Team Coordination feature is coming soon! Stay tuned.",
                          [{ text: "OK" }]
                        );
                      }
                    }}
                  >
                    <LinearGradient
                      colors={['#FF6B35', '#FF8E35', '#FFA235']}
                      style={ResponderStyles.featureModalButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={ResponderStyles.featureModalButtonText}>
                        {selectedFeature === 0 ? "View Incidents" : 
                         selectedFeature === 1 ? "Open Map" : 
                         "Join Team"}
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
          style={ResponderStyles.menuBackdrop}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View 
            style={[
              ResponderStyles.menuContainer,
              {
                transform: [{ translateX: menuTranslateX }],
                opacity: menuOpacity,
              }
            ]}
          >
            <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={ResponderStyles.menuBlurView}>
              <LinearGradient
                colors={isDarkMode 
                  ? ['rgba(26, 32, 44, 0.98)', 'rgba(45, 55, 72, 0.95)']
                  : ['rgba(255, 255, 255, 0.98)', 'rgba(250, 251, 252, 0.95)']
                }
                style={ResponderStyles.menuGradient}
              />
              
              <View style={ResponderStyles.menuHeader}>
                <Text style={[ResponderStyles.menuTitle, isDarkMode && ResponderStyles.menuTitleDark]}>
                  Menu
                </Text>
                <TouchableOpacity onPress={toggleMenu} style={ResponderStyles.menuCloseButton}>
                  <Text style={[ResponderStyles.menuCloseIcon, isDarkMode && ResponderStyles.menuCloseIconDark]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={ResponderStyles.menuItems}>
                <TouchableOpacity 
                  style={[ResponderStyles.menuItem, ResponderStyles.menuItemActive]}
                  onPress={() => handleMenuOption('homepage')}
                >
                  <View style={[ResponderStyles.menuIconContainer, ResponderStyles.menuIconActive]}>
                    <Text style={ResponderStyles.menuIcon}>🏠</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, ResponderStyles.menuItemTextActive]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={ResponderStyles.menuItem}
                  onPress={() => handleMenuOption('incidents')}
                >
                  <View style={ResponderStyles.menuIconContainer}>
                    <Text style={[ResponderStyles.menuIcon, isDarkMode && ResponderStyles.menuIconDark]}>🚨</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, isDarkMode && ResponderStyles.menuItemTextDark]}>Incidents</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={ResponderStyles.menuItem}
                  onPress={() => handleMenuOption('live-incidents')}
                >
                  <View style={ResponderStyles.menuIconContainer}>
                    <Text style={[ResponderStyles.menuIcon, isDarkMode && ResponderStyles.menuIconDark]}>🔴</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, isDarkMode && ResponderStyles.menuItemTextDark]}>Live Incidents</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={ResponderStyles.menuItem}
                  onPress={() => handleMenuOption('map')}
                >
                  <View style={ResponderStyles.menuIconContainer}>
                    <Text style={[ResponderStyles.menuIcon, isDarkMode && ResponderStyles.menuIconDark]}>🗺️</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, isDarkMode && ResponderStyles.menuItemTextDark]}>Live Map</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={ResponderStyles.menuItem}
                  onPress={() => handleMenuOption('profile')}
                >
                  <View style={ResponderStyles.menuIconContainer}>
                    <Text style={[ResponderStyles.menuIcon, isDarkMode && ResponderStyles.menuIconDark]}>👤</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, isDarkMode && ResponderStyles.menuItemTextDark]}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={ResponderStyles.menuItem}
                  onPress={() => handleMenuOption('reports')}
                >
                  <View style={ResponderStyles.menuIconContainer}>
                    <Text style={[ResponderStyles.menuIcon, isDarkMode && ResponderStyles.menuIconDark]}>📋</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, isDarkMode && ResponderStyles.menuItemTextDark]}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[ResponderStyles.menuItem, ResponderStyles.menuItemLogout]}
                  onPress={() => handleMenuOption('logout')}
                >
                  <View style={[ResponderStyles.menuIconContainer, ResponderStyles.menuIconLogout]}>
                    <Text style={ResponderStyles.menuIconLogoutText}>🚪</Text>
                  </View>
                  <Text style={[ResponderStyles.menuItemText, ResponderStyles.menuItemTextLogout]}>Logout</Text>
                </TouchableOpacity>
              </View>

              <View style={ResponderStyles.menuFooter}>
                <Text style={[ResponderStyles.menuFooterText, isDarkMode && ResponderStyles.menuFooterTextDark]}>
                  ResQMap Responder • {user?.name || "Officer Ahmad"}
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Enhanced Fixed Header Section */}
      <Animated.View 
        style={[
          ResponderStyles.headerSection, 
          isDarkMode && ResponderStyles.headerSectionDark,
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
          style={[ResponderStyles.headerGradient, isDarkMode && ResponderStyles.headerGradientDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={ResponderStyles.headerPattern}>
          {[...Array(20)].map((_, i) => (
            <View 
              key={i}
              style={[
                ResponderStyles.headerPatternDot,
                isDarkMode && ResponderStyles.headerPatternDotDark,
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

        <View style={ResponderStyles.headerContent}>
          <Animated.View 
            style={[
              ResponderStyles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={[ResponderStyles.welcomeText, isDarkMode && ResponderStyles.welcomeTextDark]}>
              Welcome Back,
            </Text>
            <Text style={ResponderStyles.welcomeName}>
              {user?.name || "Officer Alex"} 👮
            </Text>
            <Text style={[ResponderStyles.welcomeSubtitle, isDarkMode && ResponderStyles.welcomeSubtitleDark]}>
              Emergency Responder • Level 8 • Unit 12
            </Text>
          </Animated.View>

          <View style={ResponderStyles.headerControls}>
            <TouchableOpacity 
              style={[ResponderStyles.darkModeToggle, isDarkMode && ResponderStyles.darkModeToggleActive]}
              onPress={toggleDarkMode}
            >
              <View style={[ResponderStyles.toggleKnob, isDarkMode && ResponderStyles.toggleKnobActive]}>
                <Text style={ResponderStyles.toggleIcon}>
                  {isDarkMode ? '🌙' : '☀️'}
                </Text>
              </View>
              <Text style={[ResponderStyles.toggleText, isDarkMode && ResponderStyles.toggleTextDark]}>
                {isDarkMode ? 'Dark' : 'Light'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[ResponderStyles.menuButton, isDarkMode && ResponderStyles.menuButtonDark]}
              onPress={toggleMenu}
            >
              <View style={[ResponderStyles.menuLine, isDarkMode && ResponderStyles.menuLineDark]} />
              <View style={[ResponderStyles.menuLine, isDarkMode && ResponderStyles.menuLineDark]} />
              <View style={[ResponderStyles.menuLine, isDarkMode && ResponderStyles.menuLineDark]} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={ResponderStyles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: false,
            listener: (event: any) => {
              // Save scroll position on scroll
              savedScrollOffset.current = event.nativeEvent.contentOffset.y;
            }
          }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Mission Section */}
        <View style={[ResponderStyles.heroSection, isDarkMode && ResponderStyles.heroSectionDark]}>
          <Image 
            source={require('../assets/images/responder-bg.jpg')}
            style={[ResponderStyles.heroBackgroundImage, isDarkMode && ResponderStyles.heroBackgroundImageDark]}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(26, 21, 18, 0.7)', 'rgba(139, 69, 19, 0.4)', 'rgba(26, 21, 18, 0.8)']
              : ['rgba(255, 255, 255, 0.85)', 'rgba(255, 107, 53, 0.15)', 'rgba(255, 255, 255, 0.9)']
            }
            style={[ResponderStyles.heroOverlay, isDarkMode && ResponderStyles.heroOverlayDark]}
          />

          <View style={ResponderStyles.heroParticlesContainer}>
            {[...Array(15)].map((_, i) => (
              <View 
                key={i}
                style={[
                  ResponderStyles.heroParticle,
                  isDarkMode ? ResponderStyles.heroParticleDark : ResponderStyles.heroParticleLight,
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
              ResponderStyles.heroContent,
              {
                opacity: heroTextAnim,
                transform: [{ translateY: heroSlideInterpolate }]
              }
            ]}
          >
            <Animated.View 
              style={[
                ResponderStyles.missionIconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={ResponderStyles.missionIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={ResponderStyles.missionIconInner}>
                  <Text style={ResponderStyles.missionEmoji}>🚨</Text>
                </View>
              </LinearGradient>
              <View style={ResponderStyles.missionIconGlow} />
            </Animated.View>

            <View style={ResponderStyles.missionTextContainer}>
              <Text style={[ResponderStyles.missionTagline, isDarkMode && ResponderStyles.missionTaglineDark]}>
                Emergency Response Team
              </Text>
              <Text style={[ResponderStyles.missionText, isDarkMode && ResponderStyles.missionTextDark]}>
                <Text style={ResponderStyles.missionAccent}>ResQMap Responder</Text> connects you with real-time incidents for faster emergency response
              </Text>
            </View>

            <View style={[ResponderStyles.missionStats, isDarkMode && ResponderStyles.missionStatsDark]}>
              <View style={ResponderStyles.heroStatItem}>
                <Text style={[ResponderStyles.heroStatNumber, isDarkMode && ResponderStyles.heroStatNumberDark]}>24/7</Text>
                <Text style={[ResponderStyles.heroStatLabel, isDarkMode && ResponderStyles.heroStatLabelDark]}>Active</Text>
              </View>
              <View style={ResponderStyles.statDivider} />
              <View style={ResponderStyles.heroStatItem}>
                <Text style={[ResponderStyles.heroStatNumber, isDarkMode && ResponderStyles.heroStatNumberDark]}>3</Text>
                <Text style={[ResponderStyles.heroStatLabel, isDarkMode && ResponderStyles.heroStatLabelDark]}>Active Incidents</Text>
              </View>
              <View style={ResponderStyles.statDivider} />
              <View style={ResponderStyles.heroStatItem}>
                <Text style={[ResponderStyles.heroStatNumber, isDarkMode && ResponderStyles.heroStatNumberDark]}>98%</Text>
                <Text style={[ResponderStyles.heroStatLabel, isDarkMode && ResponderStyles.heroStatLabelDark]}>Response Rate</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[ResponderStyles.heroCTA, isDarkMode && ResponderStyles.heroCTADark]}
              onPress={handleViewIncidents}
            >
              <Text style={ResponderStyles.heroCTAText}>View Emergency Alerts</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Live Incidents Header Section */}
        <View style={ResponderStyles.sectionHeaderContainer}>
          <View style={ResponderStyles.sectionHeaderContent}>
            <Text style={[ResponderStyles.sectionHeaderTitle, isDarkMode && ResponderStyles.sectionHeaderTitleDark]}>
              Live Incidents
            </Text>
            <Text style={[ResponderStyles.sectionHeaderSubtitle, isDarkMode && ResponderStyles.sectionHeaderSubtitleDark]}>
              View and respond to real-time emergency incidents
            </Text>
          </View>
          <View style={ResponderStyles.sectionHeaderIcon}>
            <Text style={ResponderStyles.sectionHeaderIconText}>🔴</Text>
          </View>
        </View>

        {/* Live Incidents Card */}
        <Animated.View 
          style={[
            ResponderStyles.enhancedCardContainer,
            isDarkMode && ResponderStyles.enhancedCardContainerDark,
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
            style={ResponderStyles.enhancedCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.cardPatternOverlay}>
            {[...Array(8)].map((_, i) => (
              <View 
                key={i}
                style={[
                  ResponderStyles.cardPatternCircle,
                  isDarkMode && ResponderStyles.cardPatternCircleDark,
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
            style={ResponderStyles.cardBorderGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.enhancedCardContent}>
            <View style={ResponderStyles.enhancedCardHeader}>
              <View style={[ResponderStyles.enhancedCardBadge, isDarkMode && ResponderStyles.enhancedCardBadgeDark]}>
                <Text style={ResponderStyles.enhancedCardBadgeText}>🔴 LIVE NOW</Text>
              </View>
              <View style={ResponderStyles.enhancedCardIconContainer}>
                <LinearGradient
                  colors={['#FF6B35', '#FF8E35']}
                  style={ResponderStyles.enhancedCardIconGradient}
                >
                  <Text style={ResponderStyles.enhancedCardIcon}>🔴</Text>
                </LinearGradient>
              </View>
            </View>
            
            <View style={ResponderStyles.enhancedCardMain}>
              <Text style={[ResponderStyles.enhancedCardTitle, isDarkMode && ResponderStyles.enhancedCardTitleDark]}>
                Real-time Incident Monitor
              </Text>
              
              <Text style={[ResponderStyles.enhancedCardDescription, isDarkMode && ResponderStyles.enhancedCardDescriptionDark]}>
                View all active emergency incidents in real-time. Monitor live updates, track responder positions, and pick incidents to respond to immediately.
              </Text>
              
              <View style={ResponderStyles.enhancedFeaturesRow}>
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>🕒</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Real-time Updates
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>📍</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Live Tracking
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>📊</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Status Updates
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[ResponderStyles.enhancedActionButton, isDarkMode && ResponderStyles.enhancedActionButtonDark]}
              onPress={handleLiveIncidents}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={ResponderStyles.enhancedActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={ResponderStyles.enhancedActionButtonContent}>
                  <Text style={ResponderStyles.enhancedActionButtonText}>
                    View Live Incidents
                  </Text>
                  <View style={ResponderStyles.enhancedActionButtonIcon}>
                    <Text style={ResponderStyles.enhancedActionButtonIconText}>🔴</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={ResponderStyles.liveIncidentsCount}>
              <View style={ResponderStyles.liveDot} />
              <Text style={[ResponderStyles.liveIncidentsCountText, isDarkMode && ResponderStyles.liveIncidentsCountTextDark]}>
                12 active incidents • Updated in real-time
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Active Incidents Header Section */}
        <View style={ResponderStyles.sectionHeaderContainer}>
          <View style={ResponderStyles.sectionHeaderContent}>
            <Text style={[ResponderStyles.sectionHeaderTitle, isDarkMode && ResponderStyles.sectionHeaderTitleDark]}>
              Assigned Incidents
            </Text>
            <Text style={[ResponderStyles.sectionHeaderSubtitle, isDarkMode && ResponderStyles.sectionHeaderSubtitleDark]}>
              Monitor and respond to assigned incidents
            </Text>
          </View>
          <View style={ResponderStyles.sectionHeaderIcon}>
            <Text style={ResponderStyles.sectionHeaderIconText}>🚨</Text>
          </View>
        </View>

        {/* Active Incidents Card */}
        <Animated.View 
          style={[
            ResponderStyles.enhancedCardContainer,
            isDarkMode && ResponderStyles.enhancedCardContainerDark,
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
            style={ResponderStyles.enhancedCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.cardPatternOverlay}>
            {[...Array(8)].map((_, i) => (
              <View 
                key={i}
                style={[
                  ResponderStyles.cardPatternCircle,
                  isDarkMode && ResponderStyles.cardPatternCircleDark,
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
            style={ResponderStyles.cardBorderGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.enhancedCardContent}>
            <View style={ResponderStyles.enhancedCardHeader}>
              <View style={[ResponderStyles.enhancedCardBadge, isDarkMode && ResponderStyles.enhancedCardBadgeDark]}>
                <Text style={ResponderStyles.enhancedCardBadgeText}>🚑 PRIORITY</Text>
              </View>
              <View style={ResponderStyles.enhancedCardIconContainer}>
                <LinearGradient
                  colors={['#FF6B35', '#FF8E35']}
                  style={ResponderStyles.enhancedCardIconGradient}
                />
              </View>
            </View>
            
            <View style={ResponderStyles.enhancedCardMain}>
              <Text style={[ResponderStyles.enhancedCardTitle, isDarkMode && ResponderStyles.enhancedCardTitleDark]}>
                Manage Assigned Incidents
              </Text>
              
              <Text style={[ResponderStyles.enhancedCardDescription, isDarkMode && ResponderStyles.enhancedCardDescriptionDark]}>
                Access real-time assigned incident reports, assign resources, and coordinate emergency response activities efficiently.
              </Text>
              
              <View style={ResponderStyles.enhancedFeaturesRow}>
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>🚨</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Live Alerts
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>🗺️</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Live Map
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>📋</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Assign Tasks
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[ResponderStyles.enhancedActionButton, isDarkMode && ResponderStyles.enhancedActionButtonDark]}
              onPress={handleViewIncidents}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={ResponderStyles.enhancedActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={ResponderStyles.enhancedActionButtonContent}>
                  <Text style={ResponderStyles.enhancedActionButtonText}>
                    View Assigned Incidents
                  </Text>
                  <View style={ResponderStyles.enhancedActionButtonIcon}>
                    <Text style={ResponderStyles.enhancedActionButtonIconText}>🚨</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={[ResponderStyles.enhancedCardFooter, isDarkMode && ResponderStyles.enhancedCardFooterDark]}>
              Priority incidents require immediate attention • 24/7 monitoring
            </Text>
          </View>
        </Animated.View>

        {/* Report Incident Section */}
        <View style={ResponderStyles.sectionHeaderContainer}>
          <View style={ResponderStyles.sectionHeaderContent}>
            <Text style={[ResponderStyles.sectionHeaderTitle, isDarkMode && ResponderStyles.sectionHeaderTitleDark]}>
              Report Incident
            </Text>
            <Text style={[ResponderStyles.sectionHeaderSubtitle, isDarkMode && ResponderStyles.sectionHeaderSubtitleDark]}>
              Submit new incident reports as a responder
            </Text>
          </View>
          <View style={ResponderStyles.sectionHeaderIcon}>
            <Text style={ResponderStyles.sectionHeaderIconText}>📋</Text>
          </View>
        </View>

        {/* Report Incident Card */}
        <Animated.View 
          style={[
            ResponderStyles.enhancedCardContainer,
            isDarkMode && ResponderStyles.enhancedCardContainerDark,
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
            style={ResponderStyles.enhancedCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.cardPatternOverlay}>
            {[...Array(8)].map((_, i) => (
              <View 
                key={i}
                style={[
                  ResponderStyles.cardPatternCircle,
                  isDarkMode && ResponderStyles.cardPatternCircleDark,
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
            style={ResponderStyles.cardBorderGlow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          
          <View style={ResponderStyles.enhancedCardContent}>
            <View style={ResponderStyles.enhancedCardHeader}>
              <View style={[ResponderStyles.enhancedCardBadge, isDarkMode && ResponderStyles.enhancedCardBadgeDark]}>
                <Text style={ResponderStyles.enhancedCardBadgeText}>🚨 URGENT</Text>
              </View>
              <View style={ResponderStyles.enhancedCardIconContainer}>
                <LinearGradient
                  colors={['#FF6B35', '#FF8E35']}
                  style={ResponderStyles.enhancedCardIconGradient}
                />
              </View>
            </View>
            
            <View style={ResponderStyles.enhancedCardMain}>
              <Text style={[ResponderStyles.enhancedCardTitle, isDarkMode && ResponderStyles.enhancedCardTitleDark]}>
                Report New Incident
              </Text>
              
              <Text style={[ResponderStyles.enhancedCardDescription, isDarkMode && ResponderStyles.enhancedCardDescriptionDark]}>
                As a responder, you can submit detailed incident reports with photos, location, and incident information to coordinate faster response.
              </Text>
              
              <View style={ResponderStyles.enhancedFeaturesRow}>
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>📸</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Photo Evidence
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>📍</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Precise Location
                  </Text>
                </View>
                
                <View style={[ResponderStyles.enhancedFeature, isDarkMode && ResponderStyles.enhancedFeatureDark]}>
                  <View style={[ResponderStyles.enhancedFeatureIcon, isDarkMode && ResponderStyles.enhancedFeatureIconDark]}>
                    <Text style={ResponderStyles.enhancedFeatureIconText}>⚡</Text>
                  </View>
                  <Text style={[ResponderStyles.enhancedFeatureLabel, isDarkMode && ResponderStyles.enhancedFeatureLabelDark]}>
                    Priority Response
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[ResponderStyles.enhancedActionButton, isDarkMode && ResponderStyles.enhancedActionButtonDark]}
              onPress={handleSubmitIncident}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35', '#FFA235']}
                style={ResponderStyles.enhancedActionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={ResponderStyles.enhancedActionButtonContent}>
                  <Text style={ResponderStyles.enhancedActionButtonText}>
                    Report Incident Now
                  </Text>
                  <View style={ResponderStyles.enhancedActionButtonIcon}>
                    <Text style={ResponderStyles.enhancedActionButtonIconText}>🚀</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={[ResponderStyles.enhancedCardFooter, isDarkMode && ResponderStyles.enhancedCardFooterDark]}>
              Responder reports are prioritized for immediate action
            </Text>
          </View>
        </Animated.View>

        {/* Response Features Section Header */}
        <View style={ResponderStyles.sectionHeaderContainer}>
          <View style={ResponderStyles.sectionHeaderContent}>
            <Text style={[ResponderStyles.sectionHeaderTitle, isDarkMode && ResponderStyles.sectionHeaderTitleDark]}>
              Response Capabilities
            </Text>
            <Text style={[ResponderStyles.sectionHeaderSubtitle, isDarkMode && ResponderStyles.sectionHeaderSubtitleDark]}>
              Advanced tools for emergency response coordination
            </Text>
          </View>
        </View>

        {/* Responsive Features Section */}
        <View style={[ResponderStyles.featuresSectionWithImage, isDarkMode && ResponderStyles.featuresSectionWithImageDark]}>
          
          <View style={ResponderStyles.featuresLeftColumn}>
            <View style={[ResponderStyles.featuresImageWrapper, isDarkMode && ResponderStyles.featuresImageWrapperDark]}>
              <Image 
                source={isDarkMode 
                  ? require('../assets/images/responder-features-dark.png')
                  : require('../assets/images/responder-features-light.png')
                }
                style={ResponderStyles.featuresImage}
                resizeMode="cover"
              />
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

          <View style={[ResponderStyles.featuresRightColumn, isDarkMode && ResponderStyles.featuresRightColumnDark]}>
            
            <Image 
              source={isDarkMode 
                ? require('../assets/images/responder-features-bg-dark.jpg')
                : require('../assets/images/responder-features-bg-light.jpg')
              }
              style={ResponderStyles.featuresBackgroundImage}
              resizeMode="cover"
            />
            
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
            
            <View style={ResponderStyles.featuresHeader}>
              <Text style={ResponderStyles.featuresTagline}>EMERGENCY TOOLS</Text>
              <Text style={[ResponderStyles.featuresTitle, isDarkMode && ResponderStyles.featuresTitleDark]}>
                Rapid Response Coordination
              </Text>
              <Text style={[ResponderStyles.featuresSubtitle, isDarkMode && ResponderStyles.featuresSubtitleDark]}>
                Our comprehensive suite of features empowers emergency responders to coordinate faster and more effective incident responses
              </Text>
            </View>

            <View style={ResponderStyles.featuresContentGrid}>
              {responderFeaturesData.map((feature) => (
                <TouchableOpacity 
                  key={feature.id}
                  style={[
                    hoveredFeature === feature.id ? ResponderStyles.featuresContentItemHovered : ResponderStyles.featuresContentItem,
                    isDarkMode && ResponderStyles.featuresContentItemDark,
                    hoveredFeature === feature.id && isDarkMode && ResponderStyles.featuresContentItemHoveredDark
                  ]}
                  activeOpacity={0.9}
                  onPressIn={() => setHoveredFeature(feature.id)}
                  onPressOut={() => setHoveredFeature(null)}
                  onPress={() => handleFeaturePress(feature.id)}
                >
                  <View style={[ResponderStyles.featuresContentIconContainer, isDarkMode && ResponderStyles.featuresContentIconContainerDark]}>
                    <Text style={ResponderStyles.featuresContentIcon}>{feature.icon}</Text>
                  </View>
                  <View style={ResponderStyles.featuresContentTextContainer}>
                    <Text style={[ResponderStyles.featuresContentTitle, isDarkMode && ResponderStyles.featuresContentTitleDark]}>
                      {feature.title}
                    </Text>
                    <Text style={[ResponderStyles.featuresContentDescription, isDarkMode && ResponderStyles.featuresContentDescriptionDark]}>
                      {feature.description}
                    </Text>
                  </View>
                  <Text style={{ color: '#FF6B35', fontSize: 20, marginLeft: 8 }}>→</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </View>

        {/* Response Impact Section Header */}
        <View style={ResponderStyles.sectionHeaderContainer}>
          <View style={ResponderStyles.sectionHeaderContent}>
            <Text style={[ResponderStyles.sectionHeaderTitle, isDarkMode && ResponderStyles.sectionHeaderTitleDark]}>
              Response Impact
            </Text>
            <Text style={[ResponderStyles.sectionHeaderSubtitle, isDarkMode && ResponderStyles.sectionHeaderSubtitleDark]}>
              Your contribution to community safety
            </Text>
          </View>
        </View>

        {/* Enhanced Response Stats Section */}
        <View style={[ResponderStyles.statsSection, isDarkMode && ResponderStyles.statsSectionDark]}>
          {!isDarkMode && (
            <View style={ResponderStyles.statsBackgroundShade} />
          )}
          
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(26, 21, 18, 0.95)', 'rgba(139, 69, 19, 0.85)', 'rgba(26, 21, 18, 0.9)']
              : ['rgba(255, 255, 255, 0.95)', 'rgba(250, 251, 252, 0.98)']
            }
            style={[ResponderStyles.statsGradient, isDarkMode && ResponderStyles.statsGradientDark]}
          >
            <View style={ResponderStyles.statsGrid}>
              <View style={[ResponderStyles.statsCard, isDarkMode && ResponderStyles.statsCardDark]}>
                <View style={[ResponderStyles.statsIconContainer, isDarkMode && ResponderStyles.statsIconContainerDark]}>
                  <Text style={ResponderStyles.statsIcon}>📈</Text>
                </View>
                <Text style={[ResponderStyles.statsNumber, isDarkMode && ResponderStyles.statsNumberDark]}>
                  1,254
                </Text>
                <Text style={[ResponderStyles.statsLabel, isDarkMode && ResponderStyles.statsLabelDark]}>
                  Incidents Responded
                </Text>
              </View>
              
              <View style={[ResponderStyles.statsCard, isDarkMode && ResponderStyles.statsCardDark]}>
                <View style={[ResponderStyles.statsIconContainer, isDarkMode && ResponderStyles.statsIconContainerDark]}>
                  <Text style={ResponderStyles.statsIcon}>⚡</Text>
                </View>
                <Text style={[ResponderStyles.statsNumber, isDarkMode && ResponderStyles.statsNumberDark]}>
                  98.2%
                </Text>
                <Text style={[ResponderStyles.statsLabel, isDarkMode && ResponderStyles.statsLabelDark]}>
                  Response Rate
                </Text>
              </View>
              
              <View style={[ResponderStyles.statsCard, isDarkMode && ResponderStyles.statsCardDark]}>
                <View style={[ResponderStyles.statsIconContainer, isDarkMode && ResponderStyles.statsIconContainerDark]}>
                  <Text style={ResponderStyles.statsIcon}>⏱️</Text>
                </View>
                <Text style={[ResponderStyles.statsNumber, isDarkMode && ResponderStyles.statsNumberDark]}>
                  5.2 min
                </Text>
                <Text style={[ResponderStyles.statsLabel, isDarkMode && ResponderStyles.statsLabelDark]}>
                  Avg. Response Time
                </Text>
              </View>
              
              <View style={[ResponderStyles.statsCard, isDarkMode && ResponderStyles.statsCardDark]}>
                <View style={[ResponderStyles.statsIconContainer, isDarkMode && ResponderStyles.statsIconContainerDark]}>
                  <Text style={ResponderStyles.statsIcon}>😊</Text>
                </View>
                <Text style={[ResponderStyles.statsNumber, isDarkMode && ResponderStyles.statsNumberDark]}>
                  96%
                </Text>
                <Text style={[ResponderStyles.statsLabel, isDarkMode && ResponderStyles.statsLabelDark]}>
                  Citizen Satisfaction
                </Text>
              </View>
            </View>

            <View style={[ResponderStyles.statsFooter, isDarkMode && ResponderStyles.statsFooterDark]}>
              <Text style={[ResponderStyles.statsFooterText, isDarkMode && ResponderStyles.statsFooterTextDark]}>
                Last updated: Today • Real-time monitoring
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={ResponderStyles.navBarBlur}>
        <View style={[ResponderStyles.navBar, isDarkMode && ResponderStyles.navBarDark]}>
          <TouchableOpacity 
            style={ResponderStyles.navItem}
            onPress={() => handleNavbarNavigation('homepage')}
          >
            <Animated.View 
              style={[
                ResponderStyles.navIconContainer,
                ResponderStyles.navIconContainerActive,
                { transform: [{ translateY: bounceAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E35']}
                style={ResponderStyles.navIconGradient}
              >
                <Text style={ResponderStyles.navIcon}>🏠</Text>
              </LinearGradient>
            </Animated.View>
            <Text style={[ResponderStyles.navText, ResponderStyles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={ResponderStyles.navItem}
            onPress={() => handleNavbarNavigation('incidents')}
          >
            <View style={[ResponderStyles.navIconContainer, ResponderStyles.navIconContainerInactive]}>
              <Text style={[ResponderStyles.navIcon, ResponderStyles.navIconInactive]}>🚨</Text>
            </View>
            <Text style={[ResponderStyles.navText, ResponderStyles.navTextInactive]}>Incidents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={ResponderStyles.navItem}
            onPress={() => handleNavbarNavigation('map')}
          >
            <View style={[ResponderStyles.navIconContainer, ResponderStyles.navIconContainerInactive]}>
              <Text style={[ResponderStyles.navIcon, ResponderStyles.navIconInactive]}>🗺️</Text>
            </View>
            <Text style={[ResponderStyles.navText, ResponderStyles.navTextInactive]}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={ResponderStyles.navItem}
            onPress={() => handleNavbarNavigation('profile')}
          >
            <View style={[ResponderStyles.navIconContainer, ResponderStyles.navIconContainerInactive]}>
              <Text style={[ResponderStyles.navIcon, ResponderStyles.navIconInactive]}>👤</Text>
            </View>
            <Text style={[ResponderStyles.navText, ResponderStyles.navTextInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}