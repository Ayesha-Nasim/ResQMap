export const unstable_settings = {
  ignoreWeb: true,
};

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useAuth } from "../src/context/AuthContext";
import { uploadIncidentAPI } from "../src/services/uploadIncidentAPI";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SubmitStyles } from "../styles/SubmitStyles";

/* ------------------------------- TYPES ------------------------------- */
type Coordinates = {
  latitude: number;
  longitude: number;
};
type IncidentType = {
  label: string;
  value: string;
  icon: string;
};

/* ----------------------------- UTILITY FUNCTIONS ----------------------------- */
// Timeout wrapper for reverseGeocodeAsync
const reverseGeocodeWithTimeout = async (
  latitude: number,
  longitude: number,
  timeoutMs = 8000
): Promise<Location.LocationGeocodedAddress[]> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Reverse geocode timeout")), timeoutMs);
  });

  const geocodePromise = Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  try {
    return await Promise.race([geocodePromise, timeoutPromise]);
  } catch (error) {
    console.warn("Reverse geocode timeout/failed:", (error as Error).message);
    throw error; // Re-throw to handle in the calling function
  }
};

// Retry logic with exponential backoff
const reverseGeocodeWithRetry = async (
  latitude: number,
  longitude: number,
  maxRetries = 3
): Promise<Location.LocationGeocodedAddress[]> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await reverseGeocodeWithTimeout(latitude, longitude);
      return result;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error; // Last attempt failed
      }
      // Wait before retrying (exponential backoff: 1s, 2s, 4s...)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Geocode attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("All geocode attempts failed");
};

// Fallback geocoding using OpenStreetMap
const reverseGeocodeWithFallbackAPI = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "ResQReport-App/1.0",
          "Accept-Language": "en",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    const address = data.address;

    // Format address from OpenStreetMap data
    const addressParts = [];
    if (address.road) addressParts.push(address.road);
    if (address.suburb) addressParts.push(address.suburb);
    if (address.city || address.town || address.village) {
      addressParts.push(address.city || address.town || address.village);
    }
    if (address.state) addressParts.push(address.state);
    if (address.country) addressParts.push(address.country);

    return {
      name: address.road || address.suburb || "Unknown location",
      street: address.road || null,
      city: address.city || address.town || address.village || null,
      region: address.state || null,
      country: address.country || null,
      formattedAddress: addressParts.join(", ") || "Location not available",
    };
  } catch (error) {
    console.error("Fallback geocoding failed:", error);
    return null;
  }
};

// Main geocoding function with fallback
const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // First try Expo's reverse geocoding with retry logic
    const results = await reverseGeocodeWithRetry(latitude, longitude);

    if (results.length > 0) {
      const address = results[0];
      const mainName =
        address.name ||
        address.street ||
        address.subregion ||
        address.city ||
        address.district ||
        "Unknown area";

      const nearbyLabel = address.name ? mainName : `near ${mainName}`;
      const formatted = [nearbyLabel, address.city, address.region, address.country]
        .filter(Boolean)
        .join(", ");
      return formatted;
    }

    throw new Error("No address results");
  } catch (error) {
    console.log("Expo geocoding failed, trying fallback...");
    // Try fallback API
    const fallbackResult = await reverseGeocodeWithFallbackAPI(latitude, longitude);
    if (fallbackResult) {
      return fallbackResult.formattedAddress;
    }
    // If everything fails, return coordinates
    return `Location at ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }
};

/* ----------------------------- COMPONENT ----------------------------- */
export default function SubmitIncidentScreen() {
  const { user } = useAuth() as { user: { id: string } | null };
  const router = useRouter();

  const [type, setType] = useState<string>("");
  const [customType, setCustomType] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // ✅ UPDATED: Structured severity hints for all incident types
  const [subType, setSubType] = useState<string>(""); // for Fire/Flood/Road Accident
  const [peopleAtRisk, setPeopleAtRisk] = useState<boolean>(false); // for all types when appropriate
  const [vehicleCount, setVehicleCount] = useState<string>(""); // for Road Accidents
  const [waterLevel, setWaterLevel] = useState<string>(""); // for Flood

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [fullAddress, setFullAddress] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [showCustomType, setShowCustomType] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string>("");

  // NEW STATE
  // Custom dropdown states
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedTypeLabel, setSelectedTypeLabel] = useState<string>("Select incident type");

  const isFire = type === "Fire";
  const isFlood = type === "Flood";
  const isRoadAccident = type === "Road Accident";
  const isOther = type === "Other";

  // Check if current type requires people at risk
  const showPeopleAtRisk = isFire || isFlood || isRoadAccident || isOther;

  // Incident types array
  const incidentTypes: IncidentType[] = [
    { label: "🚨 Fire", value: "Fire", icon: "🔥" },
    { label: "🌊 Flood", value: "Flood", icon: "💧" },
    { label: "🚗 Road Accident", value: "Road Accident", icon: "🚨" },
    { label: "⚠️ Other", value: "Other", icon: "⚠️" },
  ];

  // Fire subtype options
  const fireSubTypes: { label: string; value: string }[] = [
    { label: "⚡ Electrical", value: "Electrical" },
    { label: "🧯 Gas/Cylinder", value: "Gas/Cylinder" },
    { label: "🏠 Building/House", value: "Building/House" },
    { label: "🚗 Vehicle", value: "Vehicle" },
    { label: "🌲 Wildfire", value: "Wildfire" },
    { label: "⚠️ Other", value: "Other" },
  ];

  // Flood subtype options
  const floodSubTypes: { label: string; value: string }[] = [
    { label: "🌊 Flash Flood", value: "Flash Flood" },
    { label: "🏘️ Urban Flood", value: "Urban Flood" },
    { label: "🌾 River Overflow", value: "River Overflow" },
    { label: "🌧️ Heavy Rain", value: "Heavy Rain" },
    { label: "🏠 House Flooding", value: "House Flooding" },
    { label: "⚠️ Other", value: "Other" },
  ];

  // Road Accident subtype options
  const roadAccidentSubTypes: { label: string; value: string }[] = [
    { label: "🚗 Car Crash", value: "Car Crash" },
    { label: "🏍️ Motorcycle", value: "Motorcycle" },
    { label: "🚚 Truck/Bus", value: "Truck/Bus" },
    { label: "🚲 Bicycle/Pedestrian", value: "Bicycle/Pedestrian" },
    { label: "💥 Multiple Vehicles", value: "Multiple Vehicles" },
    { label: "⚠️ Other", value: "Other" },
  ];

  // Animations
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
  const mapFadeAnim = useState(new Animated.Value(0))[0];
  const dropdownAnim = useState(new Animated.Value(0))[0];

  /* ------------------- ANIMATIONS ON MOUNT ------------------- */
  useEffect(() => {
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

    // Continuous form glow animation for light theme
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
  }, [isDarkTheme]);

  /* ------------------- LOCATION ON MOUNT ------------------- */
  useEffect(() => {
    getInitialLocation();
  }, []);

  const getInitialLocation = async () => {
    try {
      setIsGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Location permission is required to auto-fill the map. You can still manually select a location on the map.",
          [{ text: "OK" }]
        );
        setIsGettingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Coordinates = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setLocation(coords);

      // Get address with improved error handling
      await fetchAddress(coords.latitude, coords.longitude);

      // Animate map appearance
      setTimeout(() => {
        Animated.timing(mapFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 500);

      setIsGettingLocation(false);
    } catch (err) {
      console.log("Initial location error:", err);
      setIsGettingLocation(false);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. You can still manually select a location on the map below.",
        [{ text: "OK" }]
      );
    }
  };

  /* -------- FORM VALIDATION -------- */
  useEffect(() => {
    const descOk = description.trim().length > 0;

    let typeSpecificValid = true;
    
    if (isFire) {
      typeSpecificValid = subType.trim().length > 0;
    } else if (isFlood) {
      typeSpecificValid = subType.trim().length > 0;
    } else if (isRoadAccident) {
      typeSpecificValid = subType.trim().length > 0;
    }

    const isValid =
      !!type &&
      (type !== "Other" || (type === "Other" && customType.trim().length > 0)) &&
      !!location &&
      descOk &&
      typeSpecificValid;

    setFormValid(isValid);

    // Update description error
    if (description.trim().length === 0) {
      setDescriptionError("Description is required");
    } else {
      setDescriptionError("");
    }
  }, [type, customType, location, description, isFire, isFlood, isRoadAccident, subType]);

  // Reset structured fields when type changes
  useEffect(() => {
    setSubType("");
    setPeopleAtRisk(false);
    setVehicleCount("");
    setWaterLevel("");
  }, [type]);

  /* ------------------------------ IMAGE PICKER ------------------------------ */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  /* ------------------------- IMPROVED REVERSE GEOCODE ------------------------ */
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      console.log(`Fetching address for ${lat}, ${lng}...`);
      setIsFetchingAddress(true);
      const address = await getAddressFromCoordinates(lat, lng);
      setFullAddress(address);
      console.log(`Address found: ${address}`);
      setIsFetchingAddress(false);
    } catch (err) {
      console.log("Reverse geocode error:", err);
      const fallbackAddress = `Location at ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setFullAddress(fallbackAddress);
      setIsFetchingAddress(false);
    }
  };

  /* ------------------------------ SUBMIT ----------------------------- */
  const handleSubmit = async () => {
    if (!user || !user.id) {
      Alert.alert("Error", "User session missing. Please log in again.");
      return;
    }

    if (!type) {
      Alert.alert("Error", "Please select an incident type.");
      return;
    }

    if (type === "Other" && !customType.trim()) {
      Alert.alert("Error", "Please enter custom incident type.");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Location not detected yet. Please select a location on the map.");
      return;
    }

    const trimmedDesc = description.trim();

    if (!trimmedDesc) {
      setDescriptionError("Description is required");
      Alert.alert("Error", "Please provide a brief description of the incident.");
      return;
    }

    // Light client-side check (real quality gate is in backend)
    if (trimmedDesc.length < 8) {
      Alert.alert(
        "Add more detail",
        "Please write 1–2 meaningful sentences so we can classify severity accurately.\n\nExample: 'Fire in kitchen, smoke spreading, people inside.'"
      );
      return;
    }

    // Check for type-specific required fields
    if ((isFire || isFlood || isRoadAccident) && !subType.trim()) {
      Alert.alert("Missing", `Please select ${type} subtype.`);
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("userId", user.id);
      form.append("type", type);
      form.append("customType", customType); // backend ignores if not Other
      form.append("description", trimmedDesc);
      form.append("fullAddress", fullAddress);
      form.append("latitude", String(location.latitude));
      form.append("longitude", String(location.longitude));

      // ✅ UPDATED: Structured severity hints for all types
      if (isFire || isFlood || isRoadAccident) {
        form.append("subType", subType);
      }
      
      // People at risk for all types including Other
      if (showPeopleAtRisk) {
        form.append("peopleAtRisk", String(peopleAtRisk));
      }

      // Additional type-specific fields
      if (isRoadAccident && vehicleCount) {
        form.append("vehicleCount", vehicleCount);
      }
      
      if (isFlood && waterLevel) {
        form.append("waterLevel", waterLevel);
      }

      if (image) {
        form.append(
          "image",
          {
            uri: image.uri,
            name: `incident_${Date.now()}.jpg`,
            type: "image/jpeg",
          } as any
        );
      }

      const result = await uploadIncidentAPI(form);

      setLoading(false);

      if (!result?.success) {
        Alert.alert("Error", result?.error || "Submit failed");
        return;
      }

      Alert.alert("Success", "Incident submitted successfully!");

      // Reset form
      setType("");
      setCustomType("");
      setDescription("");
      setSubType("");
      setPeopleAtRisk(false);
      setVehicleCount("");
      setWaterLevel("");

      setImage(null);
      setShowCustomType(false);
      setFormValid(false);
      setSelectedTypeLabel("Select incident type");
      setDescriptionError("");

      // Full screen reload
      router.replace("/submit-incident");
    } catch (err: any) {
      console.error("Submit error:", err);
      setLoading(false);

      // ✅ Show backend message if present (garbage input gate)
      Alert.alert("Error", err?.message || "Something went wrong while submitting.");
    }
  };

  /* -------------------------- HANDLERS ------------------------- */
  const handleTypeSelect = (item: IncidentType) => {
    setType(item.value);
    setSelectedTypeLabel(item.label);
    setShowCustomType(item.value === "Other");
    if (item.value !== "Other") {
      setCustomType("");
    }
    // Reset structured fields when switching types
    setSubType("");
    setPeopleAtRisk(false);
    setVehicleCount("");
    setWaterLevel("");
    toggleDropdown();
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

  const toggleDropdown = () => {
    if (showDropdown) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowDropdown(false);
      });
    } else {
      setShowDropdown(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setLocation(newLocation);

    // Show loading for address
    setFullAddress("Getting address...");
    await fetchAddress(latitude, longitude);
  };

  const handleMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setLocation(newLocation);

    // Show loading for address
    setFullAddress("Getting address...");
    await fetchAddress(latitude, longitude);
  };

  const renderTypeItem = ({ item }: { item: IncidentType }) => (
    <TouchableOpacity
      style={[
        SubmitStyles.dropdownItem,
        isDarkTheme ? SubmitStyles.dropdownItemDark : SubmitStyles.dropdownItemLight,
        type === item.value &&
          (isDarkTheme ? SubmitStyles.dropdownItemSelectedDark : SubmitStyles.dropdownItemSelectedLight),
      ]}
      onPress={() => handleTypeSelect(item)}
    >
      <Text
        style={[
          SubmitStyles.dropdownItemIcon,
          isDarkTheme ? SubmitStyles.dropdownItemIconDark : SubmitStyles.dropdownItemIconLight,
        ]}
      >
        {item.icon}
      </Text>
      <Text
        style={[
          SubmitStyles.dropdownItemText,
          isDarkTheme ? SubmitStyles.dropdownItemTextDark : SubmitStyles.dropdownItemTextLight,
          type === item.value && SubmitStyles.dropdownItemTextSelected,
        ]}
      >
        {item.label.replace(item.icon, "").trim()}
      </Text>
    </TouchableOpacity>
  );

  // Get subtype options based on selected type
  const getSubTypeOptions = () => {
    if (isFire) return fireSubTypes;
    if (isFlood) return floodSubTypes;
    if (isRoadAccident) return roadAccidentSubTypes;
    return [];
  };

  /* ------------------------- RENDER ------------------------- */
  return (
    <View style={isDarkTheme ? SubmitStyles.container : SubmitStyles.containerLight}>
      {/* Background Overlay */}
      <View
        style={[
          SubmitStyles.backgroundOverlay,
          isDarkTheme ? SubmitStyles.backgroundOverlayDark : SubmitStyles.backgroundOverlayLight,
        ]}
      />

      {/* Theme Toggle */}
      <Animated.View
        style={[
          SubmitStyles.themeToggleContainer,
          {
            transform: [
              {
                rotate: themeSwitchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            SubmitStyles.themeToggle,
            isDarkTheme ? SubmitStyles.themeToggleDark : SubmitStyles.themeToggleLight,
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
        style={SubmitStyles.scrollView}
        contentContainerStyle={SubmitStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          style={[
            SubmitStyles.header,
            { opacity: fadeAnim, transform: [{ translateY: titleSlideAnim }] },
          ]}
        >
          <Text
            style={[
              SubmitStyles.titleText,
              isDarkTheme ? SubmitStyles.titleTextDark : SubmitStyles.titleTextLight,
            ]}
          >
            REPORT NEW INCIDENT
          </Text>

          <View style={SubmitStyles.titleContainer}>
            <Text style={[SubmitStyles.title, isDarkTheme ? SubmitStyles.titleDark : SubmitStyles.titleLight]}>
              ResQ<Text style={SubmitStyles.titleAccent}>Report</Text>
            </Text>
          </View>

          <Text style={[SubmitStyles.subtitle, isDarkTheme ? SubmitStyles.subtitleDark : SubmitStyles.subtitleLight]}>
            Help make your community safer
          </Text>
        </Animated.View>

        {/* Form Container - Full width */}
        <Animated.View
          style={[
            SubmitStyles.formContainer,
            isDarkTheme ? SubmitStyles.formContainerDark : SubmitStyles.formContainerLight,
            !isDarkTheme && {
              shadowOpacity: formGlowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }) as any,
              shadowRadius: formGlowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 50],
              }) as any,
            },
            {
              opacity: fadeAnim,
              transform: [{ translateY: formSlideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Incident Type - Custom Dropdown */}
          <View style={SubmitStyles.inputContainer}>
            <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
              Incident Type
            </Text>

            <TouchableOpacity
              style={[
                SubmitStyles.dropdownButton,
                isDarkTheme ? SubmitStyles.dropdownButtonDark : SubmitStyles.dropdownButtonLight,
                focusedInput === "type" &&
                  (isDarkTheme ? SubmitStyles.inputFocusedDark : SubmitStyles.inputFocusedLight),
              ]}
              onPress={toggleDropdown}
              onFocus={() => handleInputFocus("type")}
              onBlur={handleInputBlur}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  SubmitStyles.dropdownButtonText,
                  isDarkTheme ? SubmitStyles.dropdownButtonTextDark : SubmitStyles.dropdownButtonTextLight,
                  type ? SubmitStyles.dropdownButtonTextSelected : {},
                ]}
              >
                {selectedTypeLabel}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={isDarkTheme ? "#FF6B35" : "#FF6B35"}
              />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal visible={showDropdown} transparent={true} animationType="fade" onRequestClose={toggleDropdown}>
              <TouchableOpacity style={SubmitStyles.dropdownOverlay} activeOpacity={1} onPress={toggleDropdown}>
                <Animated.View
                  style={[
                    SubmitStyles.dropdownContainer,
                    isDarkTheme ? SubmitStyles.dropdownContainerDark : SubmitStyles.dropdownContainerLight,
                    {
                      opacity: dropdownAnim,
                      transform: [
                        {
                          translateY: dropdownAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <FlatList
                    data={incidentTypes}
                    renderItem={renderTypeItem}
                    keyExtractor={(item) => item.value}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                </Animated.View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Custom Type */}
          {showCustomType && (
            <View style={SubmitStyles.inputContainer}>
              <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
                Custom Incident Type
              </Text>
              <View style={SubmitStyles.inputWrapper}>
                <Animated.View style={{ transform: [{ scale: focusedInput === "customType" ? 1.02 : 1 }] }}>
                  <TextInput
                    style={[
                      SubmitStyles.input,
                      isDarkTheme ? SubmitStyles.inputDark : SubmitStyles.inputLight,
                      focusedInput === "customType" &&
                        (isDarkTheme ? SubmitStyles.inputFocusedDark : SubmitStyles.inputFocusedLight),
                    ]}
                    placeholder="Enter custom incident type"
                    placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                    value={customType}
                    onChangeText={setCustomType}
                    onFocus={() => handleInputFocus("customType")}
                    onBlur={handleInputBlur}
                  />
                </Animated.View>
              </View>
            </View>
          )}

          {/* ✅ UPDATED: Incident Type Specific Details */}
          {(isFire || isFlood || isRoadAccident) && (
            <View style={SubmitStyles.inputContainer}>
              <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
                {type} Details
              </Text>

              {/* Subtype as small selectable chips */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {getSubTypeOptions().map((s) => {
                  const selected = subType === s.value;
                  return (
                    <TouchableOpacity
                      key={s.value}
                      onPress={() => setSubType(s.value)}
                      activeOpacity={0.85}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 999,
                        backgroundColor: selected ? "#991b1b" : (isDarkTheme ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
                        borderWidth: 1,
                        borderColor: selected ? "#991b1b" : (isDarkTheme ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"),
                      }}
                    >
                      <Text style={{ color: selected ? "#fff" : (isDarkTheme ? "#fff" : "#111") }}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Additional Road Accident field */}
              {isRoadAccident && (
                <View style={{ marginTop: 16 }}>
                  <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
                    Number of Vehicles Involved
                  </Text>
                  <TextInput
                    style={[
                      SubmitStyles.input,
                      isDarkTheme ? SubmitStyles.inputDark : SubmitStyles.inputLight,
                    ]}
                    placeholder="e.g., 2-3 vehicles"
                    placeholderTextColor={isDarkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                    value={vehicleCount}
                    onChangeText={setVehicleCount}
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Additional Flood field */}
              {isFlood && (
                <View style={{ marginTop: 16 }}>
                  <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
                    Approximate Water Level
                  </Text>
                  <TextInput
                    style={[
                      SubmitStyles.input,
                      isDarkTheme ? SubmitStyles.inputDark : SubmitStyles.inputLight,
                    ]}
                    placeholder="e.g., Knee deep, 1 meter, etc."
                    placeholderTextColor={isDarkTheme ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                    value={waterLevel}
                    onChangeText={setWaterLevel}
                  />
                </View>
              )}

              {!subType.trim() && (
                <View style={[SubmitStyles.errorContainer, { marginTop: 10 }]}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" style={SubmitStyles.errorIcon} />
                  <Text style={SubmitStyles.errorText}>{type} subtype is required</Text>
                </View>
              )}
            </View>
          )}

          {/* People at risk for all types including Other */}
          {showPeopleAtRisk && (
            <View style={SubmitStyles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDarkTheme ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                  backgroundColor: isDarkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isDarkTheme ? "#fff" : "#111", fontWeight: "600", fontSize: 16 }}>
                    People at risk / trapped?
                  </Text>
                  <Text style={{ color: isDarkTheme ? "rgba(255,255,255,0.6)" : "#666", fontSize: 12, marginTop: 4 }}>
                    Enable if there are people in danger
                  </Text>
                </View>
                <Switch 
                  value={peopleAtRisk} 
                  onValueChange={setPeopleAtRisk}
                  trackColor={{ false: "#767577", true: "#FF6B35" }}
                  thumbColor={peopleAtRisk ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          )}

          {/* SEPARATE LOCATION BOX - Uneditable */}
          <View style={SubmitStyles.inputContainer}>
            <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
              Location
            </Text>

            {isGettingLocation ? (
              <View
                style={[
                  SubmitStyles.locationLoadingContainer,
                  isDarkTheme ? SubmitStyles.locationLoadingContainerDark : SubmitStyles.locationLoadingContainerLight,
                ]}
              >
                <ActivityIndicator size="small" color="#FF6B35" />
                <Text
                  style={[
                    SubmitStyles.locationLoadingText,
                    isDarkTheme ? SubmitStyles.locationLoadingTextDark : SubmitStyles.locationLoadingTextLight,
                  ]}
                >
                  Getting your location...
                </Text>
              </View>
            ) : location ? (
              <View
                style={[
                  SubmitStyles.locationInfoContainer,
                  isDarkTheme ? SubmitStyles.locationInfoContainerDark : SubmitStyles.locationInfoContainerLight,
                ]}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color={isDarkTheme ? "#FF6B35" : "#FF6B35"}
                  style={SubmitStyles.locationIcon}
                />
                <View style={SubmitStyles.locationTextContainer}>
                  <Text
                    style={[
                      SubmitStyles.coordinatesText,
                      isDarkTheme ? SubmitStyles.coordinatesTextDark : SubmitStyles.coordinatesTextLight,
                    ]}
                  >
                    📍 Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
                  </Text>
                  <Text style={[SubmitStyles.addressText, isDarkTheme ? SubmitStyles.addressTextDark : SubmitStyles.addressTextLight]}>
                    {isFetchingAddress ? "Getting address..." : fullAddress || "Address not available"}
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  SubmitStyles.getLocationButton,
                  isDarkTheme ? SubmitStyles.getLocationButtonDark : SubmitStyles.getLocationButtonLight,
                ]}
                onPress={getInitialLocation}
              >
                <Ionicons name="location" size={20} color="#FFFFFF" style={SubmitStyles.getLocationIcon} />
                <Text style={SubmitStyles.getLocationButtonText}>Get Current Location</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description - Clean text input without location info */}
          <View style={SubmitStyles.inputContainer}>
            <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
              Description *
            </Text>

            <View style={SubmitStyles.inputWrapper}>
              <Animated.View style={{ transform: [{ scale: focusedInput === "description" ? 1.02 : 1 }] }}>
                <TextInput
                  style={[
                    SubmitStyles.textArea,
                    isDarkTheme ? SubmitStyles.textAreaDark : SubmitStyles.textAreaLight,
                    focusedInput === "description" &&
                      (isDarkTheme ? SubmitStyles.inputFocusedDark : SubmitStyles.inputFocusedLight),
                  ]}
                  placeholder="Describe the incident details... *"
                  placeholderTextColor={isDarkTheme ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    if (text.trim().length > 0) setDescriptionError("");
                  }}
                  multiline
                  numberOfLines={5}
                  onFocus={() => handleInputFocus("description")}
                  onBlur={() => {
                    handleInputBlur();
                    if (description.trim().length === 0) {
                      setDescriptionError("Description is required");
                    }
                  }}
                  textAlignVertical="top"
                />
              </Animated.View>

              {/* Error message for description */}
              {descriptionError ? (
                <View style={SubmitStyles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" style={SubmitStyles.errorIcon} />
                  <Text style={SubmitStyles.errorText}>{descriptionError}</Text>
                </View>
              ) : null}

              {/* Tip line with dynamic content based on type */}
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: isDarkTheme ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
                }}
              >
                Tip: {isFire ? "Add details like what is burning, smoke level, people inside, etc." :
                       isFlood ? "Describe water depth, if it's rising, properties affected, etc." :
                       isRoadAccident ? "Mention number of vehicles, injuries, traffic blockage, etc." :
                       "Add specific details about the situation to help responders."}
              </Text>
            </View>
          </View>

          {/* Image Upload */}
          <View style={SubmitStyles.inputContainer}>
            <Text style={[SubmitStyles.inputLabel, isDarkTheme ? SubmitStyles.inputLabelDark : SubmitStyles.inputLabelLight]}>
              Image Evidence
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              style={[SubmitStyles.imageButton, isDarkTheme ? SubmitStyles.imageButtonDark : SubmitStyles.imageButtonLight]}
            >
              <Ionicons
                name="camera"
                size={24}
                color={isDarkTheme ? "#FF6B35" : "#FF6B35"}
                style={SubmitStyles.imageButtonIcon}
              />
              <Text style={[SubmitStyles.imageButtonText, isDarkTheme ? SubmitStyles.imageButtonTextDark : SubmitStyles.imageButtonTextLight]}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>

            {image && (
              <Animated.View style={[SubmitStyles.imagePreviewContainer, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
                <Image source={{ uri: image.uri }} style={SubmitStyles.previewImage} />
              </Animated.View>
            )}
          </View>

          {/* Map - Larger container */}
          <Animated.View style={[SubmitStyles.mapContainer, { opacity: mapFadeAnim, transform: [{ scale: mapFadeAnim }] }]}>
            {location ? (
              <MapView
                style={SubmitStyles.map}
                provider="google"
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
              >
                <Marker coordinate={location} draggable onDragEnd={handleMarkerDragEnd} />
              </MapView>
            ) : (
              <View style={[SubmitStyles.mapPlaceholder, isDarkTheme ? SubmitStyles.mapPlaceholderDark : SubmitStyles.mapPlaceholderLight]}>
                <Ionicons name="map" size={40} color={isDarkTheme ? "#666" : "#999"} />
                <Text style={[SubmitStyles.mapPlaceholderText, isDarkTheme ? SubmitStyles.mapPlaceholderTextDark : SubmitStyles.mapPlaceholderTextLight]}>
                  {isGettingLocation ? "Getting your location..." : "Map will appear once location is available"}
                </Text>
              </View>
            )}

            <View style={SubmitStyles.mapInstructions}>
              <Text style={[SubmitStyles.mapInstructionsText, isDarkTheme ? SubmitStyles.mapInstructionsTextDark : SubmitStyles.mapInstructionsTextLight]}>
                📍 Tap map or drag marker to adjust location
              </Text>
            </View>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View
            style={[
              SubmitStyles.submitButton,
              {
                transform: [{ scale: buttonScaleAnim }],
                opacity: buttonScaleAnim,
                shadowColor: formValid ? "#FF6B35" : "#666",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                SubmitStyles.submitButtonInner,
                formValid ? SubmitStyles.submitButtonActive : SubmitStyles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || !formValid}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="alert-circle" size={24} color="#FFFFFF" style={SubmitStyles.submitIcon} />
                  <Text style={SubmitStyles.submitButtonText}>Submit Incident Report</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Footer Info */}
        <Animated.View style={[SubmitStyles.footer, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }]}>
          <View style={[SubmitStyles.footerInfo, isDarkTheme ? SubmitStyles.footerInfoDark : SubmitStyles.footerInfoLight]}>
            <Ionicons name="information-circle" size={20} color={isDarkTheme ? "#FF6B35" : "#FF6B35"} style={SubmitStyles.infoIcon} />
            <Text style={[SubmitStyles.footerText, isDarkTheme ? SubmitStyles.footerTextDark : SubmitStyles.footerTextLight]}>
              Your report helps emergency services respond faster. Thank you for making our community safer.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}