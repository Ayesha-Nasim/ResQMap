import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Pressable, 
  ActivityIndicator,
  ScrollView,
  Animated,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { api } from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";
import { useGoogleAuth } from "../../src/services/googleAuth";
import { LoginStyles } from "../../styles/LoginStyles";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { loginWithGoogle } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Validation states - start with empty errors
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  });

  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(60))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const titleSlideAnim = useState(new Animated.Value(-50))[0];
  const formSlideAnim = useState(new Animated.Value(50))[0];
  const buttonScaleAnim = useState(new Animated.Value(0))[0];
  const glowAnim = useState(new Animated.Value(0))[0];
  const inputFocusAnim = useState(new Animated.Value(0))[0];
  const themeSwitchAnim = useState(new Animated.Value(0))[0];
  const formGlowAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!fontsLoaded) return;
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
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(formGlowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    if (!isDarkTheme) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(formGlowAnim, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(formGlowAnim, {
            toValue: 0.4,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

  }, [fontsLoaded, isDarkTheme]);

  // Validate form whenever email or password changes
  useEffect(() => {
    validateForm();
  }, [email, password, touchedFields]);

  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    
    if (email.length > 100) {
      return "Email too long";
    }
    
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password.trim()) {
      return "Password is required";
    }
    
    if (password.length < 8) {
      return "At least 8 characters";
    }
    
    if (password.length > 50) {
      return "Password too long";
    }
    
    return "";
  };

  const validateForm = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    // Only show errors for touched fields with content
    setEmailError(touchedFields.email && emailValidation !== "" ? emailValidation : "");
    setPasswordError(touchedFields.password && passwordValidation !== "" ? passwordValidation : "");
    
    setIsFormValid(
      emailValidation === "" && 
      passwordValidation === "" && 
      email.trim() !== "" && 
      password.trim() !== ""
    );
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    
    // Only show validation errors if field has been touched and has content
    if (touchedFields.email && text !== "") {
      const error = validateEmail(text);
      setEmailError(error);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    
    // Only show validation errors if field has been touched and has content
    if (touchedFields.password && text !== "") {
      const error = validatePassword(text);
      setPasswordError(error);
    }
  };

  const handleFieldBlur = (fieldName: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Only validate if field has content
    if (fieldName === 'email') {
      const error = validateEmail(email);
      setEmailError(error);
    } else if (fieldName === 'password') {
      const error = validatePassword(password);
      setPasswordError(error);
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

  const handleLogin = async () => {
    // Mark all fields as touched to show all errors on submit
    setTouchedFields({
      email: true,
      password: true
    });
    
    // Validate all fields
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    // Show all errors on submit
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    
    if (emailValidation || passwordValidation) {
      Alert.alert(
        "Please fix errors",
        "Check the form for errors before logging in.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (!isFormValid) {
      Alert.alert(
        "Form incomplete",
        "Please fill in all required fields.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.error || "Login failed";
        Alert.alert("Login Error", errorMessage);
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const idToken = await loginWithGoogle();

    if (!idToken) {
      alert("Google login failed");
      setGoogleLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/google", { token: idToken });
      login(res.data.user, res.data.token);
      router.replace("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Google authentication error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
    Animated.timing(inputFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
    Animated.timing(inputFocusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const FeatureItem = ({ emoji, text, delay }: { emoji: string; text: string; delay: number }) => {
    const featureAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
      setTimeout(() => {
        Animated.spring(featureAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }, delay);
    }, []);

    return (
      <Animated.View 
        style={[
          LoginStyles.featureItem,
          {
            opacity: featureAnim,
            transform: [
              { scale: featureAnim },
              {
                translateY: featureAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={LoginStyles.featureIconContainer}>
          <Text style={LoginStyles.featureIcon}>{emoji}</Text>
        </View>
        <Text style={[
          LoginStyles.featureText,
          isDarkTheme ? LoginStyles.featureTextDark : LoginStyles.featureTextLight
        ]}>{text}</Text>
      </Animated.View>
    );
  };

  const FloatingParticle = ({ size, left, top, delay, duration }: any) => {
    const opacityAnim = useState(new Animated.Value(0))[0];
    const translateYAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(translateYAnim, {
              toValue: -40,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, []);

    return (
      <Animated.View
        style={[
          LoginStyles.particle,
          isDarkTheme ? LoginStyles.particleDark : LoginStyles.particleLight,
          {
            width: size,
            height: size,
            left: `${left}%`,
            top: `${top}%`,
            opacity: opacityAnim,
            transform: [
              { translateY: translateYAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      />
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0B0E' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={isDarkTheme ? LoginStyles.container : LoginStyles.containerLight}>
      {/* Background Image - Different for each theme */}
      {isDarkTheme ? (
        <Image
          source={require('../../assets/images/bg-image1.jpg')}
          style={LoginStyles.backgroundImage}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../../assets/images/bg-image-light.jpg')}
          style={LoginStyles.backgroundImageLight}
          resizeMode="cover"
        />
      )}
      
      {/* Background Overlay */}
      <View style={[
        LoginStyles.backgroundOverlay,
        isDarkTheme ? LoginStyles.backgroundOverlayDark : LoginStyles.backgroundOverlayLight
      ]} />

      {/* Floating Particles */}
      <View style={LoginStyles.floatingParticles}>
        <FloatingParticle size={8} left={10} top={20} delay={0} duration={3000} />
        <FloatingParticle size={12} left={85} top={30} delay={500} duration={3500} />
        <FloatingParticle size={6} left={15} top={70} delay={1000} duration={4000} />
        <FloatingParticle size={10} left={90} top={80} delay={1500} duration={3200} />
        <FloatingParticle size={7} left={70} top={40} delay={2000} duration={3800} />
        <FloatingParticle size={9} left={25} top={50} delay={2500} duration={3600} />
      </View>

      {/* Theme Toggle */}
      <Animated.View 
        style={[
          LoginStyles.themeToggleContainer,
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
            LoginStyles.themeToggle,
            isDarkTheme ? LoginStyles.themeToggleDark : LoginStyles.themeToggleLight
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
        contentContainerStyle={LoginStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={LoginStyles.content}>
          
          {/* Header Section */}
          <Animated.View 
            style={[
              LoginStyles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleSlideAnim }]
              }
            ]}
          >
            <Text style={[
              LoginStyles.welcomeText,
              isDarkTheme ? LoginStyles.welcomeTextDark : LoginStyles.welcomeTextLight
            ]}>WELCOME BACK TO</Text>
            
            <View style={LoginStyles.titleContainer}>
              <Text style={[
                LoginStyles.title,
                isDarkTheme ? LoginStyles.titleDark : LoginStyles.titleLight
              ]}>
                ResQ<Text style={LoginStyles.titleAccent}>Map</Text>
              </Text>
            </View>
            
            <Text style={[
              LoginStyles.subtitle,
              isDarkTheme ? LoginStyles.subtitleDark : LoginStyles.subtitleLight
            ]}>Login to continue your rescue journey</Text>
          </Animated.View>

          {/* Form Section with Glow Effect */}
          <Animated.View 
            style={[
              LoginStyles.formContainer,
              isDarkTheme ? LoginStyles.formContainerDark : LoginStyles.formContainerLight,
              !isDarkTheme && {
                shadowOpacity: formGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.6]
                }),
                shadowRadius: formGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 50]
                }),
              },
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: formSlideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Email Input */}
            <View style={LoginStyles.inputContainer}>
              <Text style={[
                LoginStyles.inputLabel,
                isDarkTheme ? LoginStyles.inputLabelDark : LoginStyles.inputLabelLight
              ]}>Email Address</Text>
              <View style={LoginStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === 'email' ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      LoginStyles.input,
                      isDarkTheme ? LoginStyles.inputDark : LoginStyles.inputLight,
                      focusedInput === 'email' && (isDarkTheme ? LoginStyles.inputFocusedDark : LoginStyles.inputFocusedLight),
                      emailError && (isDarkTheme ? LoginStyles.inputErrorDark : LoginStyles.inputErrorLight)
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    value={email}
                    onChangeText={handleEmailChange}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={() => {
                      handleInputBlur();
                      handleFieldBlur('email');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                </Animated.View>
              </View>
              {emailError ? (
                <Text style={[
                  LoginStyles.errorText,
                  isDarkTheme ? LoginStyles.errorTextDark : LoginStyles.errorTextLight
                ]}>
                  {emailError}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={LoginStyles.inputContainer}>
              <Text style={[
                LoginStyles.inputLabel,
                isDarkTheme ? LoginStyles.inputLabelDark : LoginStyles.inputLabelLight
              ]}>Password</Text>
              <View style={LoginStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === 'password' ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      LoginStyles.input,
                      isDarkTheme ? LoginStyles.inputDark : LoginStyles.inputLight,
                      focusedInput === 'password' && (isDarkTheme ? LoginStyles.inputFocusedDark : LoginStyles.inputFocusedLight),
                      passwordError && (isDarkTheme ? LoginStyles.inputErrorDark : LoginStyles.inputErrorLight)
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={() => {
                      handleInputBlur();
                      handleFieldBlur('password');
                    }}
                    autoComplete="password"
                    autoCorrect={false}
                    textContentType="password"
                  />
                </Animated.View>
                <Pressable 
                  style={[
                    LoginStyles.passwordToggle,
                    isDarkTheme ? LoginStyles.passwordToggleDark : LoginStyles.passwordToggleLight
                  ]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={[
                    LoginStyles.passwordToggleText,
                    isDarkTheme ? LoginStyles.passwordToggleTextDark : LoginStyles.passwordToggleTextLight
                  ]}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </Text>
                </Pressable>
              </View>
              {passwordError ? (
                <Text style={[
                  LoginStyles.errorText,
                  isDarkTheme ? LoginStyles.errorTextDark : LoginStyles.errorTextLight
                ]}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            <Animated.View 
              style={[
                LoginStyles.primaryButton,
                {
                  transform: [{ scale: buttonScaleAnim }],
                  opacity: buttonScaleAnim,
                }
              ]}
            >
              <TouchableOpacity 
                style={{ width: '100%', alignItems: 'center' }}
                onPress={handleLogin}
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[
                    LoginStyles.primaryButtonText,
                    !isFormValid && LoginStyles.primaryButtonDisabled
                  ]}>
                    {isFormValid ? 'Log In' : 'Fill in required fields'}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Divider */}
          <Animated.View 
            style={[
              LoginStyles.divider,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlideAnim }]
              }
            ]}
          >
            <View style={[
              LoginStyles.dividerLine,
              isDarkTheme ? LoginStyles.dividerLineDark : LoginStyles.dividerLineLight
            ]} />
            <Text style={[
              LoginStyles.dividerText,
              isDarkTheme ? LoginStyles.dividerTextDark : LoginStyles.dividerTextLight
            ]}>Or Continue With</Text>
            <View style={[
              LoginStyles.dividerLine,
              isDarkTheme ? LoginStyles.dividerLineDark : LoginStyles.dividerLineLight
            ]} />
          </Animated.View>

          {/* Google Login */}
          <Animated.View
            style={{
              opacity: buttonScaleAnim,
              transform: [{ scale: buttonScaleAnim }],
            }}
          >
            <TouchableOpacity 
              style={[
                LoginStyles.googleButton,
                isDarkTheme ? LoginStyles.googleButtonDark : LoginStyles.googleButtonLight
              ]}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color={isDarkTheme ? "#FFFFFF" : "#666666"} />
              ) : (
                <>
                  <View style={LoginStyles.googleIconContainer}>
                    <Text style={LoginStyles.googleIcon}>G</Text>
                  </View>
                  <Text style={[
                    LoginStyles.googleButtonText,
                    isDarkTheme ? LoginStyles.googleButtonTextDark : LoginStyles.googleButtonTextLight
                  ]}>
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Features Section */}
          <View style={[
            LoginStyles.featuresContainer,
            isDarkTheme ? LoginStyles.featuresContainerDark : LoginStyles.featuresContainerLight
          ]}>
            <Text style={[
              LoginStyles.featuresTitle,
              isDarkTheme ? LoginStyles.featuresTitleDark : LoginStyles.featuresTitleLight
            ]}>Platform Features</Text>
            <View style={LoginStyles.featuresGrid}>
              <FeatureItem emoji="🚨" text="Live Emergency\nAlerts" delay={600} />
              <FeatureItem emoji="🗺️" text="Real-time\nRescue Maps" delay={800} />
              <FeatureItem emoji="👥" text="Community\nCoordination" delay={1000} />
            </View>
          </View>

          {/* Footer */}
          <Animated.View 
            style={[
              LoginStyles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlideAnim }]
              }
            ]}
          >
            <Text style={[
              LoginStyles.footerText,
              isDarkTheme ? LoginStyles.footerTextDark : LoginStyles.footerTextLight
            ]}>
              New to ResQMap?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={[
                LoginStyles.link,
                isDarkTheme ? LoginStyles.linkDark : LoginStyles.linkLight
              ]}>
                Create Your Account
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}