
import React from 'react';
import { MaterialType, NettingType, SimulationConfig, WeatherType, StyrofoamCoverage } from '../types';
import { RotateCcw, Flame, ShieldAlert, ShieldCheck, Box, Sun, Cloud } from 'lucide-react';

interface ControlsProps {
  config: SimulationConfig;
  setConfig: (config: SimulationConfig) => void;
  isRunning: boolean;
  onStart: () => void;
  onReset: () => void;
  t: any; // Translation object
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, isRunning, onStart, onReset, t }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3 shadow-lg">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
          {t.config}
        </h2>
        {isRunning && (
            <span className="text-xs font-mono text-green-400 animate-pulse">● {t.live}</span>
        )}
      </div>
      
      {/* Top Row: Material & Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Material Selection */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase">{t.structure}</label>
          <div className="flex gap-1">
            <button
              onClick={() => !isRunning && setConfig({ ...config, material: MaterialType.METAL })}
              className={`flex-1 p-2 rounded-md border text-center transition-all ${
                config.material === MaterialType.METAL
                  ? 'bg-slate-700 border-slate-500 text-white shadow-inner'
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={isRunning}
            >
              <div className="font-bold text-xs">{t.metal}</div>
            </button>
            <button
              onClick={() => !isRunning && setConfig({ ...config, material: MaterialType.BAMBOO })}
              className={`flex-1 p-2 rounded-md border text-center transition-all ${
                config.material === MaterialType.BAMBOO
                  ? 'bg-amber-900/60 border-amber-600 text-amber-100 shadow-inner'
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={isRunning}
            >
              <div className="font-bold text-xs">{t.bamboo}</div>
            </button>
          </div>
        </div>

        {/* Weather Selection */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase">{t.weather}</label>
          <div className="flex gap-1 h-[34px]">
             <button
              onClick={() => !isRunning && setConfig({ ...config, weather: WeatherType.DRY })}
              className={`flex-1 rounded-md border flex items-center justify-center gap-1.5 transition-all ${
                config.weather === WeatherType.DRY
                  ? 'bg-orange-900/40 border-orange-500 text-orange-200 shadow-inner'
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={isRunning}
              title={t.dryTitle}
            >
               <Sun size={14} /> <span className="text-xs font-bold">{t.dry}</span>
            </button>
            <button
              onClick={() => !isRunning && setConfig({ ...config, weather: WeatherType.WET })}
              className={`flex-1 rounded-md border flex items-center justify-center gap-1.5 transition-all ${
                config.weather === WeatherType.WET
                  ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-inner'
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={isRunning}
              title={t.wetTitle}
            >
               <Cloud size={14} /> <span className="text-xs font-bold">{t.wet}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Netting Selection */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-gray-500 uppercase">{t.netting}</label>
        <div className="grid grid-cols-3 gap-1">
             <button
              onClick={() => !isRunning && setConfig({ ...config, netting: NettingType.NONE })}
              className={`p-2 rounded-md border text-center transition-all ${
                config.netting === NettingType.NONE
                  ? 'bg-gray-600 border-gray-400 text-white'
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={isRunning}
            >
              <span className="block font-bold text-xs">{t.none}</span>
            </button>
            
            <button
            onClick={() => !isRunning && setConfig({ ...config, netting: NettingType.NON_FIRE_RESISTANT })}
            className={`p-2 rounded-md border text-center transition-all ${
                config.netting === NettingType.NON_FIRE_RESISTANT
                ? 'bg-red-900/50 border-red-500 text-red-100'
                : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
            disabled={isRunning}
            >
            <span className="block font-bold text-xs flex items-center justify-center gap-1">
                {t.flammable}
                <ShieldAlert size={12} />
            </span>
            </button>

            <button
            onClick={() => !isRunning && setConfig({ ...config, netting: NettingType.FIRE_RESISTANT })}
            className={`p-2 rounded-md border text-center transition-all ${
                config.netting === NettingType.FIRE_RESISTANT
                ? 'bg-blue-900/50 border-blue-500 text-blue-100'
                : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
            disabled={isRunning}
            >
            <span className="block font-bold text-xs flex items-center justify-center gap-1">
                {t.safe}
                <ShieldCheck size={12} />
            </span>
            </button>
        </div>
      </div>

      {/* Site Hazards (Styrofoam Coverage) */}
      <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1">
              {t.hazards} <span className="text-orange-500">({t.styrofoam})</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
               <button
                  onClick={() => !isRunning && setConfig({ ...config, styrofoamCoverage: StyrofoamCoverage.NONE })}
                  className={`p-2 rounded-md border text-center transition-all ${
                    config.styrofoamCoverage === StyrofoamCoverage.NONE
                      ? 'bg-gray-600 border-gray-400 text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                  disabled={isRunning}
               >
                  <span className="text-xs font-bold">{t.none}</span>
               </button>
               
               <button
                  onClick={() => !isRunning && setConfig({ ...config, styrofoamCoverage: StyrofoamCoverage.LOW })}
                  className={`p-2 rounded-md border text-center transition-all ${
                    config.styrofoamCoverage === StyrofoamCoverage.LOW
                      ? 'bg-orange-900/30 border-orange-500/50 text-orange-200'
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                  disabled={isRunning}
               >
                  <span className="text-xs font-bold">33%</span>
               </button>

               <button
                  onClick={() => !isRunning && setConfig({ ...config, styrofoamCoverage: StyrofoamCoverage.MEDIUM })}
                  className={`p-2 rounded-md border text-center transition-all ${
                    config.styrofoamCoverage === StyrofoamCoverage.MEDIUM
                      ? 'bg-orange-900/50 border-orange-500 text-orange-100'
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                  disabled={isRunning}
               >
                  <span className="text-xs font-bold">66%</span>
               </button>

               <button
                  onClick={() => !isRunning && setConfig({ ...config, styrofoamCoverage: StyrofoamCoverage.HIGH })}
                  className={`p-2 rounded-md border text-center transition-all ${
                    config.styrofoamCoverage === StyrofoamCoverage.HIGH
                      ? 'bg-orange-600 border-orange-400 text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                  disabled={isRunning}
               >
                  <span className="text-xs font-bold">100%</span>
               </button>
            </div>
      </div>

      {/* Actions */}
      <div className="pt-2 flex gap-2 border-t border-gray-700/50 mt-1">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg shadow-orange-900/20"
          >
            <Flame size={16} />
            <span className="text-sm">{t.ignite}</span>
          </button>
        ) : (
          <button
            onClick={onReset} 
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
          >
            <span className="text-sm">{t.running}</span>
          </button>
        )}
        
        <button
          onClick={onReset}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 p-2 rounded-md transition-colors"
          title={t.reset}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default Controls;
