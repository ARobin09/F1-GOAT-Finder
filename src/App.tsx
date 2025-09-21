
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DriverSelector } from './components/DriverSelector';
import { FilterControls } from './components/FilterControls';
import { ResultsDisplay } from './components/ResultsDisplay';
import { DRIVERS, ERAS, TRACKS, WEATHER_CONDITIONS } from './constants';
import { Driver, Weather, DriverScore } from './types';
import { calculateScores } from './services/mockApi';

const App: React.FC = () => {
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [selectedEra, setSelectedEra] = useState<string>(ERAS[0]);
  const [selectedTrack, setSelectedTrack] = useState<string>(TRACKS[0]);
  const [selectedWeather, setSelectedWeather] = useState<Weather>(Weather.DRY);
  const [results, setResults] = useState<DriverScore[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (selectedDrivers.length < 2) {
      setError('Please select at least two drivers to compare.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResults(null);

    try {
      const scores = await calculateScores({
        drivers: selectedDrivers,
        era: selectedEra,
        track: selectedTrack,
        weather: selectedWeather,
      });
      setResults(scores);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDrivers, selectedEra, selectedTrack, selectedWeather]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-6">Simulation Setup</h2>
            <div className="space-y-6">
              <DriverSelector
                allDrivers={DRIVERS}
                selectedDrivers={selectedDrivers}
                setSelectedDrivers={setSelectedDrivers}
              />
              <FilterControls
                selectedEra={selectedEra}
                setSelectedEra={setSelectedEra}
                selectedTrack={selectedTrack}
                setSelectedTrack={setSelectedTrack}
                selectedWeather={selectedWeather}
                setSelectedWeather={setSelectedWeather}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || selectedDrivers.length < 2}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
              {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            </div>
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay isLoading={isLoading} results={results} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
   