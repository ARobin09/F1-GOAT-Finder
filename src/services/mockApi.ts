
import { AnalysisOptions, DriverScore } from '../src/types';

// This is a mock calculation function.
// A real backend would use a complex model with a database.
const createPseudoRandomScore = (seedString: string): number => {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Normalize to a 0-1 range
  const random = (hash & 0x7fffffff) / 0x7fffffff;
  return 85 + random * 15; // Base score between 85 and 100
};

export const calculateScores = async (options: AnalysisOptions): Promise<DriverScore[]> => {
  console.log('Calculating scores for:', options);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const scores: Omit<DriverScore, 'rank'>[] = options.drivers.map(driver => {
    // Create a unique seed for each calculation to ensure "deterministic randomness"
    const seed = `${driver.id}-${options.era}-${options.track}-${options.weather}`;
    let score = createPseudoRandomScore(seed);

    // Apply some arbitrary "expert" adjustments based on stereotypes
    if (options.weather === 'Wet' && driver.id === 'senna') score += 5;
    if (options.weather === 'Wet' && driver.id === 'hamilton') score += 3;
    if (options.weather === 'Wet' && driver.id === 'schumacher') score += 4;
    if (options.track.includes('Monaco') && ['senna', 'schumacher'].includes(driver.id)) score += 3;
    if (options.era.includes('Turbo') && driver.id === 'prost') score += 2;
    if (options.era.includes('Hybrid') && driver.id === 'hamilton') score += 4;
    if (options.era.includes('Hybrid') && driver.id === 'verstappen') score += 3;
    
    // Cap score at 100
    score = Math.min(100, score);
    
    return {
      driver,
      score: parseFloat(score.toFixed(2)),
    };
  });
  
  // Sort by score descending
  const sortedScores = scores.sort((a, b) => b.score - a.score);

  // Add rank
  const rankedScores: DriverScore[] = sortedScores.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return rankedScores;
};
   