import React, { useState } from 'react';
import { Polygon, Marker } from 'react-native-maps';
import { View, Text, TouchableOpacity } from 'react-native';

type Boundary = {
  id: string;
  name: string;
  type: 'city' | 'district' | 'emergency' | 'risk' | 'administrative';
  coordinates: Array<{latitude: number, longitude: number}>;
  color: string;
  description: string;
  population?: number;
  emergencyContacts?: string[];
  facilities?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
};

type Props = {
  visible: boolean;
  onBoundarySelect: (boundary: Boundary) => void;
  selectedBoundaryId: string | null;
};

const BOUNDARIES: Boundary[] = [
  // ... (your boundaries array remains the same)
];

const getBoundaryStrokeColor = (boundary: Boundary, isSelected: boolean) => {
  if (isSelected) return '#000000'; // Black for selected
  return boundary.color;
};

const getBoundaryFillColor = (boundary: Boundary, isSelected: boolean) => {
  const opacity = isSelected ? 0.4 : 0.2;
  return `${boundary.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

const getBoundaryStrokeWidth = (boundary: Boundary, isSelected: boolean) => {
  return isSelected ? 3 : 2;
};

const getBoundaryTypeIcon = (type: string) => {
  switch(type) {
    case 'city': return '🏙️';
    case 'district': return '🏘️';
    case 'emergency': return '🚨';
    case 'risk': return '⚠️';
    case 'administrative': return '🏛️';
    default: return '📍';
  }
};

export default function EnhancedBoundaries({ visible, onBoundarySelect, selectedBoundaryId }: Props) {
  if (!visible) return null;

  return (
    <>
      {BOUNDARIES.map((boundary) => {
        const isSelected = boundary.id === selectedBoundaryId;
        
        // Calculate center coordinate for the label
        const centerLat = (boundary.coordinates[0].latitude + boundary.coordinates[2].latitude) / 2;
        const centerLng = (boundary.coordinates[0].longitude + boundary.coordinates[2].longitude) / 2;
        
        return (
          <React.Fragment key={boundary.id}>
            <Polygon
              coordinates={boundary.coordinates}
              strokeColor={getBoundaryStrokeColor(boundary, isSelected)}
              fillColor={getBoundaryFillColor(boundary, isSelected)}
              strokeWidth={getBoundaryStrokeWidth(boundary, isSelected)}
              zIndex={isSelected ? 3 : 2}
              tappable={true}
              onPress={() => onBoundarySelect(boundary)}
            />
            
            {/* Boundary Label using Marker with custom view */}
            <Marker
              coordinate={{
                latitude: centerLat,
                longitude: centerLng,
              }}
              centerOffset={{ x: 0, y: 0 }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              zIndex={isSelected ? 4 : 3}
              pointerEvents="none" // Makes the label non-interactive
            >
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}>
                <Text style={{
                  color: '#000',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: isSelected ? 13 : 11,
                }}>
                  {getBoundaryTypeIcon(boundary.type)} {boundary.name}
                </Text>
              </View>
            </Marker>
          </React.Fragment>
        );
      })}
    </>
  );
}