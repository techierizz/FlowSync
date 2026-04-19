"use strict";

function updateZones() {
    for (let key in zones) {
        let z = zones[key];

        let variance = (Math.random() * 8 - 4);

        let egress = z.density * 0.06;

        let newDensity = z.density + variance + (z.inflow * 0.5) - egress;
        z.density = Math.max(0, Math.min(100, newDensity));

        z.inflow = Math.max(0, Math.min(25, z.inflow + (Math.random() * 4 - 2)));

        z.queue = Math.max(0, Math.round((z.density - 40) * 0.5 + z.inflow));
    }
}