/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: [], // Meses (X-axis)
    datasets: [
      {
        label: 'Reservaciones por Mes',
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [], // Contador de reservaciones por mes
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Mes',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Reservaciones',
        },
        ticks: {
          beginAtZero: true, // Asegura que el eje Y comience en 0
          stepSize: 1, // Establece que los ticks en el eje Y sean enteros
          precision: 0, // Elimina los decimales
        },
      },
    },
  },
};

// Cambiar al id de tu elemento de gráfico en HTML
const lineCtx = document.getElementById('line');
window.myLine = new Chart(lineCtx, lineConfig);

// Función para procesar el JSON y agrupar por mes
countReservationsByMonth = (data) => {
  // Inicializamos un objeto para contar las reservaciones por mes
  const monthCounts = {};

  Object.values(data).forEach(record => {
    const reservationDate = record.date; // 'YYYY-MM-DD'
    console.log(reservationDate)
    if (!reservationDate) return;

    // Extraemos el año y el mes de la fecha
    const [year, month] = reservationDate.split('-'); // 'YYYY-MM-DD' -> ['YYYY', 'MM']
    const yearMonth = `${year}-${month}`; // Formato 'YYYY-MM' para representar cada mes

    // Incrementamos el contador correspondiente para el mes
    if (monthCounts[yearMonth]) {
      monthCounts[yearMonth]++;
    } else {
      monthCounts[yearMonth] = 1;
    }
    console.log(monthCounts)
  });

  // Preparamos las etiquetas para el eje X (meses) y los conteos de reservaciones
  const labels = Object.keys(monthCounts).sort(); // Ordenar por año y mes
  const counts = labels.map(month => monthCounts[month]);

  return { labels, counts };
};

// Función para actualizar el gráfico con los datos procesados
updateChart = () => {
  fetch('/api/v1/landing') // Asegúrate de que este endpoint esté retornando los datos correctamente
    .then(response => response.json())
    .then(data => {
      const { labels, counts } = countReservationsByMonth(data);

      // Actualizamos los labels y los datos del gráfico
      window.myLine.data.labels = labels;
      window.myLine.data.datasets[0].data = counts;

      // Actualizamos el gráfico
      window.myLine.update();
    })
    .catch(error => console.error('Error:', error));
};

// Llamar a la función para actualizar el gráfico
updateChart();
