import { useReducer, useRef, useCallback, useEffect, useState } from 'react';
import {
  ROAD_PATHS,
  INITIAL_VEHICLES,
  EDGE_SERVERS,
} from '../data/simulationData';

// ─── Helpers ───
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolatePosition(waypoints, progress) {
  const totalSegments = waypoints.length - 1;
  const segFloat = progress * totalSegments;
  const segIdx = Math.min(Math.floor(segFloat), totalSegments - 1);
  const t = segFloat - segIdx;
  return [
    lerp(waypoints[segIdx][0], waypoints[segIdx + 1][0], t),
    lerp(waypoints[segIdx][1], waypoints[segIdx + 1][1], t),
  ];
}

// Realistic latency with base + jitter + occasional spikes
function randomLatency(mode, prevValue = null) {
  if (mode === 'edge') {
    // 5G Edge: typically 1-5ms, occasional spike to 8-12ms
    const base = 2 + Math.random() * 3;
    const jitter = (Math.random() - 0.5) * 2;
    const spike = Math.random() < 0.05 ? Math.random() * 8 : 0;
    const raw = base + jitter + spike;
    // Smooth with previous value if available
    if (prevValue !== null) {
      return prevValue * 0.3 + raw * 0.7;
    }
    return Math.max(1, raw);
  }
  // Cloud: typically 80-140ms, occasional spike to 180-250ms
  const base = 90 + Math.random() * 40;
  const jitter = (Math.random() - 0.5) * 20;
  const spike = Math.random() < 0.08 ? Math.random() * 100 : 0;
  const raw = base + jitter + spike;
  if (prevValue !== null) {
    return prevValue * 0.3 + raw * 0.7;
  }
  return Math.max(60, raw);
}

function randomThroughput(mode) {
  if (mode === 'edge') {
    return 0.9 + Math.random() * 0.5; // 0.9–1.4 Gbps
  }
  return 0.2 + Math.random() * 0.18; // 0.20–0.38 Gbps
}

// ─── Reducer ───
const initialState = {
  mode: 'edge', // 'edge' | 'cloud'
  speed: 1.0,
  running: true,
  vehicles: INITIAL_VEHICLES.map((v) => ({
    ...v,
    progress: Math.random() * 0.8 + 0.1,
    status: 'safe', // 'safe' | 'processing' | 'danger'
    latency: 0,
    braking: false,
    incident: false,
  })),
  latencyHistory: [],
  events: [],
  stats: {
    edgeThroughput: 1.2,
    cloudThroughput: 0.34,
    packetsProcessed: { edge: 0, cloud: 0 },
    accidentsPrevented: 0,
    incidentsDueToDelay: 0,
  },
  currentEdgeLatency: 3,
  currentCloudLatency: 100,
  // Running averages for comparison card
  comparison: {
    avgEdgeLatency: 3.5,
    avgCloudLatency: 110,
    edgeUptime: 99.97,
    cloudUptime: 99.5,
    edgePacketLoss: 0.01,
    cloudPacketLoss: 0.8,
    edgeJitter: 0.5,
    cloudJitter: 12,
  },
};

function simulationReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'TOGGLE_RUNNING':
      return { ...state, running: !state.running };
    case 'UPDATE_VEHICLES':
      return { ...state, vehicles: action.payload };
    case 'ADD_LATENCY_POINT':
      return {
        ...state,
        latencyHistory: [
          ...state.latencyHistory.slice(-59),
          action.payload,
        ],
        currentEdgeLatency: action.payload.edge,
        currentCloudLatency: action.payload.cloud,
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events.slice(-14), action.payload],
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      };
    case 'UPDATE_COMPARISON':
      return {
        ...state,
        comparison: { ...state.comparison, ...action.payload },
      };
    default:
      return state;
  }
}

// ─── Hook ───
export function useSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const latencyIntervalRef = useRef(null);
  const eventCounterRef = useRef(0);
  const packetCounterRef = useRef({ edge: 0, cloud: 0 });
  const accidentPreventedRef = useRef(0);
  const incidentsRef = useRef(0);
  const prevEdgeLatRef = useRef(3);
  const prevCloudLatRef = useRef(100);
  const latencySamplesRef = useRef({ edge: [], cloud: [] });
  const [tick, setTick] = useState(0);

  // Vehicle movement loop
  const updateVehicles = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    const baseSpeed = 0.04 * delta * state.speed;

    const newVehicles = state.vehicles.map((v) => {
      const path = ROAD_PATHS[v.pathIdx];
      if (!path) return v;

      let newProgress = v.progress + baseSpeed * v.speed * v.direction;

      // Bounce at ends
      let newDirection = v.direction;
      if (newProgress >= 1) {
        newProgress = 1 - (newProgress - 1);
        newDirection = -1;
      } else if (newProgress <= 0) {
        newProgress = Math.abs(newProgress);
        newDirection = 1;
      }

      const pos = interpolatePosition(path.waypoints, Math.max(0, Math.min(1, newProgress)));

      // Determine if this vehicle should have an incident
      const incidentChance = 0.015 * delta;
      const hasIncident = Math.random() < incidentChance;

      let status = 'safe';
      let latency = v.latency;
      let braking = false;
      let incident = false;

      if (hasIncident) {
        latency = randomLatency(state.mode);

        if (state.mode === 'edge') {
          status = 'processing';
          braking = true;
          incident = false;
          accidentPreventedRef.current += 1;

          const evtId = ++eventCounterRef.current;
          setTimeout(() => {
            dispatch({
              type: 'ADD_EVENT',
              payload: {
                id: evtId,
                type: 'edge',
                car: v.name,
                message: `obstacle detected → braked in ${Math.round(latency)}ms ✅`,
                timestamp: Date.now(),
              },
            });
          }, 0);
        } else {
          status = 'danger';
          braking = false;
          incident = true;
          incidentsRef.current += 1;

          const evtId = ++eventCounterRef.current;
          setTimeout(() => {
            dispatch({
              type: 'ADD_EVENT',
              payload: {
                id: evtId,
                type: 'cloud',
                car: v.name,
                message: `response delayed ${Math.round(latency)}ms → near miss`,
                timestamp: Date.now(),
              },
            });
          }, 0);
        }
      } else {
        latency = randomLatency(state.mode);
        if (Math.random() < 0.03) {
          status = 'processing';
        }
      }

      return {
        ...v,
        progress: Math.max(0, Math.min(1, newProgress)),
        direction: newDirection,
        position: pos,
        status,
        latency,
        braking,
        incident,
      };
    });

    dispatch({ type: 'UPDATE_VEHICLES', payload: newVehicles });
  }, [state.vehicles, state.mode, state.speed]);

  // Animation loop
  useEffect(() => {
    if (!state.running) return;

    const loop = () => {
      updateVehicles();
      setTick((t) => t + 1);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state.running, updateVehicles]);

  // Latency data streaming — every 500ms
  useEffect(() => {
    latencyIntervalRef.current = setInterval(() => {
      const edgeLat = randomLatency('edge', prevEdgeLatRef.current);
      const cloudLat = randomLatency('cloud', prevCloudLatRef.current);
      prevEdgeLatRef.current = edgeLat;
      prevCloudLatRef.current = cloudLat;

      packetCounterRef.current.edge += Math.floor(Math.random() * 50 + 30);
      packetCounterRef.current.cloud += Math.floor(Math.random() * 20 + 10);

      dispatch({
        type: 'ADD_LATENCY_POINT',
        payload: {
          time: Date.now(),
          edge: Math.round(edgeLat * 10) / 10,
          cloud: Math.round(cloudLat * 10) / 10,
        },
      });

      dispatch({
        type: 'UPDATE_STATS',
        payload: {
          edgeThroughput: Math.round(randomThroughput('edge') * 100) / 100,
          cloudThroughput: Math.round(randomThroughput('cloud') * 100) / 100,
          packetsProcessed: { ...packetCounterRef.current },
          accidentsPrevented: accidentPreventedRef.current,
          incidentsDueToDelay: incidentsRef.current,
        },
      });

      // Update running averages for comparison
      const eSamples = latencySamplesRef.current.edge;
      const cSamples = latencySamplesRef.current.cloud;
      eSamples.push(edgeLat);
      cSamples.push(cloudLat);
      if (eSamples.length > 60) eSamples.shift();
      if (cSamples.length > 60) cSamples.shift();

      const avgEdge = eSamples.reduce((a, b) => a + b, 0) / eSamples.length;
      const avgCloud = cSamples.reduce((a, b) => a + b, 0) / cSamples.length;

      // Jitter = standard deviation of last N samples
      const edgeJitter = Math.sqrt(
        eSamples.reduce((sum, v) => sum + Math.pow(v - avgEdge, 2), 0) / eSamples.length
      );
      const cloudJitter = Math.sqrt(
        cSamples.reduce((sum, v) => sum + Math.pow(v - avgCloud, 2), 0) / cSamples.length
      );

      dispatch({
        type: 'UPDATE_COMPARISON',
        payload: {
          avgEdgeLatency: Math.round(avgEdge * 10) / 10,
          avgCloudLatency: Math.round(avgCloud * 10) / 10,
          edgeUptime: Math.round((99.95 + Math.random() * 0.04) * 100) / 100,
          cloudUptime: Math.round((99.2 + Math.random() * 0.6) * 100) / 100,
          edgePacketLoss: Math.round((0.005 + Math.random() * 0.02) * 1000) / 1000,
          cloudPacketLoss: Math.round((0.5 + Math.random() * 0.8) * 100) / 100,
          edgeJitter: Math.round(edgeJitter * 10) / 10,
          cloudJitter: Math.round(cloudJitter * 10) / 10,
        },
      });
    }, 500);

    return () => clearInterval(latencyIntervalRef.current);
  }, []);

  const setMode = useCallback((mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setSpeed = useCallback((s) => {
    dispatch({ type: 'SET_SPEED', payload: s });
  }, []);

  const toggleRunning = useCallback(() => {
    dispatch({ type: 'TOGGLE_RUNNING' });
  }, []);

  return {
    state,
    setMode,
    setSpeed,
    toggleRunning,
    tick,
  };
}
