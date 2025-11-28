
import React, { useState, useCallback } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import AnalysisPanel from './components/AnalysisPanel';
import AdvancedSettings from './components/AdvancedSettings';
import { SimulationConfig, MaterialType, NettingType, SimulationStats, WeatherType, Language, StyrofoamCoverage, AdvancedParams } from './types';
import { DEFAULT_PARAMS } from './constants';
import { generateAnalysis } from './services/geminiService';
import { TRANSLATIONS } from './translations';
import { Globe, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('TC');
  const t = TRANSLATIONS[language];

  const [config, setConfig] = useState<SimulationConfig>({
    material: MaterialType.BAMBOO,
    netting: NettingType.NONE,
    styrofoamCoverage: StyrofoamCoverage.NONE,
    windSpeed: 2,
    weather: WeatherType.DRY,
  });

  const [params, setParams] = useState<AdvancedParams>(DEFAULT_PARAMS);
  const [showSettings, setShowSettings] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<SimulationStats>({
    peakTemp: 25,
    currentTemp: 25,
    collapsedCount: 0,
    burntCount: 0,
    activeFireCount: 0,
    maxFireArea: 0,
    duration: 0,
    fireDuration: 0,
  });
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    setAnalysis(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setAnalysis(null);
    setStats({
      peakTemp: 25,
      currentTemp: 25,
      collapsedCount: 0,
      burntCount: 0,
      activeFireCount: 0,
      maxFireArea: 0,
      duration: 0,
      fireDuration: 0,
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'TC' : 'EN');
  };

  const handleStatsUpdate = useCallback((newStats: SimulationStats) => {
    setStats(newStats);
  }, []);

  const handleSimulationEnd = async () => {
    setIsRunning(false);
    setIsAnalyzing(true);
    try {
      const result = await generateAnalysis(config.material, config.netting, config.styrofoamCoverage, config.weather, stats, language);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveParams = (newParams: AdvancedParams) => {
    setParams(newParams);
    setShowSettings(false);
    handleReset(); // Reset simulation so physics changes take effect cleanly
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 lg:p-6 flex flex-col font-sans">
      <header className="mb-6 max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            {t.appTitle}
          </h1>
          <p className="text-gray-400 mt-1 text-sm lg:text-base max-w-3xl">
            {t.appDescription}
          </p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shrink-0"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">{t.advancedSettings}</span>
          </button>
          <button 
            onClick={toggleLanguage}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shrink-0"
          >
            <Globe size={16} />
            {language === 'EN' ? '中文' : 'English'}
          </button>
        </div>
      </header>

      {/* Grid Layout: Enters side-by-side mode on 'md' (Tablets) instead of 'lg' */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* Left Column: Controls & Grid */}
        <div className="md:col-span-7 flex flex-col gap-4">
           <Controls 
             config={config} 
             setConfig={setConfig} 
             isRunning={isRunning} 
             onStart={handleStart} 
             onReset={handleReset}
             t={t}
           />
           
           <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col overflow-hidden shadow-2xl">
               {/* Simulation Area */}
               <div className="relative flex-1 p-4 lg:p-6 flex items-center justify-center min-h-[350px] md:min-h-[400px]">
                   {/* Context Labels */}
                   <div className="absolute left-4 top-4 text-[10px] text-gray-600 font-mono space-y-1 z-10">
                       <div>{t.height}</div>
                       <div>{t.wind}: {config.windSpeed * 10}km/h</div>
                       <div>{config.weather === WeatherType.DRY ? `${t.condition}: ${t.dry.toUpperCase()}` : `${t.condition}: ${t.wet.toUpperCase()}`}</div>
                   </div>

                   <SimulationCanvas 
                     config={config} 
                     params={params}
                     isRunning={isRunning} 
                     onStatsUpdate={handleStatsUpdate}
                     onSimulationEnd={handleSimulationEnd}
                     t={t}
                   />
               </div>

               {/* Legend - Separate Section (No Overlap) */}
               <div className="bg-gray-950/50 border-t border-gray-800 px-4 py-3 flex flex-wrap justify-center gap-x-4 lg:gap-x-6 gap-y-2 text-[10px] text-gray-400 uppercase tracking-wide">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500 animate-pulse rounded-sm shadow-[0_0_5px_orange]"></div> {t.legendFire}</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-500 border border-slate-600 rounded-sm"></div> {t.legendMetal}</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-200 border border-amber-300 rounded-sm"></div> {t.legendBamboo}</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-100 rounded-sm"></div> {t.legendStyrofoam}</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 border border-dashed border-teal-500 rounded-sm"></div> {t.legendNetting}</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> {t.legendDrip}</div>
               </div>
           </div>
        </div>

        {/* Right Column: Analysis */}
        <div className="md:col-span-5 h-full">
           <AnalysisPanel 
             stats={stats} 
             analysis={analysis} 
             isLoadingAnalysis={isAnalyzing}
             material={config.material}
             netting={config.netting}
             t={t}
           />
        </div>
      </main>

      {showSettings && (
        <AdvancedSettings 
          params={params} 
          onSave={handleSaveParams} 
          onClose={() => setShowSettings(false)}
          t={t}
        />
      )}

      <footer className="mt-8 py-4 border-t border-gray-800 text-center text-gray-500 text-xs">
         {t.footerDisclaimer}
      </footer>
    </div>
  );
};

export default App;
