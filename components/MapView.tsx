import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface POIData {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  confidence: number;
  verified: boolean;
  attributes?: {
    hours?: string;
    rating?: number;
    tags?: string[];
  };
}

interface MapViewProps {
  center: [number, number];
  zoom: number;
  pois: POIData[];
}

// Component to handle map updates
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [center, zoom, map]);
  
  return null;
}

export default function MapView({ center, zoom, pois }: MapViewProps) {
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);

  // Separate AI suggestions from verified POIs
  const aiSuggestions = pois.filter(p => !p.verified);
  const verifiedPOIs = pois.filter(p => p.verified);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      {/* Free dark map tiles - CartoDB Dark Matter (no auth required) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      <MapController center={center} zoom={zoom} />

      {/* AI Suggestions - Orange/Amber markers */}
      {aiSuggestions.map((poi) => (
        <CircleMarker
          key={poi.id}
          center={[poi.lat, poi.lng]}
          radius={12}
          pathOptions={{
            fillColor: '#f59e0b',
            fillOpacity: 0.9,
            color: '#fbbf24',
            weight: 3,
            opacity: 1,
          }}
          eventHandlers={{
            click: () => setSelectedPOI(poi.id),
          }}
        >
          <Popup>
            <div className="poi-popup">
              <div className="poi-popup-header">
                <span className="poi-popup-badge ai">AI Suggestion</span>
              </div>
              <div className="poi-popup-content">
                <div className="poi-popup-title">{poi.name}</div>
                <div className="poi-popup-meta">
                  {poi.attributes?.tags && (
                    <span>{poi.attributes.tags.join(' • ')}</span>
                  )}
                  {poi.attributes?.hours && (
                    <span>🕐 {poi.attributes.hours}</span>
                  )}
                </div>
                <div className="poi-popup-confidence">
                  <span className="poi-popup-confidence-label">Confidence</span>
                  <span className="poi-popup-confidence-value">
                    {Math.round(poi.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Verified POIs - Green markers */}
      {verifiedPOIs.map((poi) => (
        <CircleMarker
          key={poi.id}
          center={[poi.lat, poi.lng]}
          radius={12}
          pathOptions={{
            fillColor: '#22c55e',
            fillOpacity: 0.9,
            color: '#4ade80',
            weight: 3,
            opacity: 1,
          }}
          eventHandlers={{
            click: () => setSelectedPOI(poi.id),
          }}
        >
          <Popup>
            <div className="poi-popup">
              <div className="poi-popup-header">
                <span className="poi-popup-badge verified">✓ Verified</span>
              </div>
              <div className="poi-popup-content">
                <div className="poi-popup-title">{poi.name}</div>
                <div className="poi-popup-meta">
                  {poi.attributes?.tags && (
                    <span>{poi.attributes.tags.join(' • ')}</span>
                  )}
                  {poi.attributes?.rating && (
                    <span>⭐ {poi.attributes.rating.toFixed(1)}</span>
                  )}
                  {poi.attributes?.hours && (
                    <span>🕐 {poi.attributes.hours}</span>
                  )}
                </div>
                <div className="poi-popup-confidence">
                  <span className="poi-popup-confidence-label">Confidence</span>
                  <span className="poi-popup-confidence-value">
                    {Math.round(poi.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
