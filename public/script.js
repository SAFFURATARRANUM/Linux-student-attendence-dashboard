let myChart = null;

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData() {
    try {
        // THIS is the fetch line that talks to the Bash script
        const response = await fetch('/cgi-bin/attendance.sh');
        
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        updateDashboard(data);
        
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Is the Python CGI server running?");
    }
}

function updateDashboard(data) {
    // 1. Update the cards dynamically
    document.getElementById('kpi-total').innerText = data.summary.totalStudents;
    document.getElementById('kpi-avg').innerText = data.summary.averageAttendance.toFixed(1) + '%';
    document.getElementById('kpi-eligible').innerText = data.summary.eligibleCount;
    document.getElementById('kpi-below').innerText = data.summary.shortageCount;

    // 2. Update the table dynamically
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; 
    
    data.students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.percentage}</td>
            <td>${student.status}</td>
        `;
        tbody.appendChild(row);
    });

    // 3. Update the chart
    updateChart(data.summary.eligibleCount, data.summary.shortageCount);
    
    // 4. Update timestamp
    const now = new Date();
    document.querySelector('.timestamp').innerText = `Last refreshed: ${now.toLocaleTimeString()}`;
}

function updateChart(eligible, below) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Eligible', 'Below 75%'],
            datasets: [{
                data: [eligible, below], // Now it uses the dynamic data!
                backgroundColor: ['#82b1db', '#e8a4a4'], 
                borderWidth: 0,
                cutout: '60%' 
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}