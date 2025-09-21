
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
          F1 GOAT Analyzer
        </span>
      </h1>
      <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
        Compare Formula 1 legends across 75 years of racing history. Select drivers, an era, a track, and weather to see who comes out on top.
      </p>
    </header>
  );
};
   