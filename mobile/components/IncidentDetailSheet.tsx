import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { MapStyles } from '../styles/MapStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

type Incident = {
  id: string;
  type?: string;
  description?: string;
  severity?: string;
  status?: string;
  fullAddress?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  createdAt?: any;
  weather?: any;
};

type Props = {
  incident: Incident;
  sheetAnim: Animated.Value;
  onClose: () => void;
  isDarkMode: boolean;
};

function severityToColor(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return "#ef4444";
  if (s === "medium") return "#f97316";
  if (s === "low") return "#22c55e";
  if (s === "pending" || s === "pending_review") return "#6b7280";
  return "#3b82f6";
}

function formatDate(timestamp: any) {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return "Unknown";
  }
}

function getWeatherIcon(weather: any) {
  if (!weather?.condition) return "🌤️";
  const cond = weather.condition.toLowerCase();
  if (cond.includes("rain")) return "🌧️";
  if (cond.includes("snow")) return "❄️";
  if (cond.includes("cloud")) return "☁️";
  if (cond.includes("clear")) return "☀️";
  if (cond.includes("storm")) return "⛈️";
  if (cond.includes("wind")) return "💨";
  return "🌤️";
}

export default function IncidentDetailSheet({ incident, sheetAnim, onClose, isDarkMode }: Props) {
  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  const textColor = isDarkMode ? '#f3f4f6' : '#111827';
  const secondaryTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBackground = isDarkMode ? '#374151' : '#f9fafb';

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open navigation app");
    });
  };

  const handleShare = () => {
    Alert.alert(
      "Share Incident",
      "Sharing feature will be implemented soon!",
      [{ text: "OK" }]
    );
  };

  const handleReport = () => {
    Alert.alert(
      "Report Incident",
      "This incident has been reported to authorities.",
      [{ text: "OK" }]
    );
  };

  return (
    <Animated.View
      style={[
        MapStyles.sheetContainer,
        {
          transform: [{ translateY: sheetAnim }],
          backgroundColor,
        },
      ]}
    >
      {/* Sheet Handle */}
      <View style={MapStyles.sheetHandleContainer}>
        <View style={[MapStyles.sheetHandle, isDarkMode && MapStyles.sheetHandleDark]} />
      </View>

      <ScrollView 
        style={MapStyles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Incident Header */}
        <View style={[MapStyles.sheetHeader, { borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
          <View style={MapStyles.sheetHeaderLeft}>
            <View style={[MapStyles.severityPill, { backgroundColor: severityToColor(incident.severity) }]}>
              <Text style={MapStyles.severityPillText}>{incident.severity?.toUpperCase() || "UNKNOWN"}</Text>
            </View>
            <Text style={[MapStyles.sheetTitle, { color: textColor }]}>{incident.type || "Incident"}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={MapStyles.sheetCloseButton}>
            <Text style={[MapStyles.sheetCloseText, { color: secondaryTextColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Incident Image */}
        {incident.imageUrl ? (
          <View style={MapStyles.sheetImageContainer}>
            <Image
              source={{ uri: incident.imageUrl }}
              style={MapStyles.sheetImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={MapStyles.sheetImageGradient}
            />
            <View style={MapStyles.sheetImageOverlay}>
              <Text style={MapStyles.sheetImageText}>Incident Photo</Text>
            </View>
          </View>
        ) : (
          <View style={[MapStyles.sheetNoImage, { backgroundColor: cardBackground }]}>
            <Text style={[MapStyles.sheetNoImageText, { color: secondaryTextColor }]}>📷 No Image Available</Text>
          </View>
        )}

        {/* Details Grid */}
        <View style={MapStyles.sheetGrid}>
          {/* Location Card */}
          <View style={[MapStyles.sheetCard, { backgroundColor: cardBackground }]}>
            <Text style={[MapStyles.sheetCardTitle, { color: textColor }]}>📍 Location</Text>
            <Text style={[MapStyles.sheetCardText, { color: textColor, marginTop: 4 }]}>
              {incident.fullAddress || "Address not specified"}
            </Text>
            <Text style={[MapStyles.sheetCardSubtext, { color: secondaryTextColor, marginTop: 2 }]}>
              Lat: {incident.latitude.toFixed(4)}, Lng: {incident.longitude.toFixed(4)}
            </Text>
            <TouchableOpacity 
              style={[MapStyles.sheetButton, { backgroundColor: severityToColor(incident.severity) }]}
              onPress={handleNavigate}
            >
              <Text style={MapStyles.sheetButtonText}>🚗 Navigate Here</Text>
            </TouchableOpacity>
          </View>

          {/* Status & Time Card */}
          <View style={[MapStyles.sheetCard, { backgroundColor: cardBackground }]}>
            <Text style={[MapStyles.sheetCardTitle, { color: textColor }]}>⏰ Status & Time</Text>
            <View style={MapStyles.sheetStatusRow}>
              <View style={[MapStyles.statusBadge, { 
                backgroundColor: incident.status === 'resolved' ? '#10b98120' : '#f59e0b20',
                borderColor: incident.status === 'resolved' ? '#10b981' : '#f59e0b'
              }]}>
                <Text style={[MapStyles.statusBadgeText, { 
                  color: incident.status === 'resolved' ? '#10b981' : '#f59e0b'
                }]}>
                  {incident.status?.toUpperCase() || 'ACTIVE'}
                </Text>
              </View>
              <Text style={[MapStyles.sheetCardSubtext, { color: secondaryTextColor }]}>
                {formatDate(incident.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Weather Card */}
        {incident.weather && (
          <View style={[MapStyles.sheetCard, { backgroundColor: cardBackground, marginTop: 12 }]}>
            <Text style={[MapStyles.sheetCardTitle, { color: textColor }]}>
              {getWeatherIcon(incident.weather)} Weather Conditions
            </Text>
            <View style={MapStyles.weatherGrid}>
              {incident.weather.temp !== undefined && (
                <View style={MapStyles.weatherItem}>
                  <Text style={[MapStyles.weatherValue, { color: textColor }]}>
                    {Math.round(incident.weather.temp)}°C
                  </Text>
                  <Text style={[MapStyles.weatherLabel, { color: secondaryTextColor }]}>Temperature</Text>
                </View>
              )}
              {incident.weather.humidity !== undefined && (
                <View style={MapStyles.weatherItem}>
                  <Text style={[MapStyles.weatherValue, { color: textColor }]}>
                    {Math.round(incident.weather.humidity)}%
                  </Text>
                  <Text style={[MapStyles.weatherLabel, { color: secondaryTextColor }]}>Humidity</Text>
                </View>
              )}
              {incident.weather.windSpeed !== undefined && (
                <View style={MapStyles.weatherItem}>
                  <Text style={[MapStyles.weatherValue, { color: textColor }]}>
                    {Math.round(incident.weather.windSpeed)} m/s
                  </Text>
                  <Text style={[MapStyles.weatherLabel, { color: secondaryTextColor }]}>Wind</Text>
                </View>
              )}
              {incident.weather.rain1h !== undefined && incident.weather.rain1h > 0 && (
                <View style={MapStyles.weatherItem}>
                  <Text style={[MapStyles.weatherValue, { color: textColor }]}>
                    {incident.weather.rain1h}mm
                  </Text>
                  <Text style={[MapStyles.weatherLabel, { color: secondaryTextColor }]}>Rain (1h)</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Description Card */}
        <View style={[MapStyles.sheetCard, { backgroundColor: cardBackground, marginTop: 12 }]}>
          <Text style={[MapStyles.sheetCardTitle, { color: textColor }]}>📝 Description</Text>
          <Text style={[MapStyles.sheetCardText, { color: textColor, marginTop: 8 }]}>
            {incident.description || "No description provided."}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={[MapStyles.sheetActions, { marginTop: 20, marginBottom: 40 }]}>
          <TouchableOpacity 
            style={[MapStyles.sheetActionButton, { backgroundColor: '#3b82f6' }]}
            onPress={handleShare}
          >
            <Text style={MapStyles.sheetActionButtonText}>📤 Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[MapStyles.sheetActionButton, { backgroundColor: '#ef4444' }]}
            onPress={handleReport}
          >
            <Text style={MapStyles.sheetActionButtonText}>🚨 Report Emergency</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
}