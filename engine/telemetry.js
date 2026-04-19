let densityChart;
const chartData = {
    labels: Array(20).fill(''),
    datasets: [{
        label: 'Global Density (%)',
        data: Array(20).fill(25), // Pre-fill with baseline system density
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
    }]
};

function initTelemetry() {
    const ctx = document.getElementById('densityChart').getContext('2d');
    
    // Set default font globally to match FlowSync UI
    Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
    Chart.defaults.color = "#94a3b8";

    densityChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    display: true,
                    grid: { display: false, drawBorder: false },
                    ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 5 }
                },
                y: { 
                    min: 0, 
                    max: 100, 
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: {
                        callback: function(value) { return value + '%' }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            animation: { duration: 400 }
        }
    });
}

function updateTelemetry(globalDensity) {
    if (!densityChart) return;
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    
    chartData.labels.push(time);
    chartData.datasets[0].data.push(globalDensity);
    
    // Dynamic coloring based on surge severity
    if (globalDensity > 75) {
        chartData.datasets[0].borderColor = '#ef4444'; // Red (Surge)
        chartData.datasets[0].backgroundColor = 'rgba(239, 68, 68, 0.2)';
    } else if (globalDensity > 50) {
        chartData.datasets[0].borderColor = '#f59e0b'; // Yellow (Warning)
        chartData.datasets[0].backgroundColor = 'rgba(245, 158, 11, 0.2)';
    } else {
        chartData.datasets[0].borderColor = '#10b981'; // Green (Optimal)
        chartData.datasets[0].backgroundColor = 'rgba(16, 185, 129, 0.2)';
    }

    if (chartData.labels.length > 20) {
        chartData.labels.shift();
        chartData.datasets[0].data.shift();
    }
    
    // Update without full animation for smoother scrolling
    densityChart.update('none'); 
}
