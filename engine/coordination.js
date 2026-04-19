function getActions() {
    let actions = [];

    let totalZones = Object.keys(zones).length;
    let globalDensity = Object.values(zones).reduce((acc, z) => acc + z.density, 0) / totalZones;

    if (globalDensity > 75) {
        actions.push({
            type: 'CRITICAL',
            msg: `Venue at critical capacity (${Math.round(globalDensity)}%). Deploying overflow protocols immediately.`,
            actionType: 'OVERFLOW'
        });
    } else if (globalDensity > 55) {
        actions.push({ type: 'ALERT', msg: `Elevated global venue traffic detected.`, actionType: 'NONE' });
    }

    for (let key in zones) {
        let z = zones[key];

        if (isCongested(z)) {
            let alt = getBestZone('speed');
            let altKey = Object.keys(zones).find(k => zones[k].name === alt.name);

            if (alt.name !== z.name) {
                let time = predictCongestionTime(z);
                actions.push({
                    type: 'ALERT',
                    msg: `Reroute traffic from ${z.name} to ${alt.name}. (density: ${Math.round(z.density)}%, congestion expected in ${time})`,
                    actionType: 'REROUTE',
                    source: key,
                    target: altKey
                });
            }
        } else if (z.queue > 15) {
            let waitTime = predictTimeInQueue(z);
            let time = predictCongestionTime(z);
            actions.push({
                type: 'WARN',
                msg: `Deploy staff to ${z.name}. Est. wait: ~${waitTime}m. (Congestion likely in ${time})`,
                actionType: 'STAFF',
                target: key
            });
        }
    }

    if (actions.length === 0) {
        actions.push({ type: 'INFO', msg: `All venue zones operating optimally. No actions required.`, actionType: 'NONE' });
    }

    return actions;
}

function applyFeedbackLoop(actions) {
    actions.forEach(action => {
        if (action.actionType === 'REROUTE' && action.source && action.target) {
            zones[action.source].density = Math.max(0, zones[action.source].density - 3.0);
            zones[action.source].inflow = Math.max(0, zones[action.source].inflow - 1.5);
            zones[action.target].density = Math.min(100, zones[action.target].density + 1.2);
            zones[action.target].inflow += 0.5;
        } else if (action.actionType === 'STAFF' && action.target) {
            zones[action.target].queue = Math.max(0, zones[action.target].queue - 5);
            zones[action.target].density = Math.max(0, zones[action.target].density - 1.5);
            zones[action.target].inflow = Math.max(0, zones[action.target].inflow - 1.0);
        } else if (action.actionType === 'OVERFLOW') {
            for (let k in zones) {
                zones[k].inflow = Math.max(0, zones[k].inflow - 3);
                zones[k].density = Math.max(0, zones[k].density - 1.5);
            }
        }
    });
}