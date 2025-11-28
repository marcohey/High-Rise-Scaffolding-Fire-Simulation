
import React, { useState } from 'react';
import { AdvancedParams } from '../types';
import { DEFAULT_PARAMS } from '../constants';
import { RotateCcw, Save, X } from 'lucide-react';

interface AdvancedSettingsProps {
  params: AdvancedParams;
  onSave: (params: AdvancedParams) => void;
  onClose: () => void;
  t: any;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ params, onSave, onClose, t }) => {
  const [localParams, setLocalParams] = useState<AdvancedParams>({ ...params });

  const handleChange = (key: keyof AdvancedParams, value: string) => {
    const numValue = parseFloat(value);
    setLocalParams(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleReset = () => {
    setLocalParams(DEFAULT_PARAMS);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-xl flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-gray-100">{t.advancedSettingsTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Temperature Section */}
          <section>
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              {t.settingsTempHeader}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Ignition (°C)</label>
                <input 
                  type="number" 
                  value={localParams.IGNITION_TEMP_BAMBOO}
                  onChange={(e) => handleChange('IGNITION_TEMP_BAMBOO', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Styrofoam Ignition (°C)</label>
                <input 
                  type="number" 
                  value={localParams.IGNITION_TEMP_STYROFOAM}
                  onChange={(e) => handleChange('IGNITION_TEMP_STYROFOAM', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Styrofoam Melt (°C)</label>
                <input 
                  type="number" 
                  value={localParams.MELT_TEMP_STYROFOAM}
                  onChange={(e) => handleChange('MELT_TEMP_STYROFOAM', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Ignition (°C)</label>
                <input 
                  type="number" 
                  value={localParams.IGNITION_TEMP_NETTING}
                  onChange={(e) => handleChange('IGNITION_TEMP_NETTING', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">FR Netting Ignition (°C)</label>
                <input 
                  type="number" 
                  value={localParams.IGNITION_TEMP_NETTING_FR}
                  onChange={(e) => handleChange('IGNITION_TEMP_NETTING_FR', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Metal Failure (°C)</label>
                <input 
                  type="number" 
                  value={localParams.FAILURE_TEMP_METAL}
                  onChange={(e) => handleChange('FAILURE_TEMP_METAL', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Metal Softening (°C)</label>
                <input 
                  type="number" 
                  value={localParams.SOFTENING_TEMP_METAL}
                  onChange={(e) => handleChange('SOFTENING_TEMP_METAL', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Thermal Properties Section */}
          <section>
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Thermal Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Metal Conductivity</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={localParams.CONDUCTIVITY_METAL}
                  onChange={(e) => handleChange('CONDUCTIVITY_METAL', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Metal Heat Capacity</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={localParams.HEAT_CAPACITY_METAL}
                  onChange={(e) => handleChange('HEAT_CAPACITY_METAL', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Conductivity</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={localParams.CONDUCTIVITY_BAMBOO}
                  onChange={(e) => handleChange('CONDUCTIVITY_BAMBOO', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Heat Capacity</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={localParams.HEAT_CAPACITY_BAMBOO}
                  onChange={(e) => handleChange('HEAT_CAPACITY_BAMBOO', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Vertical Spread Factor</label>
                <input 
                  type="number" 
                  step="0.05"
                  value={localParams.VERTICAL_SPREAD_FACTOR}
                  onChange={(e) => handleChange('VERTICAL_SPREAD_FACTOR', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cooling Rate (Dry)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={localParams.COOLING_RATE}
                  onChange={(e) => handleChange('COOLING_RATE', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cooling Rate (Wet)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={localParams.COOLING_RATE_WET}
                  onChange={(e) => handleChange('COOLING_RATE_WET', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Metal Cooling Bonus</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={localParams.METAL_COOLING_BONUS}
                  onChange={(e) => handleChange('METAL_COOLING_BONUS', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Fuel Load Section */}
          <section>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              {t.settingsFuelHeader}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Fuel Load</label>
                <input 
                  type="number" 
                  value={localParams.FUEL_BAMBOO}
                  onChange={(e) => handleChange('FUEL_BAMBOO', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Styrofoam Fuel Load</label>
                <input 
                  type="number" 
                  value={localParams.FUEL_STYROFOAM}
                  onChange={(e) => handleChange('FUEL_STYROFOAM', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Fuel Load</label>
                <input 
                  type="number" 
                  value={localParams.FUEL_NETTING}
                  onChange={(e) => handleChange('FUEL_NETTING', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Heat Output Section */}
          <section>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              {t.settingsHeatHeader}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Heat Output</label>
                <input 
                  type="number" 
                  value={localParams.HEAT_OUTPUT_BAMBOO}
                  onChange={(e) => handleChange('HEAT_OUTPUT_BAMBOO', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Styrofoam Heat Output</label>
                <input 
                  type="number" 
                  value={localParams.HEAT_OUTPUT_STYROFOAM}
                  onChange={(e) => handleChange('HEAT_OUTPUT_STYROFOAM', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Heat Output</label>
                <input 
                  type="number" 
                  value={localParams.HEAT_OUTPUT_NETTING}
                  onChange={(e) => handleChange('HEAT_OUTPUT_NETTING', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">FR Netting Heat Output</label>
                <input 
                  type="number" 
                  value={localParams.HEAT_OUTPUT_NETTING_FR}
                  onChange={(e) => handleChange('HEAT_OUTPUT_NETTING_FR', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Probabilities */}
           <section>
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              {t.settingsProbHeader}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Flashover Chance</label>
                <input 
                  type="number"
                  step="0.05"
                  max="1"
                  min="0" 
                  value={localParams.NETTING_FLASHOVER_CHANCE}
                  onChange={(e) => handleChange('NETTING_FLASHOVER_CHANCE', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">FR Netting Flashover</label>
                <input 
                  type="number"
                  step="0.01"
                  max="1"
                  min="0" 
                  value={localParams.NETTING_FLASHOVER_CHANCE_FR}
                  onChange={(e) => handleChange('NETTING_FLASHOVER_CHANCE_FR', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Styrofoam Drip Chance</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.DRIP_CHANCE_STYROFOAM}
                  onChange={(e) => handleChange('DRIP_CHANCE_STYROFOAM', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Drip Chance</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.DRIP_CHANCE_NETTING}
                  onChange={(e) => handleChange('DRIP_CHANCE_NETTING', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Ign (Dry)</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.BAMBOO_IGNITION_CHANCE_DRY}
                  onChange={(e) => handleChange('BAMBOO_IGNITION_CHANCE_DRY', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Bamboo Ign (Wet)</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.BAMBOO_IGNITION_CHANCE_WET}
                  onChange={(e) => handleChange('BAMBOO_IGNITION_CHANCE_WET', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Ign (Dry)</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.NETTING_IGNITION_CHANCE_DRY}
                  onChange={(e) => handleChange('NETTING_IGNITION_CHANCE_DRY', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Netting Ign (Wet)</label>
                <input 
                  type="number" 
                  step="0.05"
                  max="1"
                  min="0"
                  value={localParams.NETTING_IGNITION_CHANCE_WET}
                  onChange={(e) => handleChange('NETTING_IGNITION_CHANCE_WET', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-gray-800 flex justify-between gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            <RotateCcw size={16} />
            {t.resetDefaults}
          </button>
          
          <button 
            onClick={() => onSave(localParams)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors text-sm font-bold shadow-lg shadow-green-900/20"
          >
            <Save size={16} />
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
