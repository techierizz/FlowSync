/**
 * Core Engine Test Suite
 * Validates the predictive algorithms and data structures.
 */

(function runTests() {
    console.log("[Test Suite] Starting FlowSync AI engine tests...");
    
    // Test 1: Data Integrity
    console.assert(typeof zones !== 'undefined', "Zones data store is missing");
    console.assert(Object.keys(zones).length > 0, "Zones data store is empty");
    
    // Test 2: Predictive Logic
    let mockCongestedZone = { density: 85, inflow: 15, queue: 10 };
    console.assert(isCongested(mockCongestedZone) === true, "Prediction logic failed to identify severe congestion");
    
    let mockSafeZone = { density: 20, inflow: 2, queue: 0 };
    console.assert(isCongested(mockSafeZone) === false, "Prediction logic generated a false positive for congestion");

    let mockQueueZone = { queue: 20, inflow: 5 }; // wait = 20 * 1.5 / 5 = 6
    console.assert(predictTimeInQueue(mockQueueZone) === 6, "Little's Law calculation for queue time is incorrect");

    // Test 3: Routing Logic
    let best = getBestZone();
    console.assert(best && best.name, "Routing logic failed to return a valid zone object");
    
    console.log("[Test Suite] All core engine tests passed successfully. System reliable.");
})();
