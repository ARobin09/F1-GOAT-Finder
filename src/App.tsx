
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { DriverSelector } from './components/DriverSelector';
import { FilterControls } from './components/FilterControls';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Driver, DriverScore } from './types';

// Use Vite's environment variables to switch between development and production URLs.
const API_BASE_URL = import.meta.env.PROD
  ? 'https://f1-goat-backend.onrender.com'
  : 'http://127.0.0.1:5000';

// A map to provide richer data than just a name, like a country flag.
const DRIVER_DETAILS: Record<string, { country: string }> = {
  'Lewis Hamilton': { country: '' },
  'Max Verstappen': { country: '' },
  'Fernando Alonso': { country: '' },
  'Nico Rosberg': { country: '' },
  'Ayrton Senna': { country: '' },
  'Alain Prost' : { country: '' },
  'Kimi Raikkonen': {country:''},
  'Sebastian Vettel': {country:''}
  };

const App: React.FC = () => {
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [allTracks, setAllTracks] = useState<Record<string, number>>({});
  
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<number>(0);
  
  const [results, setResults] = useState<DriverScore[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setError(null);
        setIsDataLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/initial-data`);
        if (!response.ok) {
          throw new Error('Failed to load initial data from the server.');
        }
        const data = await response.json();

        // The backend sends a dictionary of driver names to IDs.
        // We must transform this into the `Driver[]` format the UI components expect.
        const driverData: Record<string, number> = data.drivers || {};
        const transformedDrivers: Driver[] = Object.keys(driverData).map((name) => ({
          id: String(driverData[name]), // Use the real ID from the backend
          name: name,
          country: DRIVER_DETAILS[name]?.country, // Get country or use a placeholder
        }));
        
        const trackData: Record<string, number> = data.circuits || {};

        setAllDrivers(transformedDrivers);
        setAllTracks(trackData);

        // Set the default selected track to the first ID from the dictionary
        if (Object.values(trackData).length > 0) {
          setSelectedTrack(Object.values(trackData)[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to connect to the backend: ${err.message}. Make sure the backend server is running.`);
        } else {
          setError('An unknown error occurred while connecting to the backend.');
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  const handleAnalyze = useCallback(async () => {
    if (selectedDrivers.length < 2) {
      setError('Please select at least two drivers to compare.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drivers: selectedDrivers, // Send the array of full driver objects
          circuitId: selectedTrack, // Send the selected circuit ID
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analysis failed on the server.');
      }
      
      const scores = await response.json();
      setResults(scores);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedDrivers, selectedTrack]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-6">Simulation Setup</h2>
            {isDataLoading ? (
               <div className="text-center text-gray-400">Loading simulation options from backend...</div>
            ) : error ? (
              <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>
            ) : (
            <div className="space-y-6">
              <DriverSelector
                allDrivers={allDrivers}
                selectedDrivers={selectedDrivers}
                setSelectedDrivers={setSelectedDrivers}
              />
              <FilterControls
                tracks={allTracks}
                selectedTrack={selectedTrack}
                setSelectedTrack={setSelectedTrack}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || selectedDrivers.length < 2 || isDataLoading}
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
            </div>
            )}
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