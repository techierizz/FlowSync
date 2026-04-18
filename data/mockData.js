/**
 * Mock Data Store
 * In a production Google Cloud environment, this would sync via Firebase Realtime Database.
 */
let zones = {
    gateA: { name: "North Gate A", density: 30, queue: 10, inflow: 5, x: 20, y: 50 },
    gateB: { name: "South Gate B", density: 20, queue: 5, inflow: 3, x: 80, y: 50 },
    food: { name: "Main Concourse", density: 40, queue: 20, inflow: 6, x: 50, y: 20 },
    washroom: { name: "Restrooms East", density: 25, queue: 15, inflow: 4, x: 50, y: 80 },
    merch: { name: "Fan Store", density: 15, queue: 5, inflow: 2, x: 35, y: 35 },
    vip: { name: "VIP Lounge", density: 10, queue: 0, inflow: 1, x: 65, y: 35 }
};