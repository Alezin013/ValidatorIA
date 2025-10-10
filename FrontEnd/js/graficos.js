const ctx = document.getElementById('grafico-pizza');

const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [{
      label: '# of Votes',
      data: [30, 19, 3, 5],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

window.lineChart = lineChart;