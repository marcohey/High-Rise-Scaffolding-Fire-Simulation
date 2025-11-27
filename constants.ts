
export const GRID_WIDTH = 12;
export const GRID_HEIGHT = 20;
export const TICK_RATE_MS = 100;

// Temperatures in Celsius
export const AMBIENT_TEMP = 25;
export const IGNITION_TEMP_BAMBOO = 300; 
export const IGNITION_TEMP_STYROFOAM = 240; // Ignites easily
export const MELT_TEMP_STYROFOAM = 100; // Melts and loses structural integrity
export const IGNITION_TEMP_NETTING = 180; 
export const IGNITION_TEMP_NETTING_FR = 450; // Fire retardant resists ignition
export const FAILURE_TEMP_METAL = 600; 
export const SOFTENING_TEMP_METAL = 300; 

// Fuel Units
export const FUEL_BAMBOO = 200;
export const FUEL_STYROFOAM = 150; // Burns faster than bamboo
export const FUEL_NETTING = 130; // Burns very fast (Flash)
export const FUEL_METAL = 0;

// Heat Generation (Per tick)
export const HEAT_OUTPUT_BAMBOO = 15; 
export const HEAT_OUTPUT_STYROFOAM = 50; // Intense heat
export const HEAT_OUTPUT_NETTING = 55; // Very hot, short duration
export const HEAT_OUTPUT_NETTING_FR = 10; // Low heat output if it does burn

// Thermal Properties
// Metal: Extremely High Conductivity (Heat travels fast), Low Heat Capacity (Temps rise fast)
export const CONDUCTIVITY_METAL = 0.55; 
export const HEAT_CAPACITY_METAL = 0.6; 

// Bamboo: Very Low Conductivity (Heat trapped), High Heat Capacity (Resists temp change)
export const CONDUCTIVITY_BAMBOO = 0.10; 
export const HEAT_CAPACITY_BAMBOO = 3.0; 

export const CONDUCTIVITY_STYROFOAM = 0.01; // Insulator
export const VERTICAL_SPREAD_FACTOR = 0.25; 

// Flashover Logic
export const NETTING_FLASHOVER_CHANCE = 0.85; // High chance to instantly ignite unit above
export const NETTING_FLASHOVER_CHANCE_FR = 0.01; // Very low spread chance for FR
export const COOLING_RATE = 0.05; 
export const COOLING_RATE_WET = 0.12; // Wet conditions cool faster due to evaporation
export const METAL_COOLING_BONUS = 0.15; // Metal sheds heat to air

// Weather Ignition Modifiers (Bamboo)
// Even at ignition temp, does it actually catch fire?
export const BAMBOO_IGNITION_CHANCE_DRY = 0.95; // Almost certain ignition
export const BAMBOO_IGNITION_CHANCE_WET = 0.15; // Hard to ignite (requires sustained heat)

// Weather Ignition Modifiers (Netting)
export const NETTING_IGNITION_CHANCE_DRY = 0.95;
export const NETTING_IGNITION_CHANCE_WET = 0.25; // Wet netting struggles to catch fire

// Dripping / Falling Debris Logic
export const DRIP_CHANCE_NETTING = 0.40; // Chance per tick for burning netting to ignite cell below
export const DRIP_CHANCE_STYROFOAM = 0.70; // Chance per tick for melting styrofoam to ignite cell below
