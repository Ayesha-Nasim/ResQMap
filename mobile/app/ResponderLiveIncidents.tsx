import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Linking,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { ResponderLiveStyles } from "../styles/ResponderLiveStyles";

type Severity = "low" | "medium" | "high" | "pending";
type IncidentStatus =
  | "verified"
  | "pending_review"
  | "triaged"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected";

type Incident = {
  id: string;
  type: string;
  description?: string;
  fullAddress?: string | null;
  severity?: Severity;
  status?: IncidentStatus;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
  assignedTo?: string | null;
  assignedAt?: any;
  createdAt?: any;
  triagedBy?: string | null;
  triagedAt?: any;
  triageSource?: string | null;
};

const ACTIVE_STATUSES: IncidentStatus[] = ["triaged", "assigned", "in_progress"];

type TabKey = "verified" | "unverified";

export default function ResponderLiveIncidents(): React.JSX.Element {
  const router = useRouter();
  const { user, token } = useAuth();

  const [tab, setTab] = useState<TabKey>("verified");
  const [availableIncidents, setAvailableIncidents] = useState<Incident[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pickingId, setPickingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(60))[0];
  const headerSlideAnim = useState(new Animated.Value(-50))[0];
  const cardScaleAnim = useState(new Animated.Value(0.9))[0];
  const themeSwitchAnim = useState(new Animated.Value(0))[0];

  const responderId = user?.id || "";

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, [token]);

  const canPickMore = activeCount < 2;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeStatus = (s?: string) => String(s || "").toLowerCase().trim();
  const isVerified = (s?: string) => normalizeStatus(s) === "verified";
  const isPendingReview = (s?: string) => normalizeStatus(s) === "pending_review";
  const isTriaged = (s?: string) => normalizeStatus(s) === "triaged";

  const fetchData = useCallback(async () => {
    if (!responderId) {
      setErrorMessage("Responder not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const statusParam = tab === "verified" ? "verified" : "pending_review";

      const availableReq = api.get("/incidents/map", {
        params: { status: statusParam, limit: 200 },
        headers: authHeaders,
      });

      const assignedReq = api.get(`/incidents/assigned/${responderId}`, {
        headers: authHeaders,
      });

      const [availableRes, assignedRes] = await Promise.all([
        availableReq,
        assignedReq,
      ]);

      const availList: Incident[] = availableRes.data?.incidents || [];
      const assignedList: Incident[] = assignedRes.data?.incidents || [];

      const myActive = assignedList.filter((i) =>
        ACTIVE_STATUSES.includes((i.status || "assigned") as IncidentStatus)
      );

      setAvailableIncidents(availList);
      setActiveCount(myActive.length);
    } catch (err: any) {
      console.error("ResponderLiveIncidents fetch error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load incidents.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authHeaders, responderId, tab]);

  useFocusEffect(
    useCallback(() => {
      void fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const openMap = (lat?: number, lng?: number) => {
    if (lat == null || lng == null) {
      Alert.alert("No location", "This incident does not have coordinates.");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open Google Maps."));
  };

  const openImage = (url?: string | null) => {
    if (!url) return;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open image link."));
  };

  const handlePickIncident = async (incidentId: string, incidentStatus?: IncidentStatus) => {
    if (!responderId) return;

    if (!canPickMore) {
      Alert.alert(
        "Limit reached",
        "You can only have 2 active incidents (triaged/assigned/in progress). Resolve one first."
      );
      return;
    }

    if (incidentStatus === "pending_review") {
      Alert.alert(
        "Unverified Incident",
        "This report is not admin-verified. Do you want to TRIAGE it and take responsibility?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Triage & Pick",
            style: "destructive",
            onPress: () => void pickNow(incidentId),
          },
        ]
      );
      return;
    }

    await pickNow(incidentId);
  };

  const pickNow = async (incidentId: string) => {
    try {
      setPickingId(incidentId);
      setErrorMessage("");

      const res = await api.patch(
        `/incidents/${incidentId}/pick`,
        {},
        { headers: authHeaders }
      );

      await fetchData();

      Alert.alert(
        "Success",
        res?.data?.mode === "triaged"
          ? "Incident triaged and assigned to you."
          : "Incident picked successfully!"
      );
    } catch (err: any) {
      console.error("Pick incident error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to pick incident.";

      setErrorMessage(msg);

      if (String(msg).toLowerCase().includes("maximum 2")) {
        Alert.alert(
          "Limit reached",
          "You already have 2 active incidents. Resolve one first."
        );
      }
    } finally {
      setPickingId(null);
    }
  };

  const toggleIncidentDetails = (incidentId: string) => {
    setSelectedIncident(selectedIncident === incidentId ? null : incidentId);
  };

  const toggleTheme = () => {
    Animated.timing(themeSwitchAnim, {
      toValue: isDarkTheme ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsDarkTheme(!isDarkTheme);
  };

  const getStatusColor = (status?: string) => {
    const s = normalizeStatus(status);
    switch (s) {
      case "verified":
        return "#4CAF50";
      case "pending_review":
        return "#FFA500";
      case "triaged":
        return "#8B5CF6";
      case "assigned":
        return "#FFA500";
      case "in_progress":
        return "#FF6B35";
      case "resolved":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FFA500";
      case "low":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  return (
    <View style={isDarkTheme ? ResponderLiveStyles.container : ResponderLiveStyles.containerLight}>
      {/* Background Overlay */}
      <View
        style={[
          ResponderLiveStyles.backgroundOverlay,
          isDarkTheme ? ResponderLiveStyles.backgroundOverlayDark : ResponderLiveStyles.backgroundOverlayLight,
        ]}
      />

      {/* Theme Toggle */}
      <Animated.View
        style={[
          ResponderLiveStyles.themeToggleContainer,
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
            ResponderLiveStyles.themeToggle,
            isDarkTheme ? ResponderLiveStyles.themeToggleDark : ResponderLiveStyles.themeToggleLight,
          ]}
          onPress={toggleTheme}
        >
          <Ionicons name={isDarkTheme ? "moon" : "sunny"} size={24} color="#FF6B35" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={ResponderLiveStyles.scrollView}
        contentContainerStyle={ResponderLiveStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B35"
            colors={["#FF6B35"]}
          />
        }
      >
        {/* Header */}
        <Animated.View
          style={[
            ResponderLiveStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: headerSlideAnim }],
            },
          ]}
        >
          <Text
            style={[
              ResponderLiveStyles.titleText,
              isDarkTheme ? ResponderLiveStyles.titleTextDark : ResponderLiveStyles.titleTextLight,
            ]}
          >
            LIVE INCIDENTS
          </Text>

          <View style={ResponderLiveStyles.titleContainer}>
            <Text style={[ResponderLiveStyles.title, isDarkTheme ? ResponderLiveStyles.titleDark : ResponderLiveStyles.titleLight]}>
              ResQ<Text style={ResponderLiveStyles.titleAccent}>Live</Text>
            </Text>
          </View>

          <Text style={[ResponderLiveStyles.subtitle, isDarkTheme ? ResponderLiveStyles.subtitleDark : ResponderLiveStyles.subtitleLight]}>
            Logged in as: {user?.name || "Responder"} ({user?.role || "—"})
          </Text>
        </Animated.View>

        {/* Tabs */}
        <Animated.View
          style={[
            ResponderLiveStyles.tabContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              ResponderLiveStyles.tab,
              tab === "verified" && ResponderLiveStyles.tabActive,
              isDarkTheme ? ResponderLiveStyles.tabDark : ResponderLiveStyles.tabLight,
            ]}
            onPress={() => setTab("verified")}
            disabled={loading}
          >
            <Text
              style={[
                ResponderLiveStyles.tabText,
                tab === "verified" && ResponderLiveStyles.tabTextActive,
                isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight,
              ]}
            >
              Verified
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              ResponderLiveStyles.tab,
              tab === "unverified" && ResponderLiveStyles.tabActive,
              isDarkTheme ? ResponderLiveStyles.tabDark : ResponderLiveStyles.tabLight,
            ]}
            onPress={() => setTab("unverified")}
            disabled={loading}
          >
            <Text
              style={[
                ResponderLiveStyles.tabText,
                tab === "unverified" && ResponderLiveStyles.tabTextActive,
                isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight,
              ]}
            >
              Unverified
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Summary */}
        <Animated.View
          style={[
            ResponderLiveStyles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View
            style={[
              ResponderLiveStyles.statCard,
              isDarkTheme ? ResponderLiveStyles.statCardDark : ResponderLiveStyles.statCardLight,
            ]}
          >
            <Text style={ResponderLiveStyles.statNumber}>{availableIncidents.length}</Text>
            <Text
              style={[
                ResponderLiveStyles.statLabel,
                isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
              ]}
            >
              Available
            </Text>
          </View>

          <View
            style={[
              ResponderLiveStyles.statCard,
              isDarkTheme ? ResponderLiveStyles.statCardDark : ResponderLiveStyles.statCardLight,
            ]}
          >
            <Text style={[ResponderLiveStyles.statNumber, { color: "#FF6B35" }]}>{activeCount}</Text>
            <Text
              style={[
                ResponderLiveStyles.statLabel,
                isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
              ]}
            >
              Active
            </Text>
          </View>

          <View
            style={[
              ResponderLiveStyles.statCard,
              isDarkTheme ? ResponderLiveStyles.statCardDark : ResponderLiveStyles.statCardLight,
            ]}
          >
            <Text style={[ResponderLiveStyles.statNumber, { color: "#4CAF50" }]}>{2 - activeCount}</Text>
            <Text
              style={[
                ResponderLiveStyles.statLabel,
                isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
              ]}
            >
              Slots Left
            </Text>
          </View>
        </Animated.View>

        {/* Warning Message - When limit reached */}
        {!canPickMore && (
          <Animated.View
            style={[
              ResponderLiveStyles.warningContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#FFA500" />
            <Text style={ResponderLiveStyles.warningText}>
              Maximum limit reached. Resolve an active incident to pick more.
            </Text>
          </Animated.View>
        )}

        {/* Info Message - For unverified tab */}
        {tab === "unverified" && (
          <Animated.View
            style={[
              ResponderLiveStyles.infoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Ionicons name="information-circle" size={20} color="#8B5CF6" />
            <Text style={ResponderLiveStyles.infoText}>
              Unverified reports can be picked as TRIAGED. Admin will audit later.
            </Text>
          </Animated.View>
        )}

        {/* Action Buttons Row */}
        <Animated.View
          style={[
            ResponderLiveStyles.actionRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              ResponderLiveStyles.actionRowButton,
              isDarkTheme ? ResponderLiveStyles.actionRowButtonDark : ResponderLiveStyles.actionRowButtonLight,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B35" />
            <Text style={[ResponderLiveStyles.actionRowButtonText, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              ResponderLiveStyles.actionRowButton,
              isDarkTheme ? ResponderLiveStyles.actionRowButtonDark : ResponderLiveStyles.actionRowButtonLight,
            ]}
            onPress={fetchData}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color="#FF6B35"
              style={loading ? ResponderLiveStyles.rotating : undefined}
            />
            <Text style={[ResponderLiveStyles.actionRowButtonText, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
              {loading ? "Loading..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Error Message */}
        {errorMessage ? (
          <Animated.View
            style={[
              ResponderLiveStyles.errorContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={ResponderLiveStyles.errorText}>{errorMessage}</Text>
          </Animated.View>
        ) : null}

        {/* Incidents List */}
        <Animated.View
          style={[
            ResponderLiveStyles.incidentsList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {loading && !refreshing && availableIncidents.length === 0 ? (
            <View style={ResponderLiveStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text
                style={[
                  ResponderLiveStyles.loadingText,
                  isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
                ]}
              >
                Loading incidents...
              </Text>
            </View>
          ) : !loading && availableIncidents.length === 0 ? (
            <View style={ResponderLiveStyles.emptyContainer}>
              <View
                style={[
                  ResponderLiveStyles.emptyIconContainer,
                  isDarkTheme ? ResponderLiveStyles.emptyIconContainerDark : ResponderLiveStyles.emptyIconContainerLight,
                ]}
              >
                <Ionicons name="document-text-outline" size={48} color="#FF6B35" />
              </View>
              <Text style={[ResponderLiveStyles.emptyTitle, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
                No {tab === "verified" ? "Verified" : "Unverified"} Incidents
              </Text>
              <Text style={[ResponderLiveStyles.emptyText, isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight]}>
                There are no {tab === "verified" ? "verified" : "unverified"} incidents available at the moment.
              </Text>
            </View>
          ) : (
            availableIncidents.map((incident) => {
              const status = incident.status || (tab === "verified" ? "verified" : "pending_review");
              const isSelected = selectedIncident === incident.id;

              return (
                <Animated.View
                  key={incident.id}
                  style={[
                    ResponderLiveStyles.incidentCard,
                    isDarkTheme ? ResponderLiveStyles.incidentCardDark : ResponderLiveStyles.incidentCardLight,
                    isSelected && ResponderLiveStyles.incidentCardExpanded,
                    { transform: [{ scale: cardScaleAnim }] },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => toggleIncidentDetails(incident.id)}
                    style={ResponderLiveStyles.incidentCardHeader}
                  >
                    <View style={ResponderLiveStyles.incidentCardHeaderLeft}>
                      <View style={[ResponderLiveStyles.statusIndicator, { backgroundColor: getStatusColor(status) }]} />
                      <View style={ResponderLiveStyles.incidentCardHeaderText}>
                        <Text
                          style={[
                            ResponderLiveStyles.incidentType,
                            isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight,
                          ]}
                          numberOfLines={1}
                        >
                          {incident.type || "Unspecified"}
                        </Text>
                        <View style={ResponderLiveStyles.incidentMetaRow}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={isDarkTheme ? "rgba(255,255,255,0.5)" : "#666"}
                          />
                          <Text
                            style={[
                              ResponderLiveStyles.incidentAddress,
                              isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
                            ]}
                            numberOfLines={1}
                          >
                            {incident.fullAddress?.split(",")[0] || "Location not specified"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={ResponderLiveStyles.incidentCardHeaderRight}>
                      <View
                        style={[
                          ResponderLiveStyles.severityBadge,
                          { backgroundColor: getSeverityColor(incident.severity) + "20" },
                        ]}
                      >
                        <Text style={[ResponderLiveStyles.severityText, { color: getSeverityColor(incident.severity) }]}>
                          {incident.severity || "N/A"}
                        </Text>
                      </View>
                      <Ionicons
                        name={isSelected ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#FF6B35"
                      />
                    </View>
                  </TouchableOpacity>

                  {isSelected && (
                    <Animated.View style={[ResponderLiveStyles.incidentDetails, { opacity: fadeAnim }]}>
                      <View style={ResponderLiveStyles.divider} />

                      <View style={ResponderLiveStyles.detailSection}>
                        <Text style={[ResponderLiveStyles.detailLabel, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
                          Status
                        </Text>
                        <View style={ResponderLiveStyles.detailStatusRow}>
                          <View
                            style={[
                              ResponderLiveStyles.detailStatusBadge,
                              { backgroundColor: getStatusColor(status) + "20" },
                            ]}
                          >
                            <Text style={[ResponderLiveStyles.detailStatusText, { color: getStatusColor(status) }]}>
                              {String(status).replace("_", " ").toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={ResponderLiveStyles.detailSection}>
                        <Text style={[ResponderLiveStyles.detailLabel, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
                          Description
                        </Text>
                        <Text
                          style={[
                            ResponderLiveStyles.detailText,
                            isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
                          ]}
                        >
                          {incident.description || "No description provided."}
                        </Text>
                      </View>

                      <View style={ResponderLiveStyles.detailSection}>
                        <Text style={[ResponderLiveStyles.detailLabel, isDarkTheme ? ResponderLiveStyles.textDark : ResponderLiveStyles.textLight]}>
                          Address
                        </Text>
                        <Text
                          style={[
                            ResponderLiveStyles.detailText,
                            isDarkTheme ? ResponderLiveStyles.textSecondaryDark : ResponderLiveStyles.textSecondaryLight,
                          ]}
                        >
                          {incident.fullAddress || "Location not available"}
                        </Text>
                      </View>

                      {/* Action Buttons */}
                      <View style={ResponderLiveStyles.actionButtonsContainer}>
                        <TouchableOpacity 
                          style={[ResponderLiveStyles.actionButton, ResponderLiveStyles.mapButton]} 
                          onPress={() => openMap(incident.latitude, incident.longitude)}
                        >
                          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
                          <Text style={ResponderLiveStyles.actionButtonText}>Map</Text>
                        </TouchableOpacity>

                        {incident.imageUrl && (
                          <TouchableOpacity 
                            style={[ResponderLiveStyles.actionButton, ResponderLiveStyles.imageButton]} 
                            onPress={() => openImage(incident.imageUrl)}
                          >
                            <Ionicons name="image-outline" size={18} color="#FFFFFF" />
                            <Text style={ResponderLiveStyles.actionButtonText}>Image</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Pick Button */}
                      <View style={ResponderLiveStyles.pickButtonContainer}>
                        <TouchableOpacity
                          style={[
                            ResponderLiveStyles.pickButton,
                            (!canPickMore || pickingId === incident.id) && ResponderLiveStyles.pickButtonDisabled,
                            status === "pending_review" ? ResponderLiveStyles.triageButton : ResponderLiveStyles.pickButtonActive,
                          ]}
                          onPress={() => handlePickIncident(incident.id, status as IncidentStatus)}
                          disabled={!canPickMore || pickingId === incident.id}
                        >
                          {pickingId === incident.id ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              <Ionicons 
                                name={status === "pending_review" ? "warning-outline" : "checkmark-circle-outline"} 
                                size={18} 
                                color="#FFFFFF" 
                              />
                              <Text style={ResponderLiveStyles.pickButtonText}>
                                {status === "pending_review" ? "Triage & Pick" : "Pick Incident"}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })
          )}
        </Animated.View>

        {/* Footer Info */}
        <Animated.View
          style={[
            ResponderLiveStyles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={[ResponderLiveStyles.footerInfo, isDarkTheme ? ResponderLiveStyles.footerInfoDark : ResponderLiveStyles.footerInfoLight]}>
            <Ionicons name="information-circle" size={20} color="#FF6B35" style={ResponderLiveStyles.infoIcon} />
            <Text style={[ResponderLiveStyles.footerText, isDarkTheme ? ResponderLiveStyles.footerTextDark : ResponderLiveStyles.footerTextLight]}>
              Tap on any incident to view details. You can have up to 2 active incidents at a time.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}