
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

export enum StyrofoamCoverage {
  NONE = 0,
  LOW = 0.33,
  MEDIUM = 0.66,
  HIGH = 1.0,
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
  styrofoamCoverage: StyrofoamCoverage; // Changed from boolean
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

export interface AdvancedParams {
  // Temperatures
  IGNITION_TEMP_BAMBOO: number;
  IGNITION_TEMP_STYROFOAM: number;
  MELT_TEMP_STYROFOAM: number;
  IGNITION_TEMP_NETTING: number;
  IGNITION_TEMP_NETTING_FR: number;
  FAILURE_TEMP_METAL: number;
  SOFTENING_TEMP_METAL: number;
  
  // Fuel
  FUEL_BAMBOO: number;
  FUEL_STYROFOAM: number;
  FUEL_NETTING: number;

  // Heat Output
  HEAT_OUTPUT_BAMBOO: number;
  HEAT_OUTPUT_STYROFOAM: number;
  HEAT_OUTPUT_NETTING: number;
  HEAT_OUTPUT_NETTING_FR: number;

  // Thermal Properties
  CONDUCTIVITY_METAL: number;
  HEAT_CAPACITY_METAL: number;
  CONDUCTIVITY_BAMBOO: number;
  HEAT_CAPACITY_BAMBOO: number;
  VERTICAL_SPREAD_FACTOR: number;
  COOLING_RATE: number;
  COOLING_RATE_WET: number;
  METAL_COOLING_BONUS: number;

  // Probabilities (0-1)
  NETTING_FLASHOVER_CHANCE: number;
  NETTING_FLASHOVER_CHANCE_FR: number;
  DRIP_CHANCE_STYROFOAM: number;
  DRIP_CHANCE_NETTING: number;
  
  // Ignition Chances (0-1)
  BAMBOO_IGNITION_CHANCE_DRY: number;
  BAMBOO_IGNITION_CHANCE_WET: number;
  NETTING_IGNITION_CHANCE_DRY: number;
  NETTING_IGNITION_CHANCE_WET: number;
}
