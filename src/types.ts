
export interface Driver {
  id: string;
  name: string;
  country: string;
}

export enum Weather {
  DRY = 'Dry',
  WET = 'Wet',
  MIXED = 'Mixed Conditions',
}

export interface AnalysisOptions {
  drivers: Driver[];
  era: string;
  track: string;
  weather: Weather;
}

export interface DriverScore {
  driver: Driver;
  score: number;
  rank: number;
}
   