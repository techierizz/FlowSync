/**
 * Crowd Engine
 * Simulates physical movement and queue buildup using exponential moving averages.
 */
function updateZones() {
    for (let key in zones) {
        let z = zones[key];
        
        // Natural crowd variance (stochastic factor)
        let variance = (Math.random() * 8 - 4);
        
        // EMA formulation for density based on current state + inflow
        let newDensity = z.density + variance + (z.inflow * 0.4);
        z.density = Math.max(0, Math.min(100, newDensity));
        
        // Update inflow realistically (brownian walk)
        z.inflow = Math.max(0, Math.min(25, z.inflow + (Math.random() * 4 - 2)));
        
        // Queue size correlates directly with density surpassing optimal threshold
        z.queue = Math.max(0, Math.round((z.density - 40) * 0.5 + z.inflow));
    }
}