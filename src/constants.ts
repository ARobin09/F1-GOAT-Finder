
import { Driver, Weather } from './types';

export const DRIVERS: Driver[] = [
  { id: 'hamilton', name: 'Lewis Hamilton', country: '🇬🇧' },
  { id: 'schumacher', name: 'Michael Schumacher', country: '🇩🇪' },
  { id: 'senna', name: 'Ayrton Senna', country: '🇧🇷' },
  { id: 'prost', name: 'Alain Prost', country: '🇫🇷' },
  { id: 'fangio', name: 'Juan Manuel Fangio', country: '🇦🇷' },
  { id: 'verstappen', name: 'Max Verstappen', country: '🇳🇱' },
  { id: 'vettel', name: 'Sebastian Vettel', country: '🇩🇪' },
  { id: 'lauda', name: 'Niki Lauda', country: '🇦🇹' },
  { id: 'clark', name: 'Jim Clark', country: '🇬🇧' },
  { id: 'stewart', name: 'Jackie Stewart', country: '🇬🇧' },
  { id: 'alonso', name: 'Fernando Alonso', country: '🇪🇸' },
  { id: 'hakkinen', name: 'Mika Häkkinen', country: '🇫🇮' },
  { id: 'raikkonen', name: 'Kimi Räikkönen', country: '🇫🇮' },
  { id: 'mansell', name: 'Nigel Mansell', country: '🇬🇧' },
  { id: 'piquet', name: 'Nelson Piquet', country: '🇧🇷' },
  { id: 'leclerc', name: 'Charles Leclerc', country: '🇲🇨' },
  { id: 'norris', name: 'Lando Norris', country: '🇬🇧' },
  { id: 'russell', name: 'George Russell', country: '🇬🇧' },
];

export const ERAS: string[] = [
  '1950s - Front-Engine Beasts',
  '1960s - The British Invasion',
  '1970s - Aerodynamic Wings',
  '1980s - Turbo Era Titans',
  '1990s - Electronic Revolution',
  '2000s - V10 Screamers',
  '2010s - Hybrid Power Units',
  '2020s - Ground Effect Revival',
];

export const TRACKS: string[] = [
  'Monaco, Monte Carlo',
  'Silverstone, UK',
  'Spa-Francorchamps, Belgium',
  'Monza, Italy',
  'Suzuka, Japan',
  'Interlagos, Brazil',
  'Nürburgring, Germany',
  'Circuit of the Americas, USA',
];

export const WEATHER_CONDITIONS: Weather[] = [
  Weather.DRY,
  Weather.WET,
  Weather.MIXED,
];
   