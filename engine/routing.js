function getBestZone() {
    let sorted = Object.values(zones).sort((a, b) => a.density - b.density);
    return sorted[0];
}