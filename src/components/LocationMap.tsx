"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

// Mumbai coordinates
const MUMBAI_LAT = 19.076;
const MUMBAI_LNG = 72.8777;

export default function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [mapLoaded, setMapLoaded] = useState(false);
  const leafletMap = useRef<unknown>(null);

  useEffect(() => {
    if (!isInView || !mapRef.current || mapLoaded) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [MUMBAI_LAT, MUMBAI_LNG],
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        attributionControl: false,
      });

      // Dark-themed tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom marker
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: 3px solid rgba(255,255,255,0.9);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.2);
          animation: pulse-marker 2s ease-in-out infinite;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([MUMBAI_LAT, MUMBAI_LNG], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div style="text-align:center; font-family: system-ui; padding: 4px;">
            <strong style="font-size: 14px;">Pintu Kumar</strong><br/>
            <span style="color: #666; font-size: 12px;">Mumbai, Maharashtra, India</span>
          </div>`
        );

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Attribution
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>')
        .addTo(map);

      leafletMap.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (leafletMap.current) {
        (leafletMap.current as { remove: () => void }).remove();
        leafletMap.current = null;
        setMapLoaded(false);
      }
    };
  }, [isInView, mapLoaded]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Based in</h3>
      </div>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <style>{`
          .custom-marker { background: none !important; border: none !important; }
          @keyframes pulse-marker {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(99,102,241,0.5); }
            50% { transform: scale(1.15); box-shadow: 0 0 30px rgba(99,102,241,0.7); }
          }
          .leaflet-popup-content-wrapper {
            background: #1e1b4b !important;
            color: #fff !important;
            border-radius: 12px !important;
            border: 1px solid rgba(99,102,241,0.3) !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4) !important;
          }
          .leaflet-popup-tip { background: #1e1b4b !important; }
          .leaflet-popup-content { margin: 8px 12px !important; }
          .leaflet-popup-close-button { color: #a5b4fc !important; }
          .leaflet-control-zoom a {
            background: #1e1b4b !important;
            color: #a5b4fc !important;
            border-color: rgba(99,102,241,0.3) !important;
          }
          .leaflet-control-zoom a:hover { background: #312e81 !important; }
          .leaflet-control-attribution { font-size: 10px !important; opacity: 0.5; }
          .leaflet-control-attribution a { color: #a5b4fc !important; }
        `}</style>

        <div
          ref={mapRef}
          className="h-[250px] sm:h-[300px] w-full"
          style={{ background: "#0f0d2e" }}
        />

        {/* Location badge overlay */}
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-full bg-gray-950/80 backdrop-blur-sm border border-white/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-medium text-gray-300">
            Mumbai, Maharashtra, India
          </span>
        </div>
      </div>
    </motion.div>
  );
}
