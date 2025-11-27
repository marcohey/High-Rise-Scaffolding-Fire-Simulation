

export enum MaterialType {
  METAL = 'METAL',
  BAMBOO = 'BAMBOO',
}

export enum NettingType {
  NONE = 'NONE',
  NON_FIRE_RESISTANT = 'NON_FIRE_RESISTANT',
  FIRE_RESISTANT = 'FIRE_RESISTANT',
}

export enum WeatherType {
  DRY = 'DRY',
  WET = 'WET',
}

export enum CellState {
  NORMAL = 'NORMAL',
  HEATING = 'HEATING',
  BURNING = 'BURNING',     // Structure (Bamboo) is burning
  BURNT = 'BURNT',         // Structure is ash
  COLLAPSED = 'COLLAPSED', // Metal failed structurally
}

export enum NettingState {
  NONE = 'NONE',
  INTACT = 'INTACT',
  BURNING = 'BURNING',
  BURNT = 'BURNT',
}

export enum DebrisState {
  NONE = 'NONE',
  INTACT = 'INTACT',
  BURNING = 'BURNING',
  BURNT = 'BURNT',
}

export type Language = 'EN' | 'TC';

export interface CellData {
  id: string;
  x: number;
  y: number;
  temp: number;
  
  // Structure
  fuel: number;         
  state: CellState;     
  
  // Netting Layer
  nettingFuel: number;  
  nettingState: NettingState; 
  
  // Debris Layer (Styrofoam)
  styrofoamFuel: number;
  styrofoamState: DebrisState;
}

export interface SimulationConfig {
  material: MaterialType;
  netting: NettingType;
  hasStyrofoam: boolean; // Additive Styrofoam
  windSpeed: number; // 0-10
  weather: WeatherType;
}

export interface SimulationStats {
  peakTemp: number;    // Historical Max
  currentTemp: number; // Real-time Max
  collapsedCount: number;
  burntCount: number;
  activeFireCount: number;
  maxFireArea: number; // Max simultaneous burning cells
  duration: number;    // Total Simulation Ticks
  fireDuration: number; // Ticks with active fire
}
