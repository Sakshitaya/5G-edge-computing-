// San Francisco road network data for simulation
// Using real SF coordinates for authenticity

// Edge server locations (5G tower positions across SF)
export const EDGE_SERVERS = [
  { id: 'edge-1', name: 'Edge Node — Market & 4th', lat: 37.7849, lng: -122.4094, range: 0.008 },
  { id: 'edge-2', name: 'Edge Node — Mission & 6th', lat: 37.7780, lng: -122.4177, range: 0.008 },
  { id: 'edge-3', name: 'Edge Node — Howard & 3rd', lat: 37.7820, lng: -122.4020, range: 0.008 },
  { id: 'edge-4', name: 'Edge Node — Folsom & 2nd', lat: 37.7750, lng: -122.4050, range: 0.008 },
  { id: 'edge-5', name: 'Edge Node — Bryant & 5th', lat: 37.7795, lng: -122.4150, range: 0.008 },
  { id: 'edge-6', name: 'Edge Node — Harrison & 1st', lat: 37.7865, lng: -122.3980, range: 0.008 },
];

// Cloud server location (distant data center — Oregon region)
export const CLOUD_SERVER = {
  id: 'cloud-1',
  name: 'AWS us-west-2 (Oregon)',
  lat: 37.82,
  lng: -122.36,
};

// Road path definitions — arrays of [lat, lng] waypoints
export const ROAD_PATHS = [
  // Market Street (main diagonal)
  {
    id: 'path-1',
    name: 'Market St',
    waypoints: [
      [37.7750, -122.4180],
      [37.7770, -122.4150],
      [37.7790, -122.4120],
      [37.7810, -122.4090],
      [37.7830, -122.4060],
      [37.7850, -122.4030],
      [37.7870, -122.4000],
    ],
  },
  // Mission Street (parallel to Market)
  {
    id: 'path-2',
    name: 'Mission St',
    waypoints: [
      [37.7740, -122.4190],
      [37.7755, -122.4160],
      [37.7770, -122.4130],
      [37.7785, -122.4100],
      [37.7800, -122.4070],
      [37.7815, -122.4040],
      [37.7830, -122.4010],
    ],
  },
  // 3rd Street (north-south)
  {
    id: 'path-3',
    name: '3rd St',
    waypoints: [
      [37.7860, -122.4100],
      [37.7845, -122.4095],
      [37.7830, -122.4090],
      [37.7815, -122.4085],
      [37.7800, -122.4080],
      [37.7785, -122.4075],
      [37.7770, -122.4070],
    ],
  },
  // Van Ness Avenue
  {
    id: 'path-4',
    name: 'Van Ness Ave',
    waypoints: [
      [37.7860, -122.4200],
      [37.7845, -122.4190],
      [37.7830, -122.4180],
      [37.7815, -122.4170],
      [37.7800, -122.4160],
      [37.7785, -122.4150],
      [37.7770, -122.4140],
    ],
  },
  // Howard Street
  {
    id: 'path-5',
    name: 'Howard St',
    waypoints: [
      [37.7730, -122.4170],
      [37.7745, -122.4140],
      [37.7760, -122.4110],
      [37.7775, -122.4080],
      [37.7790, -122.4050],
      [37.7805, -122.4020],
    ],
  },
  // Folsom Street
  {
    id: 'path-6',
    name: 'Folsom St',
    waypoints: [
      [37.7720, -122.4160],
      [37.7735, -122.4130],
      [37.7750, -122.4100],
      [37.7765, -122.4070],
      [37.7780, -122.4040],
      [37.7795, -122.4010],
    ],
  },
  // Harrison Street
  {
    id: 'path-7',
    name: 'Harrison St',
    waypoints: [
      [37.7710, -122.4150],
      [37.7725, -122.4120],
      [37.7740, -122.4090],
      [37.7755, -122.4060],
      [37.7770, -122.4030],
      [37.7785, -122.4000],
    ],
  },
  // Bryant Street
  {
    id: 'path-8',
    name: 'Bryant St',
    waypoints: [
      [37.7700, -122.4140],
      [37.7718, -122.4115],
      [37.7735, -122.4085],
      [37.7752, -122.4055],
      [37.7770, -122.4025],
    ],
  },
  // 2nd Street (north-south)
  {
    id: 'path-9',
    name: '2nd St',
    waypoints: [
      [37.7870, -122.4010],
      [37.7855, -122.4015],
      [37.7840, -122.4020],
      [37.7825, -122.4025],
      [37.7810, -122.4030],
      [37.7795, -122.4035],
      [37.7780, -122.4040],
    ],
  },
  // 5th Street (north-south)
  {
    id: 'path-10',
    name: '5th St',
    waypoints: [
      [37.7860, -122.4160],
      [37.7845, -122.4155],
      [37.7830, -122.4150],
      [37.7815, -122.4145],
      [37.7800, -122.4140],
      [37.7785, -122.4135],
    ],
  },
];

// Initial vehicle definitions — spread across paths with varied speeds
export const INITIAL_VEHICLES = [
  { id: 'car-1',  name: 'AV-01',  pathIdx: 0, emoji: '🚗', speed: 1.0,  direction: 1 },
  { id: 'car-2',  name: 'AV-02',  pathIdx: 1, emoji: '🚙', speed: 0.85, direction: 1 },
  { id: 'car-3',  name: 'AV-03',  pathIdx: 2, emoji: '🚕', speed: 1.15, direction: -1 },
  { id: 'car-4',  name: 'AV-04',  pathIdx: 3, emoji: '🚘', speed: 0.92, direction: 1 },
  { id: 'car-5',  name: 'AV-05',  pathIdx: 4, emoji: '🏎️', speed: 1.25, direction: -1 },
  { id: 'car-6',  name: 'AV-06',  pathIdx: 5, emoji: '🚐', speed: 0.70, direction: 1 },
  { id: 'car-7',  name: 'AV-07',  pathIdx: 0, emoji: '🚎', speed: 0.60, direction: -1 },
  { id: 'car-8',  name: 'AV-08',  pathIdx: 1, emoji: '🚑', speed: 1.30, direction: -1 },
  { id: 'car-9',  name: 'AV-09',  pathIdx: 6, emoji: '🚗', speed: 0.95, direction: 1 },
  { id: 'car-10', name: 'AV-10',  pathIdx: 7, emoji: '🚙', speed: 1.10, direction: -1 },
  { id: 'car-11', name: 'AV-11',  pathIdx: 8, emoji: '🚕', speed: 0.80, direction: 1 },
  { id: 'car-12', name: 'AV-12',  pathIdx: 9, emoji: '🚘', speed: 1.05, direction: -1 },
  { id: 'car-13', name: 'AV-13',  pathIdx: 2, emoji: '🏎️', speed: 1.18, direction: 1 },
  { id: 'car-14', name: 'AV-14',  pathIdx: 4, emoji: '🚐', speed: 0.75, direction: 1 },
  { id: 'car-15', name: 'AV-15',  pathIdx: 6, emoji: '🚎', speed: 0.65, direction: -1 },
  { id: 'car-16', name: 'AV-16',  pathIdx: 3, emoji: '🚗', speed: 1.0,  direction: -1 },
  { id: 'car-17', name: 'AV-17',  pathIdx: 8, emoji: '🚙', speed: 0.90, direction: -1 },
  { id: 'car-18', name: 'AV-18',  pathIdx: 5, emoji: '🚑', speed: 1.20, direction: 1 },
];

// Map center (SF SoMa / Financial District)
export const MAP_CENTER = [37.7800, -122.4120];
export const MAP_ZOOM = 15;
