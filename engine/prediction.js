// In production: crowd density would be extracted using Google Vision API from CCTV feeds

function isCongested(zone) {
    let predictiveScore = (zone.density * 0.6) + (zone.inflow * 1.5) + (zone.queue * 0.4);
    return predictiveScore > 65;
}

function predictTimeInQueue(zone) {
    if (zone.queue <= 0) return 0;
    return Math.round((zone.queue * 1.5) / Math.max(1, zone.inflow));
}

function predictCongestionTime(zone) {
    // Higher inflow + queue = faster congestion
    let urgency = zone.inflow + (zone.queue / 5);

    if (urgency > 20) return "1-2 minutes";
    if (urgency > 12) return "3-5 minutes";
    if (urgency > 6) return "5-8 minutes";

    return "low risk";
}