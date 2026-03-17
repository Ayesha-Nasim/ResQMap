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
import { RegisterStyles } from "../../styles/RegisterStyles";
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter();
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  
  // Validation states - start with empty errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

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

  // Validate form on changes
  useEffect(() => {
    validateForm();
  }, [form, touchedFields]);

  // Validation functions - return error message or empty string
  const validateName = (name: string): string => {
    if (!name.trim()) {
      return "Name is required";
    }
    
    if (name.length < 2) {
      return "Name must be at least 2 characters";
    }
    
    if (name.length > 50) {
      return "Name must be less than 50 characters";
    }
    
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return "Only letters allowed";
    }
    
    return "";
  };

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
    
    // Password complexity rules
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) {
      return "Need uppercase letter";
    }
    
    if (!hasLowerCase) {
      return "Need lowercase letter";
    }
    
    if (!hasNumbers) {
      return "Need number";
    }
    
    if (!hasSpecialChar) {
      return "Need special character";
    }
    
    return "";
  };

  const validateForm = () => {
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    
    // Show errors only for touched fields with content
    setErrors({
      name: touchedFields.name && nameError !== "" ? nameError : "",
      email: touchedFields.email && emailError !== "" ? emailError : "",
      password: touchedFields.password && passwordError !== "" ? passwordError : "",
    });
    
    const isValid = nameError === "" && emailError === "" && passwordError === "";
    setIsFormValid(isValid);
  };

  const toggleTheme = () => {
    Animated.timing(themeSwitchAnim, {
      toValue: isDarkTheme ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsDarkTheme(!isDarkTheme);
  };

  const handleNameChange = (text: string) => {
    // Prevent numbers and special characters in name
    const cleanedText = text.replace(/[^A-Za-z\s]/g, '');
    
    // Auto-capitalize first letter of each word
    const formattedText = cleanedText
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const newName = formattedText;
    setForm(prev => ({ ...prev, name: newName }));
    
    // If user tries to type invalid characters, show error immediately
    if (text !== cleanedText) {
      setTouchedFields(prev => ({ ...prev, name: true }));
      setErrors(prev => ({ ...prev, name: "Only letters allowed" }));
    } else if (touchedFields.name && newName !== "") {
      const error = validateName(newName);
      setErrors(prev => ({ ...prev, name: error }));
    }
  };

  const handleEmailChange = (text: string) => {
    const newEmail = text;
    setForm(prev => ({ ...prev, email: newEmail }));
    
    // Only show validation errors if field has been touched and has content
    if (touchedFields.email && newEmail !== "") {
      const error = validateEmail(newEmail);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  const handlePasswordChange = (text: string) => {
    const newPassword = text;
    setForm(prev => ({ ...prev, password: newPassword }));
    
    // Only show validation errors if field has been touched and has content
    if (touchedFields.password && newPassword !== "") {
      const error = validatePassword(newPassword);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleFieldBlur = (fieldName: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Only validate if field has content
    if (fieldName === 'name') {
      const error = validateName(form.name);
      setErrors(prev => ({ ...prev, name: error }));
    } else if (fieldName === 'email') {
      const error = validateEmail(form.email);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (fieldName === 'password') {
      const error = validatePassword(form.password);
      setErrors(prev => ({ ...prev, password: error }));
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

  const handleRegister = async () => {
    // Mark all fields as touched to show all errors on submit
    setTouchedFields({
      name: true,
      email: true,
      password: true,
    });
    
    // Validate all fields
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    
    // Show all errors on submit
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });
    
    if (nameError || emailError || passwordError) {
      Alert.alert(
        "Please fix errors",
        "Check the form for errors before submitting.",
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
      const res = await api.post("/auth/register", form);
      Alert.alert(
        "Success!",
        "Account created. You can now log in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login")
          }
        ]
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.error || "Registration failed";
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    if (field === 'name') {
      handleNameChange(value);
    } else if (field === 'email') {
      handleEmailChange(value);
    } else if (field === 'password') {
      handlePasswordChange(value);
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
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
          RegisterStyles.particle,
          isDarkTheme ? RegisterStyles.particleDark : RegisterStyles.particleLight,
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
    <View style={isDarkTheme ? RegisterStyles.container : RegisterStyles.containerLight}>
      {/* Background Image - Different for each theme */}
      {isDarkTheme ? (
        <Image
          source={require('../../assets/images/bg-image1.jpg')}
          style={RegisterStyles.backgroundImage}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../../assets/images/bg-image-light.jpg')}
          style={RegisterStyles.backgroundImageLight}
          resizeMode="cover"
        />
      )}
      
      {/* Background Overlay */}
      <View style={[
        RegisterStyles.backgroundOverlay,
        isDarkTheme ? RegisterStyles.backgroundOverlayDark : RegisterStyles.backgroundOverlayLight
      ]} />

      {/* Floating Particles */}
      <View style={RegisterStyles.floatingParticles}>
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
          RegisterStyles.themeToggleContainer,
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
            RegisterStyles.themeToggle,
            isDarkTheme ? RegisterStyles.themeToggleDark : RegisterStyles.themeToggleLight
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
        contentContainerStyle={RegisterStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={RegisterStyles.content}>
          
          {/* Header Section */}
          <Animated.View 
            style={[
              RegisterStyles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleSlideAnim }]
              }
            ]}
          >
            <Text style={[
              RegisterStyles.welcomeText,
              isDarkTheme ? RegisterStyles.welcomeTextDark : RegisterStyles.welcomeTextLight
            ]}>WELCOME TO</Text>
            
            <View style={RegisterStyles.titleContainer}>
              <Text style={[
                RegisterStyles.title,
                isDarkTheme ? RegisterStyles.titleDark : RegisterStyles.titleLight
              ]}>
                ResQ<Text style={RegisterStyles.titleAccent}>Map</Text>
              </Text>
            </View>
            
            {/* New Sign Up Title */}
            <Text style={[
              RegisterStyles.signUpTitle,
              isDarkTheme ? RegisterStyles.signUpTitleDark : RegisterStyles.signUpTitleLight
            ]}>
              Sign Up
            </Text>
            
            <Text style={[
              RegisterStyles.subtitle,
              isDarkTheme ? RegisterStyles.subtitleDark : RegisterStyles.subtitleLight
            ]}>Create your account to join the rescue community</Text>
          </Animated.View>

          {/* Form Section with Glow Effect */}
          <Animated.View 
            style={[
              RegisterStyles.formContainer,
              isDarkTheme ? RegisterStyles.formContainerDark : RegisterStyles.formContainerLight,
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
            {/* Name Input */}
            <View style={RegisterStyles.inputContainer}>
              <Text style={[
                RegisterStyles.inputLabel,
                isDarkTheme ? RegisterStyles.inputLabelDark : RegisterStyles.inputLabelLight
              ]}>Full Name</Text>
              <View style={RegisterStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === 'name' ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      RegisterStyles.input,
                      isDarkTheme ? RegisterStyles.inputDark : RegisterStyles.inputLight,
                      focusedInput === 'name' && (isDarkTheme ? RegisterStyles.inputFocusedDark : RegisterStyles.inputFocusedLight),
                      errors.name && (isDarkTheme ? RegisterStyles.inputErrorDark : RegisterStyles.inputErrorLight)
                    ]}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    value={form.name}
                    onChangeText={(v) => updateField("name", v)}
                    onFocus={() => handleInputFocus('name')}
                    onBlur={() => {
                      handleInputBlur();
                      handleFieldBlur('name');
                    }}
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect={false}
                    maxLength={50}
                  />
                </Animated.View>
              </View>
              {errors.name ? (
                <Text style={[
                  RegisterStyles.errorText,
                  isDarkTheme ? RegisterStyles.errorTextDark : RegisterStyles.errorTextLight
                ]}>
                  {errors.name}
                </Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={RegisterStyles.inputContainer}>
              <Text style={[
                RegisterStyles.inputLabel,
                isDarkTheme ? RegisterStyles.inputLabelDark : RegisterStyles.inputLabelLight
              ]}>Email Address</Text>
              <View style={RegisterStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === 'email' ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      RegisterStyles.input,
                      isDarkTheme ? RegisterStyles.inputDark : RegisterStyles.inputLight,
                      focusedInput === 'email' && (isDarkTheme ? RegisterStyles.inputFocusedDark : RegisterStyles.inputFocusedLight),
                      errors.email && (isDarkTheme ? RegisterStyles.inputErrorDark : RegisterStyles.inputErrorLight)
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    value={form.email}
                    onChangeText={(v) => updateField("email", v)}
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
                    maxLength={100}
                  />
                </Animated.View>
              </View>
              {errors.email ? (
                <Text style={[
                  RegisterStyles.errorText,
                  isDarkTheme ? RegisterStyles.errorTextDark : RegisterStyles.errorTextLight
                ]}>
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={RegisterStyles.inputContainer}>
              <Text style={[
                RegisterStyles.inputLabel,
                isDarkTheme ? RegisterStyles.inputLabelDark : RegisterStyles.inputLabelLight
              ]}>Password</Text>
              <View style={RegisterStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === 'password' ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      RegisterStyles.input,
                      isDarkTheme ? RegisterStyles.inputDark : RegisterStyles.inputLight,
                      focusedInput === 'password' && (isDarkTheme ? RegisterStyles.inputFocusedDark : RegisterStyles.inputFocusedLight),
                      errors.password && (isDarkTheme ? RegisterStyles.inputErrorDark : RegisterStyles.inputErrorLight)
                    ]}
                    placeholder="Create a strong password"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v) => updateField("password", v)}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={() => {
                      handleInputBlur();
                      handleFieldBlur('password');
                    }}
                    autoComplete="password"
                    autoCorrect={false}
                    textContentType="newPassword"
                    maxLength={50}
                  />
                </Animated.View>
                <Pressable 
                  style={[
                    RegisterStyles.passwordToggle,
                    isDarkTheme ? RegisterStyles.passwordToggleDark : RegisterStyles.passwordToggleLight
                  ]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={[
                    RegisterStyles.passwordToggleText,
                    isDarkTheme ? RegisterStyles.passwordToggleTextDark : RegisterStyles.passwordToggleTextLight
                  ]}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </Text>
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={[
                  RegisterStyles.errorText,
                  isDarkTheme ? RegisterStyles.errorTextDark : RegisterStyles.errorTextLight
                ]}>
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Role Selection */}
            <View style={RegisterStyles.inputContainer}>
              <Text style={[
                RegisterStyles.inputLabel,
                isDarkTheme ? RegisterStyles.inputLabelDark : RegisterStyles.inputLabelLight
              ]}>Select Role</Text>
              
              <View style={RegisterStyles.roleContainer}>
                <Pressable
                  style={[
                    RegisterStyles.roleButton,
                    isDarkTheme ? RegisterStyles.roleButtonDark : RegisterStyles.roleButtonLight,
                    form.role === "citizen" && (isDarkTheme ? RegisterStyles.roleSelectedDark : RegisterStyles.roleSelectedLight),
                  ]}
                  onPress={() => updateField("role", "citizen")}
                >
                  <Text
                    style={[
                      RegisterStyles.roleText,
                      isDarkTheme ? RegisterStyles.roleTextDark : RegisterStyles.roleTextLight,
                      form.role === "citizen" && RegisterStyles.roleTextSelected,
                    ]}
                  >
                    Citizen
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    RegisterStyles.roleButton,
                    isDarkTheme ? RegisterStyles.roleButtonDark : RegisterStyles.roleButtonLight,
                    form.role === "responder" && (isDarkTheme ? RegisterStyles.roleSelectedDark : RegisterStyles.roleSelectedLight),
                  ]}
                  onPress={() => updateField("role", "responder")}
                >
                  <Text
                    style={[
                      RegisterStyles.roleText,
                      isDarkTheme ? RegisterStyles.roleTextDark : RegisterStyles.roleTextLight,
                      form.role === "responder" && RegisterStyles.roleTextSelected,
                    ]}
                  >
                    Responder
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Register Button */}
            <Animated.View 
              style={[
                RegisterStyles.primaryButton,
                {
                  transform: [{ scale: buttonScaleAnim }],
                  opacity: buttonScaleAnim,
                }
              ]}
            >
              <TouchableOpacity 
                style={{ width: '100%', alignItems: 'center' }}
                onPress={handleRegister}
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[
                    RegisterStyles.primaryButtonText,
                    !isFormValid && RegisterStyles.primaryButtonDisabled
                  ]}>
                    {isFormValid ? 'CREATE ACCOUNT' : 'FILL IN REQUIRED FIELDS'}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              RegisterStyles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlideAnim }]
              }
            ]}
          >
            <Text style={[
              RegisterStyles.footerText,
              isDarkTheme ? RegisterStyles.footerTextDark : RegisterStyles.footerTextLight
            ]}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={[
                RegisterStyles.link,
                isDarkTheme ? RegisterStyles.linkDark : RegisterStyles.linkLight
              ]}>
                Log In Here
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}