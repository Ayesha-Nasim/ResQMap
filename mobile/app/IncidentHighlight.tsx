import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { MapStyles } from "../styles/MapStyles";

type Incident = {
  id: string;
  type?: string;
  severity?: string;
  latitude: number;
  longitude: number;
};

type Props = {
  incident: Incident;
};

function severityToRadius(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return 1200;
  if (s === "medium") return 700;
  if (s === "low") return 350;
  return 250;
}

function severityToFill(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return "rgba(239,68,68,0.25)";
  if (s === "medium") return "rgba(249,115,22,0.25)";
  if (s === "low") return "rgba(34,197,94,0.25)";
  return "rgba(59,130,246,0.25)";
}

function severityToPinColor(sev?: string) {
  const s = (sev || "").toLowerCase();
  if (s === "high") return "red";
  if (s === "medium") return "orange";
  if (s === "low") return "green";
  return "blue";
}

export default function IncidentHighlight({ incident }: Props) {
  return (
    <>
      <Circle
        center={{ latitude: incident.latitude, longitude: incident.longitude }}
        radius={severityToRadius(incident.severity)}
        strokeColor={severityToPinColor(incident.severity)}
        fillColor={severityToFill(incident.severity)}
        zIndex={2}
      />
      <View style={MapStyles.selectedInfoBar}>
        <Text style={MapStyles.selectedTitle}>{incident.type}</Text>
        <Text style={MapStyles.selectedText}>Severity: {incident.severity}</Text>
        {/* Clear button can be added in parent */}
      </View>
    </>
  );
}
