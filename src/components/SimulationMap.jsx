import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MAP_CENTER, MAP_ZOOM, EDGE_SERVERS, CLOUD_SERVER, ROAD_PATHS } from '../data/simulationData';

// ─── Custom Icon Factories ───
function createCarIcon(emoji, status) {
  const borderColor =
    status === 'danger'
      ? '#ef4444'
      : status === 'processing'
      ? '#facc15'
      : '#4ade80';

  return L.divIcon({
    html: `<div style="font-size:24px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));transition:filter 0.3s;">${emoji}</div>`,
    className: 'car-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function createEdgeIcon() {
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;position:relative;">
        <div style="
          width:10px;height:10px;border-radius:50%;
          background:#4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.5);
        "></div>
        <div style="
          position:absolute;top:-3px;left:-3px;right:-3px;bottom:-3px;
          border:1px solid rgba(74,222,128,0.25);border-radius:50%;
          animation: pulse-ring 3s ease-out infinite;
        "></div>
        <span style="
          font-size:7px;color:#94a3b8;
          margin-top:3px;white-space:nowrap;letter-spacing:0.5px;
          font-weight:500;
        ">Edge Node</span>
      </div>
    `,
    className: 'edge-server-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function createCloudIcon() {
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="font-size:20px;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3));">🌐</div>
        <span style="
          font-size:7px;color:#94a3b8;
          margin-top:2px;white-space:nowrap;letter-spacing:0.5px;
          font-weight:500;
        ">Cloud DC</span>
      </div>
    `,
    className: 'cloud-server-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// ─── Data Packet Lines Component ───
function DataPacketLines({ vehicles, mode }) {
  const lines = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];

    return vehicles
      .filter((v) => v.position)
      .map((v) => {
        if (mode === 'edge') {
          let nearestEdge = EDGE_SERVERS[0];
          let minDist = Infinity;
          EDGE_SERVERS.forEach((e) => {
            const d = Math.hypot(v.position[0] - e.lat, v.position[1] - e.lng);
            if (d < minDist) {
              minDist = d;
              nearestEdge = e;
            }
          });
          return {
            id: v.id,
            from: v.position,
            to: [nearestEdge.lat, nearestEdge.lng],
            color: v.status === 'danger' ? '#f87171' : '#4ade80',
            dashArray: '4 8',
            weight: 1.5,
            opacity: 0.7,
          };
        } else {
          return {
            id: v.id,
            from: v.position,
            to: [CLOUD_SERVER.lat, CLOUD_SERVER.lng],
            color: v.status === 'danger' ? '#f87171' : '#fb923c',
            dashArray: '6 12',
            weight: 1.5,
            opacity: 0.55,
          };
        }
      });
  }, [vehicles, mode]);

  return (
    <>
      {lines.map((line) => (
        <Polyline
          key={line.id}
          positions={[line.from, line.to]}
          pathOptions={{
            color: line.color,
            weight: line.weight,
            opacity: line.opacity,
            dashArray: line.dashArray,
          }}
        />
      ))}
    </>
  );
}

// ─── Road Path Lines ───
function RoadPaths() {
  return (
    <>
      {ROAD_PATHS.map((path) => (
        <Polyline
          key={path.id}
          positions={path.waypoints}
          pathOptions={{
            color: 'rgba(148,163,184,0.08)',
            weight: 2,
            dashArray: '2 6',
          }}
        />
      ))}
    </>
  );
}

// ─── Main SimulationMap ───
export default function SimulationMap({ vehicles, mode }) {
  const edgeIcon = useMemo(() => createEdgeIcon(), []);
  const cloudIcon = useMemo(() => createCloudIcon(), []);

  return (
    <div className={`relative w-full h-full ${mode === 'cloud' ? 'map-cloud-mode' : 'map-edge-mode'}`}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={true}
        attributionControl={false}
        className="w-full h-full"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Road paths */}
        <RoadPaths />

        {/* Edge servers */}
        {EDGE_SERVERS.map((server) => (
          <Marker
            key={server.id}
            position={[server.lat, server.lng]}
            icon={edgeIcon}
          >
            <Popup>
              <div style={{ fontSize: '11px', color: '#334155' }}>
                <strong>{server.name}</strong><br />
                <span style={{ fontSize: '10px', color: '#64748b' }}>Latency: 1-5ms</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Cloud server */}
        <Marker
          position={[CLOUD_SERVER.lat, CLOUD_SERVER.lng]}
          icon={cloudIcon}
        >
          <Popup>
            <div style={{ fontSize: '11px', color: '#334155' }}>
              <strong>{CLOUD_SERVER.name}</strong><br />
              <span style={{ fontSize: '10px', color: '#64748b' }}>Latency: 80-200ms</span>
            </div>
          </Popup>
        </Marker>

        {/* Vehicle markers */}
        {vehicles
          .filter((v) => v.position)
          .map((v) => (
            <Marker
              key={v.id}
              position={v.position}
              icon={createCarIcon(v.emoji, v.status)}
            >
              <Popup>
                <div style={{ fontSize: '11px', color: '#334155' }}>
                  <strong>{v.name}</strong><br />
                  Status: {v.status}<br />
                  Latency: {Math.round(v.latency)}ms
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Data packet lines */}
        <DataPacketLines vehicles={vehicles} mode={mode} />
      </MapContainer>

      {/* Mode badge on map */}
      <div
        className="absolute top-3 left-3 z-[1001] px-2.5 py-1 rounded-md"
        style={{
          background: mode === 'edge'
            ? 'rgba(34,197,94,0.1)'
            : 'rgba(249,115,22,0.1)',
          border: `1px solid ${mode === 'edge' ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)'}`,
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          color: mode === 'edge' ? '#4ade80' : '#fb923c',
        }}
      >
        {mode === 'edge' ? '⚡ Edge Computing' : '☁️ Cloud Computing'}
      </div>
    </div>
  );
}
