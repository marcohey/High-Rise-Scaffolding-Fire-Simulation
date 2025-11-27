
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  CellData, CellState, NettingState, DebrisState, MaterialType, NettingType, SimulationConfig, SimulationStats, WeatherType
} from '../types';
import {
  GRID_WIDTH, GRID_HEIGHT, TICK_RATE_MS, AMBIENT_TEMP,
  IGNITION_TEMP_BAMBOO, IGNITION_TEMP_STYROFOAM, IGNITION_TEMP_NETTING, IGNITION_TEMP_NETTING_FR, FAILURE_TEMP_METAL, SOFTENING_TEMP_METAL, MELT_TEMP_STYROFOAM,
  FUEL_BAMBOO, FUEL_STYROFOAM, FUEL_NETTING, FUEL_METAL,
  HEAT_OUTPUT_BAMBOO, HEAT_OUTPUT_STYROFOAM, HEAT_OUTPUT_NETTING, HEAT_OUTPUT_NETTING_FR,
  CONDUCTIVITY_METAL, CONDUCTIVITY_BAMBOO, CONDUCTIVITY_STYROFOAM, 
  HEAT_CAPACITY_METAL, HEAT_CAPACITY_BAMBOO,
  VERTICAL_SPREAD_FACTOR,
  COOLING_RATE, COOLING_RATE_WET, METAL_COOLING_BONUS, NETTING_FLASHOVER_CHANCE, NETTING_FLASHOVER_CHANCE_FR,
  DRIP_CHANCE_NETTING, DRIP_CHANCE_STYROFOAM,
  BAMBOO_IGNITION_CHANCE_DRY, BAMBOO_IGNITION_CHANCE_WET,
  NETTING_IGNITION_CHANCE_DRY, NETTING_IGNITION_CHANCE_WET
} from '../constants';

interface SimulationCanvasProps {
  config: SimulationConfig;
  isRunning: boolean;
  onStatsUpdate: (stats: SimulationStats) => void;
  onSimulationEnd: () => void;
  t: any; // Translation object
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ 
  config, isRunning, onStatsUpdate, onSimulationEnd, t
}) => {
  // Initialize Grid
  const createInitialGrid = useCallback((currentConfig: SimulationConfig): CellData[] => {
    const cells: CellData[] = [];
    const hasNetting = currentConfig.netting !== NettingType.NONE;

    let initialStructureFuel = FUEL_METAL;
    if (currentConfig.material === MaterialType.BAMBOO) initialStructureFuel = FUEL_BAMBOO;

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        cells.push({
          id: `${x}-${y}`,
          x,
          y,
          temp: AMBIENT_TEMP,
          fuel: initialStructureFuel,
          state: CellState.NORMAL,
          
          nettingFuel: hasNetting ? FUEL_NETTING : 0,
          nettingState: hasNetting ? NettingState.INTACT : NettingState.NONE,

          styrofoamFuel: currentConfig.hasStyrofoam ? FUEL_STYROFOAM : 0,
          styrofoamState: currentConfig.hasStyrofoam ? DebrisState.INTACT : DebrisState.NONE,
        });
      }
    }
    return cells;
  }, []);

  const [cells, setCells] = useState<CellData[]>(() => createInitialGrid(config));
  const [tickCount, setTickCount] = useState(0);
  const requestRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  // Stats refs
  const statsRef = useRef<SimulationStats>({
    peakTemp: AMBIENT_TEMP,
    currentTemp: AMBIENT_TEMP,
    collapsedCount: 0,
    burntCount: 0,
    activeFireCount: 0,
    maxFireArea: 0,
    duration: 0,
    fireDuration: 0,
  });

  // Reset grid when config changes
  useEffect(() => {
    setCells(createInitialGrid(config));
    setTickCount(0);
    statsRef.current = {
      peakTemp: AMBIENT_TEMP,
      currentTemp: AMBIENT_TEMP,
      collapsedCount: 0,
      burntCount: 0,
      activeFireCount: 0,
      maxFireArea: 0,
      duration: 0,
      fireDuration: 0,
    };
    onStatsUpdate(statsRef.current);
  }, [config, createInitialGrid, onStatsUpdate]);

  // Simulation Logic Step
  const simulateStep = useCallback(() => {
    setCells(prevCells => {
      // We create a copy to mutate for the next frame
      const nextCells = prevCells.map(c => ({ ...c }));
      const getIndex = (x: number, y: number) => y * GRID_WIDTH + x;
      const isMetal = config.material === MaterialType.METAL;
      const isWet = config.weather === WeatherType.WET;
      
      // Material Properties
      const conductivity = isMetal ? CONDUCTIVITY_METAL : CONDUCTIVITY_BAMBOO;
      const heatCapacity = isMetal ? HEAT_CAPACITY_METAL : HEAT_CAPACITY_BAMBOO;

      // Netting Properties based on type
      const isFR = config.netting === NettingType.FIRE_RESISTANT;
      let spreadChance = isFR ? NETTING_FLASHOVER_CHANCE_FR : NETTING_FLASHOVER_CHANCE;
      const nettingHeatOutput = isFR ? HEAT_OUTPUT_NETTING_FR : HEAT_OUTPUT_NETTING;
      const nettingIgnitionTemp = isFR ? IGNITION_TEMP_NETTING_FR : IGNITION_TEMP_NETTING;

      // Weather dampens netting flashover spread
      if (isWet) {
          spreadChance *= 0.4;
      }

      let currentFrameMaxTemp = -Infinity;
      let activeFire = 0;
      let burnt = 0;
      let collapsed = 0;
      let anythingChanged = false;

      // --- PHASE 1: NETTING SHEET LOGIC (Separate Layer) ---
      for (let i = 0; i < prevCells.length; i++) {
        const cell = prevCells[i];
        const nextCell = nextCells[i];

        if (cell.nettingState === NettingState.BURNING) {
           activeFire++;
           nextCell.nettingFuel -= 5;
           
           // Flashover upwards
           if (cell.y > 0) {
             const aboveIdx = getIndex(cell.x, cell.y - 1);
             const aboveCell = nextCells[aboveIdx];
             if (aboveCell.nettingState === NettingState.INTACT && Math.random() < spreadChance) {
               aboveCell.nettingState = NettingState.BURNING;
               aboveCell.temp = Math.max(aboveCell.temp, nettingIgnitionTemp + 50);
             }
           }

           // Downward Dripping (Non-Compliant Netting)
           if (!isFR && cell.y < GRID_HEIGHT - 1 && Math.random() < DRIP_CHANCE_NETTING) {
             const belowIdx = getIndex(cell.x, cell.y + 1);
             const belowCell = nextCells[belowIdx];
             // Transfer heat and potentially ignite below
             belowCell.temp += 80;
             if (belowCell.nettingState === NettingState.INTACT && belowCell.temp > nettingIgnitionTemp) {
                 belowCell.nettingState = NettingState.BURNING;
             }
           }

           // Side spread
           const sideSpreadChance = isFR ? 0.01 : 0.1;
           if (Math.random() < sideSpreadChance) {
             const neighbors = [-1, 1];
             neighbors.forEach(dx => {
               const nx = cell.x + dx;
               if (nx >= 0 && nx < GRID_WIDTH) {
                 const nIdx = getIndex(nx, cell.y);
                 if (nextCells[nIdx].nettingState === NettingState.INTACT) {
                    nextCells[nIdx].nettingState = NettingState.BURNING;
                 }
               }
             });
           }

           if (nextCell.nettingFuel <= 0) {
             nextCell.nettingState = NettingState.BURNT;
           }
        }
      }

      // --- PHASE 2: STYROFOAM / DEBRIS LOGIC ---
      for (let i = 0; i < prevCells.length; i++) {
          const cell = prevCells[i];
          const nextCell = nextCells[i];

          if (cell.styrofoamState === DebrisState.BURNING) {
              activeFire++;
              nextCell.styrofoamFuel -= 4; // Burns fast
              
              // Dripping Molten Fire Logic
              // If burning, it drips aggressively downwards
              if (cell.y < GRID_HEIGHT - 1 && Math.random() < DRIP_CHANCE_STYROFOAM) {
                  const belowIdx = getIndex(cell.x, cell.y + 1);
                  const belowCell = nextCells[belowIdx];
                  belowCell.temp += 150; // Molten plastic carries high heat
                  
                  // Instantly ignite styrofoam below if present
                  if (belowCell.styrofoamState === DebrisState.INTACT) {
                      belowCell.styrofoamState = DebrisState.BURNING;
                  }
                  // Or ignite netting
                  if (belowCell.nettingState === NettingState.INTACT) {
                      belowCell.nettingState = NettingState.BURNING;
                  }
              }

              if (nextCell.styrofoamFuel <= 0) {
                  nextCell.styrofoamState = DebrisState.BURNT;
              }
          }
      }

      // --- PHASE 3: STRUCTURAL PHYSICS & HEAT EXCHANGE ---
      for (let i = 0; i < prevCells.length; i++) {
        const cell = prevCells[i];
        let nextCell = nextCells[i];
        
        let newTemp = cell.temp;
        let heatInput = 0;

        // A. Heat from Netting
        if (nextCell.nettingState === NettingState.BURNING) {
            heatInput += nettingHeatOutput;
        }

        // B. Heat from Styrofoam
        if (nextCell.styrofoamState === DebrisState.BURNING) {
             heatInput += HEAT_OUTPUT_STYROFOAM;
        }

        // C. Heat from Structure
        if (cell.state === CellState.BURNING) {
            heatInput += HEAT_OUTPUT_BAMBOO;
            nextCell.fuel -= 1;
            if (nextCell.fuel <= 0) {
                 nextCell.state = isMetal ? CellState.NORMAL : CellState.BURNT;
            }
        }

        // D. Apply Heat based on Capacity
        // Low Capacity = High Temp Rise for same energy
        newTemp += heatInput / heatCapacity;

        // E. Ignition / Failure Checks
        if (nextCell.state !== CellState.BURNT && nextCell.state !== CellState.COLLAPSED) {
            // Structure Ignition (Bamboo Only)
            if (!isMetal && newTemp >= IGNITION_TEMP_BAMBOO && nextCell.state !== CellState.BURNING) {
                // Weather Probability Check
                const ignitionProbability = isWet ? BAMBOO_IGNITION_CHANCE_WET : BAMBOO_IGNITION_CHANCE_DRY;
                if (Math.random() < ignitionProbability) {
                   nextCell.state = CellState.BURNING;
                }
            }
            // Metal Failure
            if (isMetal && newTemp >= FAILURE_TEMP_METAL) {
                nextCell.state = CellState.COLLAPSED;
            }
        }

        // Styrofoam Ignition & Melting
        if (nextCell.styrofoamState === DebrisState.INTACT) {
             // Ignition
             if (newTemp >= IGNITION_TEMP_STYROFOAM) {
                 nextCell.styrofoamState = DebrisState.BURNING;
             } 
             // Melting Hazard (pre-ignition but dangerous if external fire drops)
             else if (newTemp >= MELT_TEMP_STYROFOAM) {
                 // No state change yet, but easier to ignite?
             }
        }

        // Netting Ignition (Thermal)
        if (nextCell.nettingState === NettingState.INTACT && newTemp >= nettingIgnitionTemp) {
             const nettingIgnitionChance = isWet ? NETTING_IGNITION_CHANCE_WET : NETTING_IGNITION_CHANCE_DRY;
             if (Math.random() < nettingIgnitionChance) {
                 nextCell.nettingState = NettingState.BURNING;
             }
        }

        // F. Cooling
        // Styrofoam insulates, reducing cooling if present and intact
        // Wet weather increases cooling rate
        let coolingFactor = isWet ? COOLING_RATE_WET : COOLING_RATE;
        if (isMetal) coolingFactor += METAL_COOLING_BONUS;
        
        if (nextCell.styrofoamState === DebrisState.INTACT) {
            coolingFactor *= 0.5; // Trap heat
        }

        newTemp -= (newTemp - AMBIENT_TEMP) * coolingFactor;
        nextCell.temp = newTemp;
      }

      // --- PHASE 4: THERMAL DIFFUSION (Multi-Pass for Metal) ---
      // Metal has high conductivity, meaning heat spreads "faster" than the simulation tick rate.
      const diffusionPasses = isMetal ? 4 : 1; 
      
      let activeConductivity = conductivity;
      if (config.hasStyrofoam) {
          activeConductivity = (activeConductivity + CONDUCTIVITY_STYROFOAM) / 2;
      }

      for (let pass = 0; pass < diffusionPasses; pass++) {
        // Use a temporary array for diffusion deltas for this pass
        const diffusions = new Float32Array(prevCells.length);
        
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
              const idx = getIndex(x, y);
              const currentTemp = nextCells[idx].temp;
              
              const neighbors = [
                { dx: 0, dy: -1, factor: VERTICAL_SPREAD_FACTOR }, 
                { dx: 0, dy: 1, factor: 0.1 },
                { dx: -1, dy: 0, factor: 0.15 },
                { dx: 1, dy: 0, factor: 0.15 },
              ];

              neighbors.forEach(({ dx, dy, factor }) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                  const nIdx = getIndex(nx, ny);
                  const neighborTemp = nextCells[nIdx].temp;
                  const diff = (currentTemp - neighborTemp) * activeConductivity * factor;
                  diffusions[idx] -= diff;
                  diffusions[nIdx] += diff;
                }
              });
            }
        }

        // Apply this pass's diffusion
        for (let i = 0; i < nextCells.length; i++) {
            nextCells[i].temp += diffusions[i];
        }
      }

      // Final State Check & Stats Calculation
      for (let i = 0; i < nextCells.length; i++) {
          if (nextCells[i].temp > currentFrameMaxTemp) currentFrameMaxTemp = nextCells[i].temp;
          if (nextCells[i].state === CellState.BURNT) burnt++;
          if (nextCells[i].state === CellState.COLLAPSED) collapsed++;

          if (Math.abs(nextCells[i].temp - prevCells[i].temp) > 0.5 || 
              nextCells[i].state !== prevCells[i].state || 
              nextCells[i].nettingState !== prevCells[i].nettingState ||
              nextCells[i].styrofoamState !== prevCells[i].styrofoamState) {
              anythingChanged = true;
          }
      }
      
      // Recount active fire accurately for stats
      activeFire = nextCells.filter(c => 
          c.state === CellState.BURNING || 
          c.nettingState === NettingState.BURNING || 
          c.styrofoamState === DebrisState.BURNING
      ).length;

      const currentMax = currentFrameMaxTemp > AMBIENT_TEMP ? currentFrameMaxTemp : AMBIENT_TEMP;

      statsRef.current = {
        peakTemp: Math.max(statsRef.current.peakTemp, currentMax),
        currentTemp: currentMax,
        activeFireCount: activeFire,
        maxFireArea: Math.max(statsRef.current.maxFireArea, activeFire),
        burntCount: burnt,
        collapsedCount: collapsed,
        duration: statsRef.current.duration + 1,
        fireDuration: activeFire > 0 ? statsRef.current.fireDuration + 1 : statsRef.current.fireDuration
      };
      
      if (!anythingChanged && activeFire === 0 && statsRef.current.duration > 20) {
        onSimulationEnd();
      }

      return nextCells;
    });
  }, [config, onSimulationEnd]);


  const loop = (time: number) => {
    if (!isRunning) return;
    if (time - lastTickRef.current > TICK_RATE_MS) {
      simulateStep();
      onStatsUpdate(statsRef.current);
      lastTickRef.current = time;
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, simulateStep, onStatsUpdate]);

  const ignite = () => {
    setCells(prev => {
      const next = [...prev];
      const startIdx = (GRID_HEIGHT - 2) * GRID_WIDTH + Math.floor(GRID_WIDTH / 2);
      if (next[startIdx]) {
        next[startIdx].temp = 800; 
        
        // Ignite everything at source
        if (next[startIdx].nettingState !== NettingState.NONE) {
            next[startIdx].nettingState = NettingState.BURNING;
        }
        if (next[startIdx].styrofoamState !== DebrisState.NONE) {
            next[startIdx].styrofoamState = DebrisState.BURNING;
        }
        // Force ignite bamboo regardless of weather for the starter cell
        if (config.material === MaterialType.BAMBOO) {
            next[startIdx].state = CellState.BURNING;
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (isRunning && tickCount === 0) {
        ignite();
        setTickCount(1);
    }
  }, [isRunning, tickCount]);

  // Rendering
  const getStructureClasses = (cell: CellData) => {
     let classes = "absolute inset-0 transition-colors duration-300 ";

     if (cell.state === CellState.COLLAPSED) {
        classes += "bg-gray-800 border-2 border-gray-700 skew-x-12 scale-90 ";
     } else if (cell.state === CellState.BURNT) {
        classes += "bg-stone-900 border border-stone-800 opacity-60 ";
     } else {
        switch (config.material) {
            case MaterialType.METAL:
                if (cell.temp > SOFTENING_TEMP_METAL) classes += "bg-slate-400 border border-red-900 "; 
                else classes += "bg-slate-500 border border-slate-600 ";
                break;
            case MaterialType.BAMBOO:
                classes += "bg-amber-200 border border-amber-300 ";
                break;
        }
     }
     
     if (cell.state === CellState.BURNING) {
         classes += " animate-pulse bg-gradient-to-t from-orange-600 to-yellow-500 ";
     }

     return classes;
  };

  const isFR = config.netting === NettingType.FIRE_RESISTANT;

  return (
    <div 
        className="grid gap-0.5 transition-all duration-300 relative w-full max-w-[300px]"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
        }}
    >
        {cells.map((cell) => {
          const isDripping = (cell.styrofoamState === DebrisState.BURNING) || 
                             (cell.nettingState === NettingState.BURNING && !isFR);
                             
          return (
            <div key={cell.id} className="w-full pt-[100%] relative rounded-sm overflow-hidden bg-gray-900">
              
              {/* LAYER 1: The Structure */}
              <div className={getStructureClasses(cell)}></div>

              {/* LAYER 2: Styrofoam Debris (Additive) */}
              {cell.styrofoamState !== DebrisState.NONE && cell.styrofoamState !== DebrisState.BURNT && (
                  <div className={`absolute inset-2 border border-gray-300 rounded-sm z-5 
                      ${cell.styrofoamState === DebrisState.BURNING ? 'bg-orange-500 animate-pulse' : 'bg-gray-100 opacity-80'}`}>
                  </div>
              )}

              {/* LAYER 3: The Netting Overlay */}
              {cell.nettingState !== NettingState.NONE && cell.nettingState !== NettingState.BURNT && (
                  <div 
                      className={`absolute inset-0 z-10 pointer-events-none transition-all duration-150
                          ${cell.nettingState === NettingState.BURNING ? 'opacity-100 mix-blend-screen' : 'opacity-70'}
                      `}
                      style={{
                          backgroundImage: cell.nettingState === NettingState.BURNING 
                              ? 'linear-gradient(to top, rgba(255, 69, 0, 0.8), rgba(255, 215, 0, 0.5))'
                              : isFR 
                                  ? `repeating-linear-gradient(90deg, 
                                    rgba(59, 130, 246, 0.1) 0px, 
                                    rgba(59, 130, 246, 0.1) 1px, 
                                    rgba(59, 130, 246, 0.6) 2px, 
                                    rgba(59, 130, 246, 0.1) 3px
                                  )`
                                  : `repeating-linear-gradient(90deg, 
                                    rgba(20, 184, 166, 0.1) 0px, 
                                    rgba(20, 184, 166, 0.1) 1px, 
                                    rgba(20, 184, 166, 0.8) 2px, 
                                    rgba(20, 184, 166, 0.1) 3px
                                  )`,
                          boxShadow: cell.nettingState === NettingState.BURNING ? '0 0 10px rgba(255,100,0,0.8)' : 'none'
                      }}
                  >
                  </div>
              )}
              
              {/* Heat Overlay */}
              {cell.temp > AMBIENT_TEMP + 50 && cell.nettingState !== NettingState.BURNING && (
                  <div 
                      className="absolute inset-0 z-0 bg-red-600 transition-opacity duration-300 pointer-events-none"
                      style={{ opacity: Math.min((cell.temp - 50) / 1000, 0.4) }}
                  ></div>
              )}

              {/* Dripping Effect (Molten Fire) */}
              {isDripping && (
                  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-1.5 h-3 bg-orange-500 rounded-full animate-bounce z-20 shadow-[0_0_5px_rgba(255,100,0,1)]"></div>
              )}
            </div>
          );
        })}
        <div className="absolute -bottom-6 left-0 right-0 h-4 bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
             <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{t.ground}</span>
        </div>
    </div>
  );
};

export default SimulationCanvas;
