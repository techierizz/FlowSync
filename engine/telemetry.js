let densityChart;
const chartData = {
    labels: Array(20).fill(''),
    datasets: [
        {
            label: 'Global Density (%)',
            data: Array(20).fill(25),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)', // Overridden by gradient in init
            borderWidth: 3,
            fill: true,
            tension: 0.5, // Smoother bezier curves
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 15
        },
        {
            label: 'Warning Threshold',
            data: Array(20).fill(45),
            borderColor: 'rgba(245, 158, 11, 0.5)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0
        },
        {
            label: 'Critical Threshold',
            data: Array(20).fill(75),
            borderColor: 'rgba(239, 68, 68, 0.5)',
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHitRadius: 0
        }
    ]
};

function initTelemetry() {
    const ctx = document.getElementById('densityChart').getContext('2d');

    Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
    Chart.defaults.color = "#94a3b8";

    // Setup initial sleek gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    chartData.datasets[0].backgroundColor = gradient;

    densityChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 7 }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                    ticks: {
                        callback: function (value) { return value + '%' }
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

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    chartData.labels.push(time);
    chartData.datasets[0].data.push(globalDensity);

    // Shift threshold lines so they scroll along with the chart continuously
    chartData.datasets[1].data.push(45);
    chartData.datasets[2].data.push(75);

    let colorHex = '#10b981';
    let gradientRGB = '16, 185, 129';

    if (globalDensity > 75) {
        colorHex = '#ef4444';
        gradientRGB = '239, 68, 68';
    } else if (globalDensity > 45) {
        colorHex = '#f59e0b';
        gradientRGB = '245, 158, 11';
    }

    const ctx = document.getElementById('densityChart').getContext('2d');
    let dynamicGradient = ctx.createLinearGradient(0, 0, 0, 300);
    dynamicGradient.addColorStop(0, `rgba(${gradientRGB}, 0.7)`);
    dynamicGradient.addColorStop(1, `rgba(${gradientRGB}, 0.0)`);

    chartData.datasets[0].borderColor = colorHex;
    chartData.datasets[0].backgroundColor = dynamicGradient;

    if (chartData.labels.length > 20) {
        chartData.labels.shift();
        chartData.datasets[0].data.shift();
        chartData.datasets[1].data.shift();
        chartData.datasets[2].data.shift();
    }

    densityChart.update('none');
}
