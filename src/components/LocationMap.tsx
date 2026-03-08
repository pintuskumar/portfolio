"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

const MUMBAI_LAT = 19.076;
const MUMBAI_LNG = 72.8777;

function loadLeafletCSS() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

function injectMapStyles() {
  if (document.querySelector("#leaflet-custom-styles")) return;
  const isLight = document.documentElement.classList.contains("light");
  const style = document.createElement("style");
  style.id = "leaflet-custom-styles";
  style.textContent = `
    .custom-marker { background: none !important; border: none !important; }
    @keyframes pulse-marker {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    .leaflet-tile-pane { opacity: 1 !important; }
    .leaflet-container { background: ${isLight ? "#f1f5f9" : "#0f0d2e"} !important; }
    .leaflet-popup-content-wrapper {
      background: ${isLight ? "#ffffff" : "#1e1b4b"} !important;
      color: ${isLight ? "#0f172a" : "#fff"} !important;
      border-radius: 12px !important;
      border: 1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(99,102,241,0.3)"} !important;
      box-shadow: 0 10px 30px ${isLight ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.4)"} !important;
    }
    .leaflet-popup-tip { background: ${isLight ? "#ffffff" : "#1e1b4b"} !important; }
    .leaflet-popup-content { margin: 8px 12px !important; }
    .leaflet-popup-close-button { color: ${isLight ? "#6366f1" : "#a5b4fc"} !important; }
    .leaflet-control-zoom a {
      background: ${isLight ? "#ffffff" : "#1e1b4b"} !important;
      color: ${isLight ? "#6366f1" : "#a5b4fc"} !important;
      border-color: ${isLight ? "rgba(0,0,0,0.1)" : "rgba(99,102,241,0.3)"} !important;
    }
    .leaflet-control-zoom a:hover { background: ${isLight ? "#f1f5f9" : "#312e81"} !important; }
    .leaflet-control-attribution { font-size: 10px !important; opacity: 0.5; }
    .leaflet-control-attribution a { color: ${isLight ? "#6366f1" : "#a5b4fc"} !important; }
  `;
  document.head.appendChild(style);
}

export default function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [mapReady, setMapReady] = useState(false);
  const mapInstance = useRef<unknown>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isInView || !mapContainerRef.current || initialized.current) return;
    initialized.current = true;

    // Load CSS first, then initialize map after CSS is ready
    loadLeafletCSS();
    injectMapStyles();

    // Small delay to ensure CSS is parsed
    const timer = setTimeout(() => {
      import("leaflet").then((L) => {
        if (!mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
          center: [MUMBAI_LAT, MUMBAI_LNG],
          zoom: 11,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: true,
          attributionControl: false,
        });

        // Choose tile layer based on theme
        const isLight = document.documentElement.classList.contains("light");
        const tileUrl = isLight
          ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

        L.tileLayer(tileUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          }
        ).addTo(map);

        // Custom pulsing marker
        const markerIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position:relative; width:30px; height:30px;">
              <div style="
                position:absolute; inset:0;
                border-radius:50%;
                background: rgba(99,102,241,0.3);
                animation: pulse-marker 2s ease-in-out infinite;
              "></div>
              <div style="
                position:absolute; top:5px; left:5px;
                width:20px; height:20px;
                border-radius:50%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: 3px solid rgba(255,255,255,0.9);
                box-shadow: 0 0 15px rgba(99,102,241,0.6);
              "></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([MUMBAI_LAT, MUMBAI_LNG], { icon: markerIcon })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center; font-family:system-ui; padding:4px;">
              <strong style="font-size:14px;">Pintu Kumar</strong><br/>
              <span style="color:#a5b4fc; font-size:12px;">Mumbai, Maharashtra, India</span>
            </div>`
          );

        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Force tiles to load
        setTimeout(() => map.invalidateSize(), 200);

        mapInstance.current = map;
        setMapReady(true);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Based in</h3>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div
          ref={mapContainerRef}
          className="h-[250px] sm:h-[300px] w-full"
          style={{ zIndex: 0 }}
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

        {/* Loading state */}
        {!mapReady && isInView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-500">Loading map...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
