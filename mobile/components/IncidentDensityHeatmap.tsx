import React, { useMemo } from 'react';
import { Circle } from 'react-native-maps';

type Incident = {
  id: string;
  latitude: number;
  longitude: number;
  severity?: string;
};

type Props = {
  incidents: Incident[];
  visible: boolean;
};

// Helper function - moved OUTSIDE the component
const getSeverityValue = (severity?: string): number => {
  const s = (severity || '').toLowerCase();
  if (s === 'high') return 3;
  if (s === 'medium') return 2;
  if (s === 'low') return 1;
  return 0.5; // unknown/default
};

// Helper function - moved OUTSIDE the component
const getClusterColor = (count: number, avgSeverity: number) => {
  const densityScore = Math.min(1, count / 10); // Max 10 incidents per cluster
  const severityScore = avgSeverity / 3; // Normalize to 0-1
  
  const combinedScore = (densityScore * 0.6 + severityScore * 0.4); // Weighted score
  
  if (combinedScore > 0.8) return 'rgba(255, 0, 0, 0.6)';     // Red - High risk
  if (combinedScore > 0.6) return 'rgba(255, 165, 0, 0.5)';  // Orange
  if (combinedScore > 0.4) return 'rgba(255, 255, 0, 0.4)';  // Yellow
  if (combinedScore > 0.2) return 'rgba(144, 238, 144, 0.3)';// Light Green
  return 'rgba(0, 255, 0, 0.2)';                            // Green
};

// Helper function - moved OUTSIDE the component
const getClusterRadius = (count: number) => {
  const baseRadius = 150; // meters
  return baseRadius * Math.min(3, 1 + Math.log(count + 1)); // Logarithmic scaling
};

export default function IncidentDensityHeatmap({ incidents, visible }: Props) {
  // Don't render if not visible or no incidents
  if (!visible || incidents.length === 0) {
    return null;
  }

  // Calculate density clusters
  const densityClusters = useMemo(() => {
    const clusters: Array<{
      id: string;
      latitude: number;
      longitude: number;
      count: number;
      avgSeverity: number;
    }> = [];

    // Simple grid-based clustering
    const gridSize = 0.005; // ~500m grid cells
    
    incidents.forEach(incident => {
      // Calculate grid cell coordinates
      const gridLat = Math.floor(incident.latitude / gridSize) * gridSize + gridSize/2;
      const gridLng = Math.floor(incident.longitude / gridSize) * gridSize + gridSize/2;
      
      // Find existing cluster in this grid cell
      const existingCluster = clusters.find(
        cluster => 
          Math.abs(cluster.latitude - gridLat) < gridSize/2 &&
          Math.abs(cluster.longitude - gridLng) < gridSize/2
      );
      
      if (existingCluster) {
        // Update cluster: average position and count
        existingCluster.latitude = (existingCluster.latitude * existingCluster.count + incident.latitude) / (existingCluster.count + 1);
        existingCluster.longitude = (existingCluster.longitude * existingCluster.count + incident.longitude) / (existingCluster.count + 1);
        existingCluster.count += 1;
        
        // Update average severity
        const severityValue = getSeverityValue(incident.severity);
        existingCluster.avgSeverity = (existingCluster.avgSeverity * (existingCluster.count - 1) + severityValue) / existingCluster.count;
      } else {
        // Create new cluster
        clusters.push({
          id: `cluster-${clusters.length}`,
          latitude: incident.latitude,
          longitude: incident.longitude,
          count: 1,
          avgSeverity: getSeverityValue(incident.severity),
        });
      }
    });

    return clusters;
  }, [incidents]);

  return (
    <>
      {densityClusters.map(cluster => (
        <Circle
          key={cluster.id}
          center={{ latitude: cluster.latitude, longitude: cluster.longitude }}
          radius={getClusterRadius(cluster.count)}
          fillColor={getClusterColor(cluster.count, cluster.avgSeverity)}
          strokeColor="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          zIndex={0} // Behind markers but above map
        />
      ))}
    </>
  );
}