import React from 'react';

interface FilterControlsProps {
  tracks: Record<string, number>;
  selectedTrack: number;
  setSelectedTrack: (trackId: number) => void;
}

const SelectInput: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, number>;
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
      {Object.entries(options).map(([name, id]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  </div>
);

export const FilterControls: React.FC<FilterControlsProps> = ({
  tracks,
  selectedTrack,
  setSelectedTrack,
}) => {
  return (
    <>
      <SelectInput
        label="Select Track"
        value={selectedTrack}
        onChange={e => setSelectedTrack(Number(e.target.value))}
        options={tracks}
      />
    </>
  );
};