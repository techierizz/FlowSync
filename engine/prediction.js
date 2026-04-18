function isCongested(zone) {
    return zone.density * 0.6 + zone.inflow * 0.4 > 60;
}