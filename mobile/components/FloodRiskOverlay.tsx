import React, { useMemo } from "react";
import { Polygon } from "react-native-maps";

type Feature = {
  type: "Feature";
  properties?: {
    risk?: number;
    level?: string;
    incidentCount?: number;
    drivers?: any;
  };
  geometry?: {
    type: "Polygon";
    coordinates: number[][][]; // GeoJSON polygon
  };
};

type FeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
  meta?: any;
};

type Props = {
  geojson: FeatureCollection | null;
  visible: boolean;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function riskToFill(risk: number) {
  const r = clamp01(risk);

  if (r >= 0.75) return "rgba(239,68,68,0.35)";   // red
  if (r >= 0.5) return "rgba(249,115,22,0.30)";   // orange
  if (r >= 0.25) return "rgba(234,179,8,0.25)";   // yellow

  return "rgba(34,197,94,0.18)";                  // green
}

function riskToStroke(risk: number) {
  const r = clamp01(risk);

  if (r >= 0.75) return "rgba(239,68,68,0.70)";
  if (r >= 0.5) return "rgba(249,115,22,0.60)";
  if (r >= 0.25) return "rgba(234,179,8,0.55)";

  return "rgba(34,197,94,0.45)";
}

export default function FloodRiskOverlay({ geojson, visible }: Props) {

  if (!visible || !geojson?.features?.length) return null;

  const polygons = useMemo(() => {

    // 🔒 Safety limit (protects React Native Maps)
    const MAX_POLYGONS = 4000;

    const safeFeatures = geojson.features.slice(0, MAX_POLYGONS);

    return safeFeatures
      .filter((f) =>
        f.geometry?.type === "Polygon" &&
        Array.isArray(f.geometry.coordinates) &&
        f.geometry.coordinates.length > 0 &&
        f.geometry.coordinates[0].length > 2
      )
      .map((f, idx) => {

        const ring = f.geometry!.coordinates[0];

        const coords = ring.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        const risk = Number(f.properties?.risk ?? 0);

        return {
          key: `risk-poly-${idx}`,
          coords,
          risk,
        };
      });

  }, [geojson]);

  return (
    <>
      {polygons.map((p) => (
        <Polygon
          key={p.key}
          coordinates={p.coords}
          fillColor={riskToFill(p.risk)}
          strokeColor={riskToStroke(p.risk)}
          strokeWidth={1}
          zIndex={3}
        />
      ))}
    </>
  );
}