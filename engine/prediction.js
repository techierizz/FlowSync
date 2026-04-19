// In production: crowd density would be extracted using Google Vision API from CCTV feeds

function isCongested(zone) {
    let predictiveScore = (zone.density * 0.6) + (zone.inflow * 1.5) + (zone.queue * 0.4);
    return predictiveScore > 65;
}

function predictTimeInQueue(zone) {
    if (zone.queue <= 0) return 0;
    return Math.round((zone.queue * 1.5) / Math.max(1, zone.inflow));
}