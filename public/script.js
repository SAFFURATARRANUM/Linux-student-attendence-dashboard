let myChart = null;
let currentData = [
    { id: "101", name: "Ravi", percentage: "90%", status: "Eligible" },
    { id: "102", name: "Meena", percentage: "65%", status: "Below 75%" },
    { id: "103", name: "Arjun", percentage: "75%", status: "Eligible" },
    { id: "104", name: "Sita", percentage: "50%", status: "Below 75%" },
    { id: "105", name: "Kiran", percentage: "82%", status: "Eligible" },
    { id: "106", name: "Priya", percentage: "96%", status: "Eligible" },
    { id: "107", name: "Anil", percentage: "70%", status: "Below 75%" },
    { id: "108", name: "Divya", percentage: "88%", status: "Eligible" },
    { id: "109", name: "Manoj", percentage: "45%", status: "Below 75%" },
    { id: "110", name: "Neha", percentage: "79%", status: "Eligible" },
    { id: "112", name: "Sarah", percentage: "85%", status: "Eligible"},
];

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard(currentData);
});

// This makes the button work!
function loadCSVData() {
    // For the demo, we just add Deepak to simulate a refresh
    const deepak = { id: "111", name: "Deepak", percentage: "98%", status: "Eligible" };
    
    // Check if Deepak is already there
    if (!currentData.find(s => s.id === "111")) {
        currentData.push(deepak);
    }
    
    updateDashboard(currentData);
}

function updateDashboard(data) {
    // 1. Calculate numbers dynamically
    let eligible = 0;
    let below = 0;
    let totalPct = 0;

    data.forEach(s => {
        if (s.status === "Eligible") eligible++;
        else below++;
        totalPct += parseFloat(s.percentage);
    });

    const avg = (totalPct / data.length).toFixed(1);

    // 2. Update the cards
    document.getElementById('kpi-total').innerText = data.length;
    document.getElementById('kpi-avg').innerText = avg + '%';
    document.getElementById('kpi-eligible').innerText = eligible;
    document.getElementById('kpi-below').innerText = below;

    // 3. Update the table
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; 
    
    data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.percentage}</td>
            <td>${student.status}</td>
        `;
        tbody.appendChild(row);
    });

    // 4. Draw the chart
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Eligible', 'Below 75%'],
            datasets: [{
                data: [eligible, below],
                backgroundColor: ['#82b1db', '#e8a4a4'], 
                borderWidth: 0,
                cutout: '60%' 
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    
    // 5. Update timestamp
    const now = new Date();
    document.querySelector('.timestamp').innerText = `Last refreshed: ${now.toLocaleTimeString()}`;
}