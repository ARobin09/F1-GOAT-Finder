export interface Driver {
  id: string;
  name: string;
  country?: string;
}

export interface DriverScore {
  driver: Driver;
  score: number;
  rank: number;
}

// FIX: Add Weather enum to fix missing type error in constants.ts and services/mockApi.ts.
export enum Weather {
  DRY = 'Dry',
  WET = 'Wet',
  MIXED = 'Mixed',
}

// FIX: Add AnalysisOptions interface to fix missing type error in services/mockApi.ts.
export interface AnalysisOptions {
  drivers: Driver[];
  era: string;
  track: string;
  weather: Weather;
}
