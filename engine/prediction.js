/**
 * Predictive Analytics Engine
 * Forecasts congestion and wait times.
 */

function isCongested(zone) {
    // Predictive congestion score based on current density + rate of inflow
    let predictiveScore = (zone.density * 0.6) + (zone.inflow * 1.5) + (zone.queue * 0.4);
    return predictiveScore > 65; // Threshold for congestion
}

function predictTimeInQueue(zone) {
    // Little's Law adaptation: L = lambda * W
    // Returns Estimated Wait Time in minutes
    if (zone.queue <= 0) return 0;
    return Math.round((zone.queue * 1.5) / Math.max(1, zone.inflow));
}