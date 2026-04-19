"use strict";

function getBestZone(persona = 'speed') {
    let safeZones = Object.values(zones).filter(z => !isCongested(z));

    let candidateZones = safeZones.length > 0 ? safeZones : Object.values(zones);

    let sorted = candidateZones.sort((a, b) => {
        let scoreA, scoreB;

        if (persona === 'speed') {
            scoreA = a.density + (a.queue * 2.5);
            scoreB = b.density + (b.queue * 2.5);
        } else if (persona === 'comfort') {
            scoreA = (a.density * 3) + a.queue;
            scoreB = (b.density * 3) + b.queue;
        } else if (persona === 'accessibility') {
            scoreA = (a.density * 2) - (a.accessibilityScore * 10);
            scoreB = (b.density * 2) - (b.accessibilityScore * 10);
        } else {
            scoreA = a.density + (a.queue * 2);
            scoreB = b.density + (b.queue * 2);
        }

        return scoreA - scoreB;
    });
    return sorted[0];
}