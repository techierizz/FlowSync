function getActions() {
    let actions = [];

    for (let key in zones) {
        let z = zones[key];

        if (z.density > 70) {
            actions.push(`Open alternate for ${z.name}`);
        }

        if (z.queue > 25) {
            actions.push(`Reduce queue at ${z.name}`);
        }
    }

    return actions;
}