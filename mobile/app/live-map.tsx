import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import MapView, {
  Marker,
  Callout,
  Region,
  UrlTile,
  PROVIDER_GOOGLE,
  Circle,
} from "react-native-maps";
import * as Location from "expo-location";
import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { MapStyles } from "../styles/MapStyles";
import IncidentDetailSheet from "../components/IncidentDetailSheet";
import FloatingActionMenu from "../components/FloatingActionMenu";
import IncidentDensityHeatmap from "../components/IncidentDensityHeatmap";
import FloodRiskOverlay from "../components/FloodRiskOverlay";

const { width, height } = Dimensions.get("window");

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

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

function deltaToZoomLevel(latitudeDelta: number) {
  return Math.log2(360 / latitudeDelta);
}

function severityToPinColor(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return "#ef4444";
  if (s === "medium") return "#f97316";
  if (s === "low") return "#22c55e";
  if (s === "pending" || s === "pending_review") return "#6b7280";
  return "#3b82f6";
}

function severityToRadius(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return 1200;
  if (s === "medium") return 700;
  if (s === "low") return 350;
  return 250;
}

function severityToFillColor(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return "rgba(239, 68, 68, 0.15)";
  if (s === "medium") return "rgba(249, 115, 22, 0.15)";
  if (s === "low") return "rgba(34, 197, 94, 0.15)";
  return "rgba(59, 130, 246, 0.15)";
}

function getSeverityLevel(sev?: string): number {
  const s = (sev || "").toLowerCase();
  if (s === "high") return 3;
  if (s === "medium") return 2;
  if (s === "low") return 1;
  return 0;
}

type WeatherLayer = "temp_new" | "precipitation_new" | "clouds_new" | "wind_new";

// 🎯 Define view modes (removed "boundaries")
type ViewMode = "normal" | "weather" | "heatmap" | "risk";

export default function LiveMap() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const mapRef = useRef<MapView>(null);
  const lastToastAt = useRef<number>(0);

  const [loading, setLoading] = useState(true);
  const [locLoading, setLocLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [userRegion, setUserRegion] = useState<Region | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // 🥇 Feature 1: Incident Focus
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [mapDimmed, setMapDimmed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🥇 Feature 1: Detail Sheet
  const [sheetVisible, setSheetVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(height)).current;

  // 🎯 Unified view mode (replaces individual toggles)
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  // 🥈 Feature 2: Severity Zones (always on in normal mode)
  const showSeverityZones = viewMode === "normal";

  // 🥉 Feature 3: Legend
  const [showLegend, setShowLegend] = useState(true);

  // 🟢 Feature 6: Nearby Alerts
  const [nearbyAlert, setNearbyAlert] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [toastMsg, setToastMsg] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Menu state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  // ✅ Weather overlay controls
  const [weatherOpacity, setWeatherOpacity] = useState(0.75);
  const [intensity, setIntensity] = useState<"soft" | "medium" | "strong">("strong");
  const [weatherLayer, setWeatherLayer] = useState<WeatherLayer>("temp_new");

  // Weather settings modal
  const [showWeatherSettings, setShowWeatherSettings] = useState(false);

  const OWM_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

  const incidentEndpoints = useMemo(
    () => ["/incidents/map", "/incidents/verified", "/incidents/active", "/incidents"],
    []
  );

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const showMiniToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  // ✅ Risk overlay state
  const [riskOverlay, setRiskOverlay] = useState<any>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskErr, setRiskErr] = useState<string>("");
  const riskFetchTimer = useRef<any>(null);
  const lastRiskKey = useRef<string>("");

  const fallbackRegion: Region = {
    latitude: 30.3753,
    longitude: 69.3451,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  const regionToUse = userRegion || fallbackRegion;

  const boundsToBbox = (b: any) => {
    const minLat = b.southWest.latitude;
    const minLng = b.southWest.longitude;
    const maxLat = b.northEast.latitude;
    const maxLng = b.northEast.longitude;
    return `${minLng},${minLat},${maxLng},${maxLat}`;
  };

  const regionToBbox = (r: Region) => {
    const minLat = r.latitude - r.latitudeDelta / 2;
    const maxLat = r.latitude + r.latitudeDelta / 2;
    const minLng = r.longitude - r.longitudeDelta / 2;
    const maxLng = r.longitude + r.longitudeDelta / 2;
    return `${minLng},${minLat},${maxLng},${maxLat}`;
  };

  const fetchRiskOverlayForCurrentView = async (region?: Region) => {
    if (viewMode !== "risk") return;

    setRiskErr("");

    try {
      setRiskLoading(true);

      let bboxStr = "";
      try {
        const b = await mapRef.current?.getMapBoundaries();
        if (b?.northEast && b?.southWest) bboxStr = boundsToBbox(b);
      } catch {
        // ignore
      }

      if (!bboxStr) {
        const r = region || userRegion || fallbackRegion;
        bboxStr = regionToBbox(r);
      }

      const key = `flood|24h|${bboxStr}`;
      if (key === lastRiskKey.current) {
        setRiskLoading(false);
        return;
      }
      lastRiskKey.current = key;

      const res = await api.get("/risk-overlay", {
        headers: authHeaders,
        params: {
          type: "flood",
          window: "24h",
          bbox: bboxStr,
        },
      });

      setRiskOverlay(res.data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load flood risk overlay";
      setRiskErr(msg);
      setRiskOverlay(null);
    } finally {
      setRiskLoading(false);
    }
  };

  const getMyLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErr("Location permission denied");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const region: Region = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
      setUserRegion(region);
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });

      // 🟢 Feature 6: Check for nearby incidents
      checkNearbyIncidents(pos.coords.latitude, pos.coords.longitude);
    } catch (e: any) {
      setErr(e?.message || "Failed to get location");
    } finally {
      setLocLoading(false);
    }
  };

  // 🟢 Feature 6: Check if user is near any high severity incidents
  const checkNearbyIncidents = (userLat: number, userLng: number) => {
    if (!incidents.length) return;

    for (const incident of incidents) {
      const distance = haversineMeters(
        { lat: userLat, lng: userLng },
        { lat: incident.latitude, lng: incident.longitude }
      );

      const severityLevel = getSeverityLevel(incident.severity);
      const radius = severityToRadius(incident.severity);

      if (distance <= radius && severityLevel >= 2) {
        if (severityLevel === 3) {
          setNearbyAlert(
            `⚠️ You are within ${Math.round(distance)}m of a HIGH severity incident!`
          );
        } else if (severityLevel === 2) {
          setNearbyAlert(
            `⚠️ You are within ${Math.round(distance)}m of a MEDIUM severity incident`
          );
        }
        return;
      }
    }

    setNearbyAlert(null);
  };

  const normalizeIncidents = (raw: any): Incident[] => {
    const list = raw?.incidents || raw || [];
    if (!Array.isArray(list)) return [];

    return list
      .map((x: any) => ({
        id: x.id || x._id || x.docId || String(Math.random()),
        type: x.type,
        description: x.description,
        severity: x.severity,
        status: x.status,
        fullAddress: x.fullAddress,
        imageUrl: x.imageUrl,
        latitude: Number(x.latitude),
        longitude: Number(x.longitude),
        createdAt: x.createdAt,
        weather: x.weather,
      }))
      .filter((x: Incident) => Number.isFinite(x.latitude) && Number.isFinite(x.longitude));
  };

  const fetchIncidents = async () => {
    setLoading(true);
    setErr("");

    try {
      let lastError: any = null;

      for (const ep of incidentEndpoints) {
        try {
          const res = await api.get(ep, { headers: authHeaders });
          const normalized = normalizeIncidents(res.data);
          setIncidents(normalized);
          return;
        } catch (e: any) {
          lastError = e;
        }
      }

      const msg =
        lastError?.response?.data?.error ||
        lastError?.response?.data?.message ||
        lastError?.message ||
        "Failed to fetch incidents";
      setErr(msg);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getMyLocation();
      await fetchIncidents();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🥇 Feature 1: Handle incident selection
  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setMapDimmed(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setSheetVisible(true);
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    mapRef.current?.animateToRegion(
      {
        latitude: incident.latitude,
        longitude: incident.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  // 🥇 Feature 1: Clear selection
  const clearSelection = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedIncident(null);
      setMapDimmed(false);
      setSheetVisible(false);
    });
  };

  const getClosestIncidentToCenter = (region: Region) => {
    if (!incidents.length) return null;

    const center = { lat: region.latitude, lng: region.longitude };
    let best: Incident | null = null;
    let bestDist = Number.POSITIVE_INFINITY;

    for (const inc of incidents) {
      const d = haversineMeters(center, { lat: inc.latitude, lng: inc.longitude });
      if (d < bestDist) {
        bestDist = d;
        best = inc;
      }
    }

    return { incident: best, distanceMeters: bestDist };
  };

  const onRegionChangeComplete = (region: Region) => {
    const zoom = deltaToZoomLevel(region.latitudeDelta);
    const now = Date.now();
    if (now - lastToastAt.current < 1200) return;

    if (zoom >= 13) {
      const nearest = getClosestIncidentToCenter(region);
      if (nearest?.incident) {
        const inc = nearest.incident;
        lastToastAt.current = now;
        showMiniToast(`Nearby: ${inc.type || "Incident"} • ${inc.severity || "unknown"}`);
      }
    }

    // 🟢 Feature 6: Update nearby check
    if (userLocation) {
      checkNearbyIncidents(region.latitude, region.longitude);
    }

    // ✅ NEW: risk mode - refetch overlay when panning/zooming (debounced)
    if (viewMode === "risk") {
      if (riskFetchTimer.current) clearTimeout(riskFetchTimer.current);
      riskFetchTimer.current = setTimeout(() => {
        fetchRiskOverlayForCurrentView(region);
      }, 700);
    }
  };

  const onRefresh = async () => {
    setErr("");
    await fetchIncidents();

    // if currently on risk mode, refresh overlay too
    if (viewMode === "risk") {
      await fetchRiskOverlayForCurrentView(userRegion || fallbackRegion);
    }
  };

  const onRecenter = async () => {
    await getMyLocation();
    if (userRegion) {
      mapRef.current?.animateToRegion(userRegion, 500);
    }
  };

  // Menu functions
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
    switch (option) {
      case "homepage":
        router.navigate("/dashboard-citizen");
        break;
      case "map":
        break;
      case "reports":
        router.navigate("/submit-incident");
        break;
      case "settings":
        Alert.alert("Coming Soon", "Settings feature is coming soon! Stay tuned.", [{ text: "OK" }]);
        break;
      case "profile":
        router.navigate("/profile");
        break;
      case "logout":
        logout();
        router.replace("/login");
        break;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Navigation functions
  const handleNavigateToHome = () => {
    router.navigate("/dashboard-citizen");
  };

  const handleNavigateToReports = () => {
    router.navigate("/submit-incident");
  };

  const handleNavigateToProfile = () => {
    router.navigate("/profile");
  };

  // ✅ OWM tile URL
  const weatherTileUrlTemplate =
    OWM_KEY && weatherLayer
      ? `https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`
      : null;

  // ✅ Intensity "contrast" tint on top of map
  const tintOpacity = intensity === "soft" ? 0.05 : intensity === "medium" ? 0.1 : 0.16;

  const stackTiles = intensity !== "soft";

  const effectiveOpacity =
    intensity === "soft"
      ? weatherOpacity
      : intensity === "medium"
      ? Math.min(0.9, weatherOpacity + 0.1)
      : Math.min(0.95, weatherOpacity + 0.18);

  // 🥇 Feature 1: Dim overlay animation
  const overlayOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Handle view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);

    // ✅ NEW: when switching to risk, fetch overlay immediately
    if (mode === "risk") {
      setRiskOverlay(null);
      setRiskErr("");
      setTimeout(() => fetchRiskOverlayForCurrentView(userRegion || fallbackRegion), 250);
    } else {
      setRiskOverlay(null);
      setRiskErr("");
      lastRiskKey.current = "";
    }
  };

  // Floating action menu items (removed boundaries)
  const menuItems = [
    {
      id: "normal",
      label: "Normal View",
      icon: "📍",
      color: "#3b82f6",
      active: viewMode === "normal",
      onPress: () => handleViewModeChange("normal"),
    },
    {
      id: "weather",
      label: "Weather View",
      icon: "🌤️",
      color: "#8b5cf6",
      active: viewMode === "weather",
      onPress: () => handleViewModeChange("weather"),
    },
    {
      id: "heatmap",
      label: "Incident Heatmap",
      icon: "🔥",
      color: "#f59e0b",
      active: viewMode === "heatmap",
      onPress: () => handleViewModeChange("heatmap"),
    },
    // ✅ NEW: Risk overlay mode
    {
      id: "risk",
      label: "Flood Risk Overlay",
      icon: "🌊",
      color: "#ef4444",
      active: viewMode === "risk",
      onPress: () => handleViewModeChange("risk"),
    },
    {
      id: "weather_settings",
      label: "Weather Settings",
      icon: "🎚️",
      color: "#8b5cf6",
      active: false,
      onPress: () => setShowWeatherSettings(true),
    },
    {
      id: "recenter",
      label: "Recenter Map",
      icon: "📍",
      color: "#2563eb",
      active: false,
      onPress: onRecenter,
    },
    {
      id: "refresh",
      label: "Refresh Data",
      icon: "🔄",
      color: "#16a34a",
      active: false,
      onPress: onRefresh,
    },
  ];

  // Current active layer info for legend (removed boundaries)
  const getActiveLayerInfo = () => {
    switch (viewMode) {
      case "weather":
        return {
          title: "Weather Overlay",
          subtitle:
            weatherLayer === "temp_new"
              ? "🌡️ Temperature"
              : weatherLayer === "precipitation_new"
              ? "🌧️ Precipitation"
              : weatherLayer === "clouds_new"
              ? "☁️ Cloud Coverage"
              : "💨 Wind Speed",
        };
      case "heatmap":
        return {
          title: "Incident Density Heatmap",
          subtitle: "Shows incident concentration hotspots",
        };
      case "risk":
        return {
          title: "Flood Risk Overlay",
          subtitle: "Predictive risk zones (GeoJSON polygons)",
        };
      default:
        return {
          title: "Normal View",
          subtitle: "Incidents with severity zones",
        };
    }
  };

  const activeLayerInfo = getActiveLayerInfo();

  return (
    <View style={[MapStyles.container, isDarkMode && MapStyles.containerDark]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="none" onRequestClose={toggleMenu}>
        <TouchableOpacity style={MapStyles.menuBackdrop} activeOpacity={1} onPress={toggleMenu}>
          <Animated.View
            style={[
              MapStyles.menuContainer,
              {
                transform: [{ translateX: menuTranslateX }],
                opacity: menuOpacity,
              },
            ]}
          >
            <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={MapStyles.menuBlurView}>
              <LinearGradient
                colors={
                  isDarkMode
                    ? ["rgba(26, 32, 44, 0.98)", "rgba(45, 55, 72, 0.95)"]
                    : ["rgba(255, 255, 255, 0.98)", "rgba(250, 251, 252, 0.95)"]
                }
                style={MapStyles.menuGradient}
              />

              <View style={MapStyles.menuHeader}>
                <Text style={[MapStyles.menuTitle, isDarkMode && MapStyles.menuTitleDark]}>Menu</Text>
                <TouchableOpacity onPress={toggleMenu} style={MapStyles.menuCloseButton}>
                  <Text style={[MapStyles.menuCloseIcon, isDarkMode && MapStyles.menuCloseIconDark]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={MapStyles.menuItems}>
                <TouchableOpacity style={MapStyles.menuItem} onPress={() => handleMenuOption("homepage")}>
                  <View style={MapStyles.menuIconContainer}>
                    <Text style={[MapStyles.menuIcon, isDarkMode && MapStyles.menuIconDark]}>🏠</Text>
                  </View>
                  <Text style={[MapStyles.menuItemText, isDarkMode && MapStyles.menuItemTextDark]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[MapStyles.menuItem, MapStyles.menuItemActive]} onPress={() => handleMenuOption("map")}>
                  <View style={[MapStyles.menuIconContainer, MapStyles.menuIconActive]}>
                    <Text style={MapStyles.menuIcon}>🗺️</Text>
                  </View>
                  <Text style={[MapStyles.menuItemText, MapStyles.menuItemTextActive]}>Map</Text>
                </TouchableOpacity>

                <TouchableOpacity style={MapStyles.menuItem} onPress={() => handleMenuOption("reports")}>
                  <View style={MapStyles.menuIconContainer}>
                    <Text style={[MapStyles.menuIcon, isDarkMode && MapStyles.menuIconDark]}>📋</Text>
                  </View>
                  <Text style={[MapStyles.menuItemText, isDarkMode && MapStyles.menuItemTextDark]}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={MapStyles.menuItem} onPress={() => handleMenuOption("profile")}>
                  <View style={MapStyles.menuIconContainer}>
                    <Text style={[MapStyles.menuIcon, isDarkMode && MapStyles.menuIconDark]}>👤</Text>
                  </View>
                  <Text style={[MapStyles.menuItemText, isDarkMode && MapStyles.menuItemTextDark]}>Profile</Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={[MapStyles.menuItem, MapStyles.menuItemLogout]} onPress={() => handleMenuOption("logout")}>
                  <View style={[MapStyles.menuIconContainer, MapStyles.menuIconLogout]}>
                    <Text style={MapStyles.menuIconLogoutText}>🚪</Text>
                  </View>
                  <Text style={[MapStyles.menuItemText, MapStyles.menuItemTextLogout]}>Logout</Text>
                </TouchableOpacity>
              </View>

              <View style={MapStyles.menuFooter}>
                <Text style={[MapStyles.menuFooterText, isDarkMode && MapStyles.menuFooterTextDark]}>
                  ResQMap v1.0 • {user?.name || "Guest"}
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Top Navigation Bar */}
      <View style={[MapStyles.topNavBar, isDarkMode && MapStyles.topNavBarDark]}>
        <View style={MapStyles.topNavBarContent}>
          <View style={MapStyles.topNavBarLeft}>
            <Text style={[MapStyles.pageTitle, isDarkMode && MapStyles.pageTitleDark]}>Live Map</Text>
            <Text style={[MapStyles.pageSubtitle, isDarkMode && MapStyles.pageSubtitleDark]}>
              {activeLayerInfo.title}
            </Text>
          </View>

          <View style={MapStyles.topNavBarRight}>
            <TouchableOpacity
              style={[MapStyles.darkModeToggle, isDarkMode && MapStyles.darkModeToggleActive]}
              onPress={toggleDarkMode}
            >
              <View style={[MapStyles.toggleKnob, isDarkMode && MapStyles.toggleKnobActive]}>
                <Text style={MapStyles.toggleIcon}>{isDarkMode ? "🌙" : "☀️"}</Text>
              </View>
              <Text style={[MapStyles.toggleText, isDarkMode && MapStyles.toggleTextDark]}>
                {isDarkMode ? "Dark" : "Light"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={MapStyles.menuButton} onPress={toggleMenu}>
              <View style={[MapStyles.menuLine, isDarkMode && MapStyles.menuLineDark]} />
              <View style={[MapStyles.menuLine, isDarkMode && MapStyles.menuLineDark]} />
              <View style={[MapStyles.menuLine, isDarkMode && MapStyles.menuLineDark]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Nearby Alert Banner */}
      {nearbyAlert && (
        <View style={MapStyles.alertBanner}>
          <Text style={MapStyles.alertText}>{nearbyAlert}</Text>
          <TouchableOpacity onPress={() => setNearbyAlert(null)}>
            <Text style={MapStyles.alertClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!err && (
        <View style={[MapStyles.errorContainer, isDarkMode && MapStyles.errorContainerDark]}>
          <Text style={MapStyles.errorText}>Error: {err}</Text>
        </View>
      )}

      {/* ✅ NEW: risk overlay error banner */}
      {!!riskErr && viewMode === "risk" && (
        <View style={[MapStyles.errorContainer, isDarkMode && MapStyles.errorContainerDark]}>
          <Text style={MapStyles.errorText}>Risk Overlay: {riskErr}</Text>
        </View>
      )}

      {!OWM_KEY && (
        <View style={[MapStyles.warningContainer, isDarkMode && MapStyles.warningContainerDark]}>
          <Text style={[MapStyles.warningText, isDarkMode && MapStyles.warningTextDark]}>
            Missing EXPO_PUBLIC_OPENWEATHER_API_KEY in env. Weather overlay disabled.
          </Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={MapStyles.mapContainer}
        initialRegion={regionToUse}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={clearSelection}
      >
        {/* Risk Overlay (ONLY in risk mode) */}
        {viewMode === "risk" && <FloodRiskOverlay geojson={riskOverlay} visible={true} />}

        {/* Heatmap mode */}
        {viewMode === "heatmap" && <IncidentDensityHeatmap incidents={incidents} visible={true} />}

        {/* Weather overlay (ONLY in weather mode) */}
        {viewMode === "weather" && weatherTileUrlTemplate && (
          <>
            <UrlTile
              urlTemplate={weatherTileUrlTemplate}
              zIndex={1}
              minimumZ={0}
              maximumZ={19}
              opacity={effectiveOpacity}
              shouldReplaceMapContent={false}
            />
            {stackTiles && (
              <UrlTile
                urlTemplate={weatherTileUrlTemplate}
                zIndex={2}
                minimumZ={0}
                maximumZ={19}
                opacity={Math.min(0.95, effectiveOpacity * 0.85)}
                shouldReplaceMapContent={false}
              />
            )}
          </>
        )}

        {/* Severity Zones (ONLY in normal mode) */}
        {showSeverityZones &&
          incidents.map((inc) => (
            <Circle
              key={`zone-${inc.id}`}
              center={{ latitude: inc.latitude, longitude: inc.longitude }}
              radius={severityToRadius(inc.severity)}
              strokeColor={severityToPinColor(inc.severity)}
              fillColor={severityToFillColor(inc.severity)}
              strokeWidth={selectedIncident?.id === inc.id ? 3 : 1}
              zIndex={selectedIncident?.id === inc.id ? 5 : 2}
            />
          ))}

        {/* Incident markers (ALWAYS visible except in pure weather mode) */}
        {viewMode !== "weather" &&
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              coordinate={{ latitude: inc.latitude, longitude: inc.longitude }}
              pinColor={severityToPinColor(inc.severity)}
              title={inc.type || "Incident"}
              description={inc.severity ? `Severity: ${inc.severity}` : undefined}
              zIndex={10}
              onPress={() => handleIncidentSelect(inc)}
              tracksViewChanges={false}
            >
              <Callout onPress={() => handleIncidentSelect(inc)}>
                <View style={[MapStyles.calloutContainer, isDarkMode && MapStyles.calloutContainerDark]}>
                  <View
                    style={[
                      MapStyles.calloutHeader,
                      { borderLeftColor: severityToPinColor(inc.severity) },
                    ]}
                  >
                    <Text style={[MapStyles.calloutTitle, isDarkMode && MapStyles.calloutTitleDark]}>
                      {inc.type || "Incident"}
                    </Text>
                    <View
                      style={[
                        MapStyles.severityBadge,
                        { backgroundColor: severityToPinColor(inc.severity) },
                      ]}
                    >
                      <Text style={MapStyles.severityBadgeText}>{inc.severity || "Unknown"}</Text>
                    </View>
                  </View>

                  {!!inc.status && (
                    <Text style={[isDarkMode && { color: "#cbd5e0" }, { fontSize: 12, marginTop: 4 }]}>
                      Status: {inc.status}
                    </Text>
                  )}

                  {!!inc.fullAddress && (
                    <Text numberOfLines={2} style={[MapStyles.calloutAddress, isDarkMode && MapStyles.calloutAddressDark]}>
                      📍 {inc.fullAddress}
                    </Text>
                  )}

                  {!!inc.description && (
                    <Text numberOfLines={2} style={[MapStyles.calloutDescription, isDarkMode && MapStyles.calloutDescriptionDark]}>
                      {inc.description}
                    </Text>
                  )}

                  <Text style={[MapStyles.calloutTap, isDarkMode && MapStyles.calloutTapDark]}>
                    Tap for details →
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

        {/* Selected incident highlight */}
        {selectedIncident && (
          <>
            <Circle
              center={{ latitude: selectedIncident.latitude, longitude: selectedIncident.longitude }}
              radius={severityToRadius(selectedIncident.severity) * 1.5}
              strokeColor={severityToPinColor(selectedIncident.severity)}
              fillColor={severityToFillColor(selectedIncident.severity)}
              strokeWidth={4}
              zIndex={6}
            />
            <Circle
              center={{ latitude: selectedIncident.latitude, longitude: selectedIncident.longitude }}
              radius={severityToRadius(selectedIncident.severity) * 1.2}
              strokeColor={severityToPinColor(selectedIncident.severity)}
              fillColor="transparent"
              strokeWidth={2}
              zIndex={7}
            />
          </>
        )}
      </MapView>

      {/* Dim overlay when incident selected */}
      {mapDimmed && (
        <Animated.View
          style={[
            MapStyles.dimOverlay,
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: overlayOpacity,
              zIndex: 3,
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* contrast tint overlay (weather only) */}
      {viewMode === "weather" && weatherTileUrlTemplate && (
        <View
          pointerEvents="none"
          style={[
            MapStyles.contrastTint,
            { backgroundColor: `rgba(0,0,0,${tintOpacity})` },
          ]}
        />
      )}

      {/* Active Layer Legend (removed boundaries section) */}
      <View style={[MapStyles.activeLayerLegend, isDarkMode && MapStyles.activeLayerLegendDark]}>
        <Text style={[MapStyles.activeLayerTitle, isDarkMode && MapStyles.activeLayerTitleDark]}>
          {activeLayerInfo.title}
        </Text>
        <Text style={[MapStyles.activeLayerSubtitle, isDarkMode && MapStyles.activeLayerSubtitleDark]}>
          {activeLayerInfo.subtitle}
        </Text>

        {viewMode === "normal" && (
          <View style={MapStyles.legendItems}>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "#ef4444" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>High Severity</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "#f97316" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Medium Severity</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "#22c55e" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Low Severity</Text>
            </View>
          </View>
        )}

        {viewMode === "weather" && (
          <View style={MapStyles.legendItems}>
            <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>
              Intensity: {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
            </Text>
            <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>
              Opacity: {Math.round(weatherOpacity * 100)}%
            </Text>
          </View>
        )}

        {viewMode === "heatmap" && (
          <View style={MapStyles.legendItems}>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(255, 0, 0, 0.6)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>High Density</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(255, 165, 0, 0.5)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Medium Density</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(0, 255, 0, 0.2)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Low Density</Text>
            </View>
          </View>
        )}

        {/* ✅ NEW: Risk overlay legend */}
        {viewMode === "risk" && (
          <View style={MapStyles.legendItems}>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(239, 68, 68, 0.8)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Extreme</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(249, 115, 22, 0.8)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>High</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(234, 179, 8, 0.8)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Medium</Text>
            </View>
            <View style={MapStyles.legendItem}>
              <View style={[MapStyles.legendColor, { backgroundColor: "rgba(34, 197, 94, 0.8)" }]} />
              <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark]}>Low</Text>
            </View>

            {/* Optional status line */}
            <Text style={[MapStyles.legendLabel, isDarkMode && MapStyles.legendLabelDark, { marginTop: 6 }]}>
              {riskLoading ? "Loading overlay..." : riskOverlay?.features?.length ? `Cells: ${riskOverlay.features.length}` : "No overlay data"}
            </Text>
          </View>
        )}
      </View>

      {/* Floating Action Menu */}
      <FloatingActionMenu isDarkMode={isDarkMode} items={menuItems} />

      {/* Weather Settings Modal */}
      {showWeatherSettings && (
        <View style={[MapStyles.weatherSettingsModal, isDarkMode && MapStyles.weatherSettingsModalDark]}>
          <Text style={[MapStyles.weatherSettingsTitle, isDarkMode && MapStyles.weatherSettingsTitleDark]}>
            Weather Settings
          </Text>

          <Text style={[MapStyles.weatherSettingsLabel, isDarkMode && MapStyles.weatherSettingsLabelDark]}>
            Intensity: {intensity}
          </Text>

          <View style={MapStyles.weatherSettingsButtons}>
            {["soft", "medium", "strong"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  MapStyles.weatherSettingsButton,
                  intensity === level && MapStyles.weatherSettingsButtonActive,
                  isDarkMode && MapStyles.weatherSettingsButtonDark,
                ]}
                onPress={() => setIntensity(level as any)}
              >
                <Text
                  style={[
                    MapStyles.weatherSettingsButtonText,
                    intensity === level && MapStyles.weatherSettingsButtonTextActive,
                    isDarkMode && MapStyles.weatherSettingsButtonTextDark,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[MapStyles.weatherSettingsLabel, isDarkMode && MapStyles.weatherSettingsLabelDark]}>
            Opacity: {Math.round(weatherOpacity * 100)}%
          </Text>

          <View style={MapStyles.weatherSettingsSlider}>
            <TouchableOpacity onPress={() => setWeatherOpacity(Math.max(0.3, weatherOpacity - 0.1))}>
              <Text style={[MapStyles.weatherSettingsIcon, isDarkMode && MapStyles.weatherSettingsIconDark]}>-</Text>
            </TouchableOpacity>

            <View style={[MapStyles.weatherSettingsTrack, isDarkMode && MapStyles.weatherSettingsTrackDark]}>
              <View style={[MapStyles.weatherSettingsProgress, { width: `${weatherOpacity * 100}%` }]} />
            </View>

            <TouchableOpacity onPress={() => setWeatherOpacity(Math.min(0.9, weatherOpacity + 0.1))}>
              <Text style={[MapStyles.weatherSettingsIcon, isDarkMode && MapStyles.weatherSettingsIconDark]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={MapStyles.weatherSettingsDone} onPress={() => setShowWeatherSettings(false)}>
            <Text style={MapStyles.weatherSettingsDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Incident Detail Sheet */}
      {selectedIncident && sheetVisible && (
        <IncidentDetailSheet incident={selectedIncident} sheetAnim={sheetAnim} onClose={clearSelection} isDarkMode={isDarkMode} />
      )}

      {/* Zoom toast */}
      {showToast && (
        <View style={MapStyles.toastWrap}>
          <View style={MapStyles.toast}>
            <Text style={MapStyles.toastText}>{toastMsg}</Text>
          </View>
        </View>
      )}

      {/* Loading overlay */}
      {(loading || locLoading || (riskLoading && viewMode === "risk")) && (
        <View style={MapStyles.loadingWrap}>
          <View style={[MapStyles.loadingCard, isDarkMode && MapStyles.loadingCardDark]}>
            <ActivityIndicator color={isDarkMode ? "#fff" : "#000"} />
            <Text style={{ marginLeft: 10, color: isDarkMode ? "#fff" : "#000", fontSize: 13 }}>
              {locLoading ? "Getting location..." : riskLoading && viewMode === "risk" ? "Loading risk overlay..." : "Fetching incidents..."}
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Navigation */}
      <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={MapStyles.navBarBlur}>
        <View style={[MapStyles.navBar, isDarkMode && MapStyles.navBarDark]}>
          <TouchableOpacity style={MapStyles.navItem} onPress={handleNavigateToHome}>
            <View style={MapStyles.navIconContainer}>
              <Text style={[MapStyles.navIcon, MapStyles.navIconInactive]}>🏠</Text>
            </View>
            <Text style={[MapStyles.navText, MapStyles.navTextInactive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MapStyles.navItem}>
            <View style={[MapStyles.navIconContainer, MapStyles.navIconContainerActive]}>
              <LinearGradient colors={["#FF6B35", "#FF8E35"]} style={MapStyles.navIconGradient}>
                <Text style={MapStyles.navIcon}>🗺️</Text>
              </LinearGradient>
            </View>
            <Text style={[MapStyles.navText, MapStyles.navTextActive]}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MapStyles.navItem} onPress={handleNavigateToReports}>
            <View style={MapStyles.navIconContainer}>
              <Text style={[MapStyles.navIcon, MapStyles.navIconInactive]}>📋</Text>
            </View>
            <Text style={[MapStyles.navText, MapStyles.navTextInactive]}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MapStyles.navItem} onPress={handleNavigateToProfile}>
            <View style={MapStyles.navIconContainer}>
              <Text style={[MapStyles.navIcon, MapStyles.navIconInactive]}>👤</Text>
            </View>
            <Text style={[MapStyles.navText, MapStyles.navTextInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}