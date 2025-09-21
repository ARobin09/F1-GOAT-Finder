
import React from 'react';
import { ERAS, TRACKS, WEATHER_CONDITIONS } from '../constants';
import { Weather } from '../types';

interface FilterControlsProps {
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  selectedWeather: Weather;
  setSelectedWeather: (weather: Weather) => void;
}

const SelectInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedEra,
  setSelectedEra,
  selectedTrack,
  setSelectedTrack,
  selectedWeather,
  setSelectedWeather,
}) => {
  return (
    <>
      <SelectInput
        label="Select Era"
        value={selectedEra}
        onChange={e => setSelectedEra(e.target.value)}
        options={ERAS}
      />
      <SelectInput
        label="Select Track"
        value={selectedTrack}
        onChange={e => setSelectedTrack(e.target.value)}
        options={TRACKS}
      />
      <SelectInput
        label="Select Weather"
        value={selectedWeather}
        onChange={e => setSelectedWeather(e.target.value as Weather)}
        options={WEATHER_CONDITIONS}
      />
    </>
  );
};
   