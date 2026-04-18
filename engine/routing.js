/**
 * Routing Engine
 * Identifies the path of least resistance for crowd redirection.
 */
function getBestZone() {
    // Find zone with lowest combined score of density and queue
    let sorted = Object.values(zones).sort((a, b) => {
        let scoreA = a.density + (a.queue * 2);
        let scoreB = b.density + (b.queue * 2);
        return scoreA - scoreB;
    });
    return sorted[0];
}