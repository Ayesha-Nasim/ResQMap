import React, { useEffect, useState } from "react";
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
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { ViewStyles } from "../styles/ViewStyles";

type IncidentStatus = "assigned" | "triaged" | "in_progress" | "resolved" | string;

type Incident = {
  id: string;
  type?: string;
  description?: string;
  severity?: string;
  status?: IncidentStatus;
  fullAddress?: string;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
};

export default function ViewIncidents() {
  const router = useRouter();
  const { user, token } = useAuth();

  const responderId = user?.id;

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(60))[0];
  const headerSlideAnim = useState(new Animated.Value(-50))[0];
  const cardScaleAnim = useState(new Animated.Value(0.9))[0];
  const themeSwitchAnim = useState(new Animated.Value(0))[0];

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

    fetchAssigned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeStatus = (s?: string) => String(s || "").toLowerCase().trim();
  const isTriaged = (s?: string) => normalizeStatus(s) === "triaged";
  const isAssigned = (s?: string) => normalizeStatus(s) === "assigned" || isTriaged(s);
  const isInProgress = (s?: string) => normalizeStatus(s) === "in_progress";
  const isResolved = (s?: string) => normalizeStatus(s) === "resolved";

  const fetchAssigned = async () => {
    setErrMsg("");
    setLoading(true);

    try {
      if (!responderId) {
        setIncidents([]);
        setErrMsg("Responder ID not found. Please login again.");
        return;
      }

      const res = await api.get(`/incidents/assigned/${responderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setIncidents(res.data?.incidents || []);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch assigned incidents";
      setErrMsg(msg);
      setIncidents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssigned();
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

  const confirmAndUpdate = (incidentId: string, status: "in_progress" | "resolved") => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to mark this incident as "${status.replace("_", " ")}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", style: "default", onPress: () => updateProgress(incidentId, status) },
      ]
    );
  };

  const updateProgress = async (id: string, status: "in_progress" | "resolved") => {
    setUpdatingId(id);
    try {
      await api.patch(
        `/incidents/${id}/progress`,
        { status },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status } : inc)));

      Alert.alert("Updated", `Incident marked as ${status.replace("_", " ")}.`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update status";
      Alert.alert("Error", msg);
    } finally {
      setUpdatingId(null);
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
      case "assigned":
        return "#FFA500";
      case "triaged":
        return "#8B5CF6";
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

  // ✅ Triaged should be counted as Assigned (but status remains triaged)
  const assignedCount = incidents.filter((i) => isAssigned(i.status)).length;
  const resolvedCount = incidents.filter((i) => isResolved(i.status)).length;

  return (
    <View style={isDarkTheme ? ViewStyles.container : ViewStyles.containerLight}>
      {/* Background Overlay */}
      <View
        style={[
          ViewStyles.backgroundOverlay,
          isDarkTheme ? ViewStyles.backgroundOverlayDark : ViewStyles.backgroundOverlayLight,
        ]}
      />

      {/* Theme Toggle */}
      <Animated.View
        style={[
          ViewStyles.themeToggleContainer,
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
            ViewStyles.themeToggle,
            isDarkTheme ? ViewStyles.themeToggleDark : ViewStyles.themeToggleLight,
          ]}
          onPress={toggleTheme}
        >
          <Ionicons name={isDarkTheme ? "moon" : "sunny"} size={24} color="#FF6B35" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={ViewStyles.scrollView}
        contentContainerStyle={ViewStyles.scrollContainer}
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
            ViewStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: headerSlideAnim }],
            },
          ]}
        >
          <Text
            style={[
              ViewStyles.titleText,
              isDarkTheme ? ViewStyles.titleTextDark : ViewStyles.titleTextLight,
            ]}
          >
            ASSIGNED INCIDENTS
          </Text>

          <View style={ViewStyles.titleContainer}>
            <Text style={[ViewStyles.title, isDarkTheme ? ViewStyles.titleDark : ViewStyles.titleLight]}>
              ResQ<Text style={ViewStyles.titleAccent}>View</Text>
            </Text>
          </View>

          <Text style={[ViewStyles.subtitle, isDarkTheme ? ViewStyles.subtitleDark : ViewStyles.subtitleLight]}>
            Logged in as: {user?.name || "Responder"} ({user?.role || "—"})
          </Text>
        </Animated.View>

        {/* Stats Summary (Triaged card removed) */}
        <Animated.View
          style={[
            ViewStyles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View
            style={[
              ViewStyles.statCard,
              isDarkTheme ? ViewStyles.statCardDark : ViewStyles.statCardLight,
            ]}
          >
            <Text style={ViewStyles.statNumber}>{incidents.length}</Text>
            <Text
              style={[
                ViewStyles.statLabel,
                isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
              ]}
            >
              Total
            </Text>
          </View>

          <View
            style={[
              ViewStyles.statCard,
              isDarkTheme ? ViewStyles.statCardDark : ViewStyles.statCardLight,
            ]}
          >
            <Text style={[ViewStyles.statNumber, { color: "#FFA500" }]}>{assignedCount}</Text>
            <Text
              style={[
                ViewStyles.statLabel,
                isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
              ]}
            >
              Assigned
            </Text>
          </View>

          <View
            style={[
              ViewStyles.statCard,
              isDarkTheme ? ViewStyles.statCardDark : ViewStyles.statCardLight,
            ]}
          >
            <Text style={[ViewStyles.statNumber, { color: "#4CAF50" }]}>{resolvedCount}</Text>
            <Text
              style={[
                ViewStyles.statLabel,
                isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
              ]}
            >
              Resolved
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons Row */}
        <Animated.View
          style={[
            ViewStyles.actionRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              ViewStyles.actionRowButton,
              isDarkTheme ? ViewStyles.actionRowButtonDark : ViewStyles.actionRowButtonLight,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B35" />
            <Text style={[ViewStyles.actionRowButtonText, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              ViewStyles.actionRowButton,
              isDarkTheme ? ViewStyles.actionRowButtonDark : ViewStyles.actionRowButtonLight,
            ]}
            onPress={fetchAssigned}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color="#FF6B35"
              style={loading ? ViewStyles.rotating : undefined}
            />
            <Text style={[ViewStyles.actionRowButtonText, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
              {loading ? "Loading..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Error Message */}
        {errMsg ? (
          <Animated.View
            style={[
              ViewStyles.errorContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={ViewStyles.errorText}>{errMsg}</Text>
          </Animated.View>
        ) : null}

        {/* Incidents List */}
        <Animated.View
          style={[
            ViewStyles.incidentsList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {loading && !refreshing && incidents.length === 0 ? (
            <View style={ViewStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text
                style={[
                  ViewStyles.loadingText,
                  isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
                ]}
              >
                Loading incidents...
              </Text>
            </View>
          ) : !loading && incidents.length === 0 ? (
            <View style={ViewStyles.emptyContainer}>
              <View
                style={[
                  ViewStyles.emptyIconContainer,
                  isDarkTheme ? ViewStyles.emptyIconContainerDark : ViewStyles.emptyIconContainerLight,
                ]}
              >
                <Ionicons name="document-text-outline" size={48} color="#FF6B35" />
              </View>
              <Text style={[ViewStyles.emptyTitle, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
                No Assigned Incidents
              </Text>
              <Text style={[ViewStyles.emptyText, isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight]}>
                You dont have any incidents assigned to you at the moment.
              </Text>
            </View>
          ) : (
            incidents.map((i) => {
              const status = i.status || "—";
              const isSelected = selectedIncident === i.id;

              const inProgressDisabled =
                updatingId === i.id || isInProgress(status) || isResolved(status);

              const resolvedDisabled = updatingId === i.id || isResolved(status);

              return (
                <Animated.View
                  key={i.id}
                  style={[
                    ViewStyles.incidentCard,
                    isDarkTheme ? ViewStyles.incidentCardDark : ViewStyles.incidentCardLight,
                    isSelected && ViewStyles.incidentCardExpanded,
                    { transform: [{ scale: cardScaleAnim }] },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => toggleIncidentDetails(i.id)}
                    style={ViewStyles.incidentCardHeader}
                  >
                    <View style={ViewStyles.incidentCardHeaderLeft}>
                      <View style={[ViewStyles.statusIndicator, { backgroundColor: getStatusColor(i.status) }]} />
                      <View style={ViewStyles.incidentCardHeaderText}>
                        <Text
                          style={[
                            ViewStyles.incidentType,
                            isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight,
                          ]}
                          numberOfLines={1}
                        >
                          {i.type || "Unspecified"}
                        </Text>
                        <View style={ViewStyles.incidentMetaRow}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={isDarkTheme ? "rgba(255,255,255,0.5)" : "#666"}
                          />
                          <Text
                            style={[
                              ViewStyles.incidentAddress,
                              isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
                            ]}
                            numberOfLines={1}
                          >
                            {i.fullAddress?.split(",")[0] || "Location not specified"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={ViewStyles.incidentCardHeaderRight}>
                      <View
                        style={[
                          ViewStyles.severityBadge,
                          { backgroundColor: getSeverityColor(i.severity) + "20" },
                        ]}
                      >
                        <Text style={[ViewStyles.severityText, { color: getSeverityColor(i.severity) }]}>
                          {i.severity || "N/A"}
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
                    <Animated.View style={[ViewStyles.incidentDetails, { opacity: fadeAnim }]}>
                      <View style={ViewStyles.divider} />

                      <View style={ViewStyles.detailSection}>
                        <Text style={[ViewStyles.detailLabel, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
                          Status
                        </Text>
                        <View style={ViewStyles.detailStatusRow}>
                          <View
                            style={[
                              ViewStyles.detailStatusBadge,
                              { backgroundColor: getStatusColor(i.status) + "20" },
                            ]}
                          >
                            <Text style={[ViewStyles.detailStatusText, { color: getStatusColor(i.status) }]}>
                              {String(status).replace("_", " ").toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={ViewStyles.detailSection}>
                        <Text style={[ViewStyles.detailLabel, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
                          Description
                        </Text>
                        <Text
                          style={[
                            ViewStyles.detailText,
                            isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
                          ]}
                        >
                          {i.description || "—"}
                        </Text>
                      </View>

                      <View style={ViewStyles.detailSection}>
                        <Text style={[ViewStyles.detailLabel, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
                          Address
                        </Text>
                        <Text
                          style={[
                            ViewStyles.detailText,
                            isDarkTheme ? ViewStyles.textSecondaryDark : ViewStyles.textSecondaryLight,
                          ]}
                        >
                          {i.fullAddress || "—"}
                        </Text>
                      </View>

                      {/* Action Buttons */}
                      <View style={ViewStyles.actionButtonsContainer}>
                        <TouchableOpacity style={[ViewStyles.actionButton, ViewStyles.mapButton]} onPress={() => openMap(i.latitude, i.longitude)}>
                          <Ionicons name="map-outline" size={18} color="#FFFFFF" />
                          <Text style={ViewStyles.actionButtonText}>Map</Text>
                        </TouchableOpacity>

                        {i.imageUrl && (
                          <TouchableOpacity style={[ViewStyles.actionButton, ViewStyles.imageButton]} onPress={() => openImage(i.imageUrl)}>
                            <Ionicons name="image-outline" size={18} color="#FFFFFF" />
                            <Text style={ViewStyles.actionButtonText}>Image</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Status Update Buttons */}
                      <View style={ViewStyles.statusUpdateContainer}>
                        <Text style={[ViewStyles.statusUpdateLabel, isDarkTheme ? ViewStyles.textDark : ViewStyles.textLight]}>
                          Update Status
                        </Text>

                        <View style={ViewStyles.statusButtonsRow}>
                          <TouchableOpacity
                            style={[
                              ViewStyles.statusButton,
                              ViewStyles.inProgressButton,
                              inProgressDisabled && ViewStyles.statusButtonDisabled,
                            ]}
                            onPress={() => confirmAndUpdate(i.id, "in_progress")}
                            disabled={inProgressDisabled}
                          >
                            {updatingId === i.id ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <>
                                <Ionicons name="construct-outline" size={16} color="#FFFFFF" />
                                <Text style={ViewStyles.statusButtonText}>
                                  {isInProgress(status) ? "In Progress" : "Mark Progress"}
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              ViewStyles.statusButton,
                              ViewStyles.resolvedButton,
                              resolvedDisabled && ViewStyles.statusButtonDisabled,
                            ]}
                            onPress={() => confirmAndUpdate(i.id, "resolved")}
                            disabled={resolvedDisabled}
                          >
                            {updatingId === i.id ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <>
                                <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                                <Text style={ViewStyles.statusButtonText}>
                                  {isResolved(status) ? "Resolved" : "Mark Resolved"}
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
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
            ViewStyles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={[ViewStyles.footerInfo, isDarkTheme ? ViewStyles.footerInfoDark : ViewStyles.footerInfoLight]}>
            <Ionicons name="information-circle" size={20} color="#FF6B35" style={ViewStyles.infoIcon} />
            <Text style={[ViewStyles.footerText, isDarkTheme ? ViewStyles.footerTextDark : ViewStyles.footerTextLight]}>
              Tap on any incident to view details and update its status.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}