import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useRouter } from "expo-router";

import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/services/api";
import { ProfileStyles } from "../styles/ProfileStyles";

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth() as {
    user: { id: string; email: string; name?: string };
    updateUser: (fields: Partial<{ id: string; email: string; name: string }>) => void;
    logout: () => void;
  };
  
  const router = useRouter();
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showEmailMessage, setShowEmailMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(60))[0];
  const buttonScaleAnim = useState(new Animated.Value(0))[0];
  const titleSlideAnim = useState(new Animated.Value(-50))[0];
  const themeSwitchAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!fontsLoaded) return;

    // Staggered animations
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fontsLoaded]);

  /* ------------------ FETCH PROFILE ------------------- */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/profile/${userId}`);
      const p = res.data.user;

      setProfile(p);
      setName(p.name || "");

      setLoading(false);
    } catch (err) {
      console.log("PROFILE FETCH ERROR:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ------------------ UPDATE PROFILE ------------------- */
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const res = await api.put(`/profile/${userId}`, {
        name,
      });

      setUpdating(false);

      if (res.data.success) {
        updateUser({ name });
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      setUpdating(false);
      Alert.alert("Error", "Could not update profile");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If already editing, cancel and revert changes
      setName(profile?.name || "");
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const toggleTheme = () => {
    Animated.timing(themeSwitchAnim, {
      toValue: isDarkTheme ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsDarkTheme(!isDarkTheme);
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const handleEmailPress = () => {
    setShowEmailMessage(true);
    setTimeout(() => {
      setShowEmailMessage(false);
    }, 3000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            logout();
            router.replace("/login");
          }
        }
      ]
    );
  };

  if (loading && !profile) {
    return (
      <View style={[ProfileStyles.center, isDarkTheme ? ProfileStyles.container : ProfileStyles.containerLight]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={[ProfileStyles.center, isDarkTheme ? ProfileStyles.container : ProfileStyles.containerLight]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={isDarkTheme ? ProfileStyles.container : ProfileStyles.containerLight}>
      {/* Background Image */}
      {isDarkTheme ? (
        <Image
          source={require('../assets/images/bg-image1.jpg')}
          style={ProfileStyles.backgroundImage}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../assets/images/bg-image-light.jpg')}
          style={ProfileStyles.backgroundImageLight}
          resizeMode="cover"
        />
      )}
      
      {/* Background Overlay */}
      <View style={[
        ProfileStyles.backgroundOverlay,
        isDarkTheme ? ProfileStyles.backgroundOverlayDark : ProfileStyles.backgroundOverlayLight
      ]} />

      {/* Theme Toggle */}
      <Animated.View 
        style={[
          ProfileStyles.themeToggleContainer,
          {
            transform: [
              {
                rotate: themeSwitchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            ProfileStyles.themeToggle,
            isDarkTheme ? ProfileStyles.themeToggleDark : ProfileStyles.themeToggleLight
          ]}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDarkTheme ? "moon" : "sunny"} 
            size={24} 
            color={isDarkTheme ? "#FF6B35" : "#FF6B35"} 
          />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={ProfileStyles.scrollView}
        contentContainerStyle={ProfileStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            ProfileStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: titleSlideAnim }]
            }
          ]}
        >
          <Text style={[
            ProfileStyles.welcomeText,
            isDarkTheme ? ProfileStyles.welcomeTextDark : ProfileStyles.welcomeTextLight
          ]}>USER PROFILE</Text>
          
          <View style={ProfileStyles.titleContainer}>
            <Text style={[
              ProfileStyles.title,
              isDarkTheme ? ProfileStyles.titleDark : ProfileStyles.titleLight
            ]}>
              My<Text style={ProfileStyles.titleAccent}>Profile</Text>
            </Text>
          </View>
          
          <Text style={[
            ProfileStyles.subtitle,
            isDarkTheme ? ProfileStyles.subtitleDark : ProfileStyles.subtitleLight
          ]}>View and manage your account information</Text>
        </Animated.View>

        {/* Profile Section */}
        <Animated.View 
          style={[
            ProfileStyles.profileSection,
            isDarkTheme ? ProfileStyles.profileSectionDark : ProfileStyles.profileSectionLight,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          {/* Profile Header */}
          <View style={ProfileStyles.profileHeader}>
            <View style={ProfileStyles.avatarContainer}>
              <View style={[
                ProfileStyles.avatarPlaceholder,
                isDarkTheme ? ProfileStyles.avatarPlaceholderDark : ProfileStyles.avatarPlaceholderLight
              ]}>
                <Ionicons 
                  name="person" 
                  size={48} 
                  color={isDarkTheme ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 107, 53, 0.5)"} 
                />
              </View>
            </View>

            <Text style={[
              ProfileStyles.profileName,
              isDarkTheme ? ProfileStyles.profileNameDark : ProfileStyles.profileNameLight
            ]}>
              {profile?.name || 'User Name'}
            </Text>
            <Text style={[
              ProfileStyles.profileEmail,
              isDarkTheme ? ProfileStyles.profileEmailDark : ProfileStyles.profileEmailLight
            ]}>
              {profile?.email || 'user@example.com'}
            </Text>
          </View>

          {/* Edit Toggle Button */}
          <TouchableOpacity 
            style={[
              styles.editButton,
              isDarkTheme ? styles.editButtonDark : styles.editButtonLight
            ]}
            onPress={handleEditToggle}
          >
            <Ionicons 
              name={isEditing ? "close-circle" : "create"} 
              size={20} 
              color={isDarkTheme ? "#FFFFFF" : "#FF6B35"} 
              style={{ marginRight: 8 }}
            />
            <Text style={[
              styles.editButtonText,
              isDarkTheme ? styles.editButtonTextDark : styles.editButtonTextLight
            ]}>
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          {/* Profile Form */}
          <View style={ProfileStyles.formContainer}>
            <Text style={[
              ProfileStyles.formTitle,
              isDarkTheme ? ProfileStyles.formTitleDark : ProfileStyles.formTitleLight
            ]}>
              Profile Information
            </Text>

            {/* Name Field */}
            <View style={ProfileStyles.inputContainer}>
              <Text style={[
                ProfileStyles.inputLabel,
                isDarkTheme ? ProfileStyles.inputLabelDark : ProfileStyles.inputLabelLight
              ]}>
                Full Name
              </Text>
              <View style={ProfileStyles.inputWrapper}>
                {isEditing ? (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={[
                      ProfileStyles.input,
                      isDarkTheme ? ProfileStyles.inputDark : ProfileStyles.inputLight,
                      focusedInput === 'name' && (isDarkTheme ? ProfileStyles.inputFocusedDark : ProfileStyles.inputFocusedLight)
                    ]}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    onFocus={() => handleInputFocus('name')}
                    onBlur={handleInputBlur}
                    autoFocus={true}
                  />
                ) : (
                  <View style={[
                    ProfileStyles.displayField,
                    isDarkTheme ? ProfileStyles.displayFieldDark : ProfileStyles.displayFieldLight
                  ]}>
                    <Text style={[
                      ProfileStyles.displayText,
                      isDarkTheme ? ProfileStyles.displayTextDark : ProfileStyles.displayTextLight
                    ]}>
                      {profile?.name || 'Not set'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Email Field */}
            <View style={ProfileStyles.inputContainer}>
              <Text style={[
                ProfileStyles.inputLabel,
                isDarkTheme ? ProfileStyles.inputLabelDark : ProfileStyles.inputLabelLight
              ]}>
                Email Address
              </Text>
              <View style={ProfileStyles.inputWrapper}>
                <TouchableOpacity 
                  onPress={handleEmailPress}
                  activeOpacity={0.7}
                >
                  <View pointerEvents="none">
                    <View style={[
                      ProfileStyles.displayField,
                      isDarkTheme ? ProfileStyles.displayFieldDark : ProfileStyles.displayFieldLight
                    ]}>
                      <Text style={[
                        ProfileStyles.displayText,
                        isDarkTheme ? ProfileStyles.displayTextDark : ProfileStyles.displayTextLight
                      ]}>
                        {profile?.email || 'user@example.com'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {showEmailMessage && (
                <Text style={[
                  styles.emailMessage,
                  isDarkTheme ? styles.emailMessageDark : styles.emailMessageLight
                ]}>
                  Email address cannot be changed
                </Text>
              )}
            </View>

            {/* Update Button (only shows when editing) */}
            {isEditing && (
              <View style={ProfileStyles.actionButtonsContainer}>
                <Animated.View 
                  style={[
                    ProfileStyles.primaryButton,
                    {
                      transform: [{ scale: buttonScaleAnim }],
                      opacity: buttonScaleAnim,
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={{ width: '100%', alignItems: 'center' }}
                    onPress={handleUpdate}
                    disabled={updating}
                  >
                    {updating ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="save-outline" size={24} color="#FFFFFF" style={{ marginBottom: 8 }} />
                        <Text style={ProfileStyles.primaryButtonText}>Save Changes</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[
              ProfileStyles.secondaryButton,
              isDarkTheme ? ProfileStyles.secondaryButtonDark : ProfileStyles.secondaryButtonLight,
              styles.logoutButton
            ]}
            onPress={handleLogout}
          >
            <Ionicons 
              name="log-out-outline" 
              size={20} 
              color={isDarkTheme ? "rgba(255, 255, 255, 0.9)" : "#FF6B35"} 
              style={{ marginRight: 8 }}
            />
            <Text style={[
              ProfileStyles.secondaryButtonText,
              isDarkTheme ? ProfileStyles.secondaryButtonTextDark : ProfileStyles.secondaryButtonTextLight
            ]}>
              Logout
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  editButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    alignSelf: 'center' as const,
    marginBottom: 20,
    marginTop: 10,
  },
  editButtonDark: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonLight: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  editButtonTextDark: {
    color: '#FFFFFF',
  },
  editButtonTextLight: {
    color: '#FF6B35',
  },
  emailMessage: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  emailMessageDark: {
    color: '#FF6B35',
  },
  emailMessageLight: {
    color: '#FF6B35',
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 10,
  },
});