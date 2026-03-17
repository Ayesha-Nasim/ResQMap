import React from 'react';
import { View, Text } from 'react-native';
import { MapStyles } from '../styles/MapStyles';

type Props = {
  isDarkMode: boolean;
};

export default function LegendPanel({ isDarkMode }: Props) {
  return (
    <View style={[MapStyles.legend, isDarkMode && MapStyles.legendDark]}>
      <Text style={[MapStyles.legendTitle, isDarkMode && MapStyles.legendTitleDark]}>
        Map Features
      </Text>
      
      <View style={{ marginTop: 12 }}>
        <Text style={[MapStyles.legendSubtitle, { color: isDarkMode ? '#fff' : '#1a202c' }]}>
          Navigation
        </Text>
        <View style={{ marginTop: 8, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#3b82f6', borderRadius: 2 }} />
            <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 12 }}>
              Your Location
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 16 }}>📍</Text>
            <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 12 }}>
              Tap markers for details
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 16 }}>⚙️</Text>
            <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 12 }}>
              Floating menu for views
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ marginTop: 16 }}>
        <Text style={[MapStyles.legendSubtitle, { color: isDarkMode ? '#fff' : '#1a202c' }]}>
          View Modes
        </Text>
        <View style={{ marginTop: 8, gap: 4 }}>
          <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 11 }}>
            • Normal: Incidents + Zones
          </Text>
          <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 11 }}>
            • Weather: Environmental data
          </Text>
          <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 11 }}>
            • Heatmap: Incident density
          </Text>
          <Text style={{ color: isDarkMode ? '#cbd5e0' : '#6b7280', fontSize: 11 }}>
            • Boundaries: Zone maps
          </Text>
        </View>
      </View>
    </View>
  );
}