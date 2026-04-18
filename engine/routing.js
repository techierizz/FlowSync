/**
 * Routing Engine (User-Level Intelligence)
 * Identifies the optimal route based on user persona priorities.
 */
function getBestZone(persona = 'speed') {
    let sorted = Object.values(zones).sort((a, b) => {
        let scoreA, scoreB;
        
        if (persona === 'speed') {
            // Prioritize minimum queue time and fastest flow
            scoreA = a.density + (a.queue * 2.5);
            scoreB = b.density + (b.queue * 2.5);
        } else if (persona === 'comfort') {
            // Strongly penalize high density (crowds), tolerate slight queues
            scoreA = (a.density * 3) + a.queue;
            scoreB = (b.density * 3) + b.queue;
        } else if (persona === 'accessibility') {
            // Prioritize high accessibility score, penalize crowds
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