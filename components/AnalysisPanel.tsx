
import React from 'react';
import { SimulationStats, MaterialType, NettingType } from '../types';
import { Thermometer, Activity, TriangleAlert, Clock, Flame, FileText, Maximize } from 'lucide-react';

interface AnalysisPanelProps {
  stats: SimulationStats;
  analysis: string | null;
  isLoadingAnalysis: boolean;
  material: MaterialType;
  netting: NettingType;
  t: any; // Translation object
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ stats, analysis, isLoadingAnalysis, material, netting, t }) => {
  const getTempColor = (temp: number) => {
    if (temp < 100) return 'text-green-400';
    if (temp < 300) return 'text-yellow-400';
    if (temp < 600) return 'text-orange-500';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <Activity className="text-blue-400" />
        {t.liveTelemetry}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        
        {/* Peak Temp */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            <Thermometer size={14} /> {t.peakTemp}
          </div>
          <div className={`text-2xl font-mono font-bold ${getTempColor(stats.peakTemp)}`}>
            {stats.peakTemp.toFixed(0)}°C
          </div>
        </div>

        {/* Current Temp */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            <Thermometer size={14} className="text-gray-500" /> {t.currentTemp}
          </div>
          <div className={`text-2xl font-mono font-bold ${getTempColor(stats.currentTemp)}`}>
            {stats.currentTemp.toFixed(0)}°C
          </div>
        </div>

        {/* Active Fire Status */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
           <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
             <Flame size={14} /> {t.activeFires}
           </div>
           <div className={`text-xl font-bold font-mono ${stats.activeFireCount > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`}>
              {stats.activeFireCount}
           </div>
        </div>

        {/* Max Fire Area */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
           <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
             <Maximize size={14} /> {t.maxFireArea}
           </div>
           <div className="text-xl font-bold font-mono text-gray-200">
              {stats.maxFireArea} <span className="text-xs text-gray-500 font-sans">{t.units}</span>
           </div>
        </div>

        {/* Fire Duration */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 col-span-2">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
             <Clock size={14} /> {t.fireDuration}
          </div>
          <div className="text-xl font-bold text-gray-200 font-mono">
             {stats.fireDuration} <span className="text-xs text-gray-500 font-sans">{t.ticks}</span>
          </div>
        </div>
        
        {/* Structural Status */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 col-span-2">
            <div className="flex justify-between items-end">
                <div>
                     <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t.structuralDamage}</div>
                     <div className="text-gray-200 text-sm">
                        {t.collapsedUnits}: <span className="font-bold text-red-400">{stats.collapsedCount}</span>
                     </div>
                     <div className="text-gray-200 text-sm">
                        {t.burntUnits}: <span className="font-bold text-orange-400">{stats.burntCount}</span>
                     </div>
                </div>
                {material === MaterialType.METAL && stats.peakTemp > 500 && (
                    <div className="text-red-500 flex flex-col items-center animate-bounce">
                        <TriangleAlert size={24} />
                        <span className="text-[10px] font-bold">{t.criticalWeakness}</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 rounded-xl p-5 border border-gray-700 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
            <FileText className="text-purple-400" size={20} />
            <h3 className="font-bold text-gray-200">{t.analysis}</h3>
        </div>
        
        <div className="text-gray-300 text-sm leading-relaxed h-full overflow-y-auto pr-2">
          {isLoadingAnalysis ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-500">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              {t.generating}
            </div>
          ) : analysis ? (
             <div className="prose prose-invert prose-sm">
                 <p className="whitespace-pre-line">{analysis}</p>
                 <div className="mt-4 p-3 bg-purple-900/20 border border-purple-800 rounded text-xs text-purple-200">
                    <strong>{t.noteLabel}</strong> {t.noteText}
                 </div>
             </div>
          ) : (
            <p className="text-gray-500 italic">
              {t.runSimPlaceholder}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
