document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the canvas element
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // 2. Draw the Chart with the numbers from your table (6 Eligible, 4 Below)
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Eligible', 'Below 75%'],
            datasets: [{
                data: [6, 4], // 6 Eligible, 4 Below
                backgroundColor: ['#82b1db', '#e8a4a4'], // Blue and Pink matching the paper
                borderWidth: 0,
                cutout: '60%' 
            }]
        },
        options: {
            responsive: true,
            plugins: { 
                legend: { position: 'bottom' } 
            }
        }
    });
});