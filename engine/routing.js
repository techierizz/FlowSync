/**
 * Routing Engine (Two-Tier Intelligence)
 * 1. Global Coordination: Safety-first layer ensures unsafe zones are excluded.
 * 2. Personal Optimization: Routes safe zones based on user persona priorities.
 */
function getBestZone(persona = 'speed') {
    // 1. SAFETY-FIRST LAYER (Global Coordination)
    // No matter what persona is selected, aggressively filter out mathematically unsafe/congested zones.
    let safeZones = Object.values(zones).filter(z => !isCongested(z));

    // Emergency Fallback: If the entire venue is critically packed, we must evaluate all zones to find the "least worst" path.
    let candidateZones = safeZones.length > 0 ? safeZones : Object.values(zones);

    // 2. PERSONAL OPTIMIZATION LAYER (Persona)
    // After safety is guaranteed, apply specific user-intent logic.
    let sorted = candidateZones.sort((a, b) => {
        let scoreA, scoreB;

        if (persona === 'speed') {
            // Fast users: Prioritize minimum queue time and fastest flow
            scoreA = a.density + (a.queue * 2.5);
            scoreB = b.density + (b.queue * 2.5);
        } else if (persona === 'comfort') {
            // Families: Strongly penalize high density (crowds), seeking calmer environments
            scoreA = (a.density * 3) + a.queue;
            scoreB = (b.density * 3) + b.queue;
        } else if (persona === 'accessibility') {
            // Accessible users: Seek the safest, most accessible paths (elevators/ramps)
            scoreA = (a.density * 2) - (a.accessibilityScore * 10);
            scoreB = (b.density * 2) - (b.accessibilityScore * 10);
        } else {
            // Default generic routing
            scoreA = a.density + (a.queue * 2);
            scoreB = b.density + (b.queue * 2);
        }

        return scoreA - scoreB;
    });
    return sorted[0];
}