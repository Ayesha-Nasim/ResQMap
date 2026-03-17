import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapStyles } from '../styles/MapStyles';

const { width } = Dimensions.get('window');

type Boundary = {
  id: string;
  name: string;
  type: 'city' | 'district' | 'emergency' | 'risk' | 'administrative';
  color: string;
  description: string;
  population?: number;
  emergencyContacts?: string[];
  facilities?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
};

type Props = {
  boundary: Boundary | null;
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
};

const getRiskLevelColor = (riskLevel?: string) => {
  switch(riskLevel) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

const getRiskLevelText = (riskLevel?: string) => {
  switch(riskLevel) {
    case 'high': return 'High Risk';
    case 'medium': return 'Medium Risk';
    case 'low': return 'Low Risk';
    default: return 'Unknown Risk';
  }
};

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'city': return '🏙️ City Zone';
    case 'district': return '🏘️ District';
    case 'emergency': return '🚨 Emergency Zone';
    case 'risk': return '⚠️ Risk Zone';
    case 'administrative': return '🏛️ Administrative';
    default: return '📍 Zone';
  }
};

export default function BoundaryInfoPanel({ boundary, visible, onClose, isDarkMode }: Props) {
  if (!visible || !boundary) return null;

  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  const textColor = isDarkMode ? '#f3f4f6' : '#111827';
  const secondaryTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBackground = isDarkMode ? '#374151' : '#f9fafb';

  return (
    <View style={[MapStyles.boundaryPanel, { backgroundColor }]}>
      {/* Header with gradient */}
      <LinearGradient
        colors={[boundary.color, `${boundary.color}dd`]}
        style={MapStyles.boundaryPanelHeader}
      >
        <View style={MapStyles.boundaryPanelHeaderContent}>
          <View>
            <Text style={MapStyles.boundaryPanelTitle}>{boundary.name}</Text>
            <Text style={MapStyles.boundaryPanelSubtitle}>
              {getTypeIcon(boundary.type)}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={MapStyles.boundaryPanelClose}>
            <Text style={MapStyles.boundaryPanelCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={MapStyles.boundaryPanelContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={[MapStyles.boundaryPanelCard, { backgroundColor: cardBackground }]}>
          <Text style={[MapStyles.boundaryPanelCardTitle, { color: textColor }]}>
            📝 Description
          </Text>
          <Text style={[MapStyles.boundaryPanelCardText, { color: textColor }]}>
            {boundary.description}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={MapStyles.boundaryPanelGrid}>
          <View style={[MapStyles.boundaryPanelStatCard, { backgroundColor: cardBackground }]}>
            <Text style={[MapStyles.boundaryPanelStatValue, { color: textColor }]}>
              {boundary.population?.toLocaleString() || 'N/A'}
            </Text>
            <Text style={[MapStyles.boundaryPanelStatLabel, { color: secondaryTextColor }]}>
              👥 Population
            </Text>
          </View>

          <View style={[MapStyles.boundaryPanelStatCard, { backgroundColor: cardBackground }]}>
            <View style={[
              MapStyles.boundaryPanelRiskBadge,
              { backgroundColor: getRiskLevelColor(boundary.riskLevel) }
            ]}>
              <Text style={MapStyles.boundaryPanelRiskText}>
                {getRiskLevelText(boundary.riskLevel)}
              </Text>
            </View>
            <Text style={[MapStyles.boundaryPanelStatLabel, { color: secondaryTextColor }]}>
              🎯 Risk Level
            </Text>
          </View>
        </View>

        {/* Emergency Contacts */}
        {boundary.emergencyContacts && boundary.emergencyContacts.length > 0 && (
          <View style={[MapStyles.boundaryPanelCard, { backgroundColor: cardBackground, marginTop: 12 }]}>
            <Text style={[MapStyles.boundaryPanelCardTitle, { color: textColor }]}>
              🚨 Emergency Contacts
            </Text>
            {boundary.emergencyContacts.map((contact, index) => (
              <View key={index} style={MapStyles.boundaryPanelContactItem}>
                <Text style={[MapStyles.boundaryPanelContactText, { color: textColor }]}>
                  {contact}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Facilities */}
        {boundary.facilities && boundary.facilities.length > 0 && (
          <View style={[MapStyles.boundaryPanelCard, { backgroundColor: cardBackground, marginTop: 12 }]}>
            <Text style={[MapStyles.boundaryPanelCardTitle, { color: textColor }]}>
              🏢 Key Facilities
            </Text>
            <View style={MapStyles.boundaryPanelFacilities}>
              {boundary.facilities.map((facility, index) => (
                <View key={index} style={MapStyles.boundaryPanelFacilityTag}>
                  <Text style={MapStyles.boundaryPanelFacilityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Zone Legend */}
        <View style={[MapStyles.boundaryPanelCard, { backgroundColor: cardBackground, marginTop: 12, marginBottom: 20 }]}>
          <Text style={[MapStyles.boundaryPanelCardTitle, { color: textColor }]}>
            🎨 Zone Color Legend
          </Text>
          <View style={MapStyles.boundaryPanelLegend}>
            <View style={MapStyles.boundaryPanelLegendItem}>
              <View style={[MapStyles.boundaryPanelLegendColor, { backgroundColor: '#3b82f6' }]} />
              <Text style={[MapStyles.boundaryPanelLegendText, { color: secondaryTextColor }]}>
                City/Administrative
              </Text>
            </View>
            <View style={MapStyles.boundaryPanelLegendItem}>
              <View style={[MapStyles.boundaryPanelLegendColor, { backgroundColor: '#10b981' }]} />
              <Text style={[MapStyles.boundaryPanelLegendText, { color: secondaryTextColor }]}>
                Residential/District
              </Text>
            </View>
            <View style={MapStyles.boundaryPanelLegendItem}>
              <View style={[MapStyles.boundaryPanelLegendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={[MapStyles.boundaryPanelLegendText, { color: secondaryTextColor }]}>
                High Risk Zones
              </Text>
            </View>
            <View style={MapStyles.boundaryPanelLegendItem}>
              <View style={[MapStyles.boundaryPanelLegendColor, { backgroundColor: '#f59e0b' }]} />
              <Text style={[MapStyles.boundaryPanelLegendText, { color: secondaryTextColor }]}>
                Emergency Zones
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}