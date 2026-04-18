function updateZones() {
    for (let key in zones) {
        let z = zones[key];
        z.density = Math.max(0, Math.min(100, z.density + (Math.random() * 10 - 5)));
        z.inflow = Math.random() * 10;
    }
}