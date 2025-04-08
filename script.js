const ctx = document.getElementById('myPieChart');

    const data = {
      labels: ['Люди которые выбрали другой Банк', 'Люди которые выбрали наш Банк', 'Люди которые не пользуются инвестициями'],
      datasets: [{
        label: 'Категории',
        data: [35, 45, 20],
        backgroundColor: [
          'rgb(255, 99, 132)',   // красный
          'rgb(75, 192, 192)',   // зеленовато-синий
          'rgb(255, 205, 86)'    // желтый
        ],
        hoverOffset: 20
      }]
    };

    const config = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#333',
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Проценты выбора нашего инвистиционого счета',
            font: {
              size: 18
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      },
    };

    new Chart(ctx, config);