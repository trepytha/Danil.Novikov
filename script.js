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
    document.addEventListener('DOMContentLoaded', function() {
      // Находим все необходимые элементы
      const sliders = document.querySelectorAll('.calculator-container .slider');
      const initialAmountOutput = document.querySelector('.calculator-container .input-group:nth-child(1) .input-value');
      const monthlyDepositOutput = document.querySelector('.calculator-container .input-group:nth-child(2) .input-value');
      const investmentTermOutput = document.querySelector('.calculator-container .input-group:nth-child(3) .input-value');
      const portfolioSelector = document.getElementById('portfolio-selector');
      
      const chartLabel = document.querySelector('.calculator-container .chart-label');
      const totalAmount = document.querySelector('.calculator-container .total-amount');
      const profitAmount = document.querySelector('.calculator-container .profit');
      const contributionsAmount = document.querySelector('.calculator-container .stat-group:nth-child(2) .stat-value');
      
      // Создаем скрытые input range элементы для каждого слайдера
      sliders.forEach((slider, index) => {
          const input = document.createElement('input');
          input.type = 'range';
          input.style.position = 'absolute';
          input.style.top = '0';
          input.style.left = '0';
          input.style.width = '100%';
          input.style.height = '100%';
          input.style.opacity = '0';
          input.style.cursor = 'pointer';
          input.className = 'slider-input';
          
          // Устанавливаем разные параметры для каждого слайдера
          if (index === 0) { // Первоначальная сумма
              input.min = '10000';
              input.max = '1000000';
              input.step = '10000';
              input.value = '100000';
              input.id = 'initial-amount';
          } else if (index === 1) { // Пополнения в месяц
              input.min = '0';
              input.max = '100000';
              input.step = '1000';
              input.value = '10000';
              input.id = 'monthly-deposit';
          } else if (index === 2) { // Срок инвестирования
              input.min = '1';
              input.max = '30';
              input.step = '1';
              input.value = '15';
              input.id = 'investment-term';
          }
          
          // Добавляем обработчик события input
          input.addEventListener('input', function() {
              updateSliderVisual(this);
              updateCalculation();
          });
          
          // Добавляем input в слайдер
          slider.appendChild(input);
          
          // Инициализируем визуальное состояние слайдера
          const sliderLine = slider.querySelector('.slider-line');
          if (!sliderLine) {
              const newSliderLine = document.createElement('div');
              newSliderLine.className = 'slider-line';
              slider.appendChild(newSliderLine);
          }
          
          const sliderDot = slider.querySelector('.slider-dot');
          if (sliderDot) {
              sliderDot.style.position = 'absolute';
              sliderDot.style.top = '50%';
              sliderDot.style.transform = 'translateY(-50%)';
              sliderDot.style.width = '12px';
              sliderDot.style.height = '12px';
              sliderDot.style.borderRadius = '50%';
              sliderDot.style.backgroundColor = '#73B077';
              sliderDot.style.zIndex = '2';
          }
          
          updateSliderVisual(input);
      });
      
      // Добавляем обработчик для селектора портфеля
      if (portfolioSelector) {
          portfolioSelector.addEventListener('change', updateCalculation);
      }
      
      // Функция обновления визуального состояния слайдера
      function updateSliderVisual(input) {
          const percent = ((input.value - input.min) / (input.max - input.min)) * 100;
          const slider = input.closest('.slider');
          const sliderDot = slider.querySelector('.slider-dot');
          
          if (sliderDot) {
              sliderDot.style.left = `calc(${percent}% - 6px)`;
          }
          
          // Обновляем отображаемое значение
          let displayValue;
          if (input.id === 'initial-amount') {
              displayValue = formatNumber(input.value);
              initialAmountOutput.textContent = displayValue;
          } else if (input.id === 'monthly-deposit') {
              displayValue = formatNumber(input.value);
              monthlyDepositOutput.textContent = displayValue;
          } else if (input.id === 'investment-term') {
              displayValue = `${input.value} ${getYearForm(input.value)}`;
              investmentTermOutput.textContent = displayValue;
          }
      }
      
      // Функция форматирования числа (разделение тысяч пробелами)
      function formatNumber(number) {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      
      // Функция для правильного склонения слова "год"
      function getYearForm(years) {
          years = parseInt(years);
          if (years % 100 >= 11 && years % 100 <= 19) {
              return 'лет';
          }
          
          switch (years % 10) {
              case 1:
                  return 'год';
              case 2:
              case 3:
              case 4:
                  return 'года';
              default:
                  return 'лет';
          }
      }
      
      // Функция расчета инвестиций
      function calculateInvestment(initialAmount, monthlyDeposit, term, rate) {
          const monthlyRate = rate / 100 / 12;
          const months = term * 12;
          let total = initialAmount;
          let yearlyData = [initialAmount];
          
          for (let month = 1; month <= months; month++) {
              total = total * (1 + monthlyRate) + monthlyDeposit;
              if (month % 12 === 0) {
                  yearlyData.push(total);
              }
          }
          
          const contributions = initialAmount + (monthlyDeposit * months);
          const profit = total - contributions;
          
          return {
              total: Math.round(total),
              profit: Math.round(profit),
              contributions: Math.round(contributions),
              yearlyData: yearlyData
          };
      }
      
      // Функция обновления графика
      function updateChart(yearlyData, term) {
          const chartContainer = document.querySelector('.chart');
          if (!chartContainer) return;
          
          // Получаем максимальное значение для масштабирования
          const maxValue = Math.max(...yearlyData);
          
          // Создаем SVG для графика
          let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '528');
          svg.setAttribute('height', '296');
          svg.setAttribute('viewBox', '0 0 528 296');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('class', 'chart-svg');
          
          // Определяем параметры для столбцов графика
          const barWidth = 17.6;
          const barGap = 8.8;
          const initialX = 8.8;
          
          // Рисуем столбцы для каждого года (до 15 лет)
          const yearsToShow = Math.min(yearlyData.length, 15);
          
          for (let i = 0; i < yearsToShow; i++) {
              const value = yearlyData[i];
              const x = initialX + i * (barWidth + barGap);
              
              // Вычисляем пропорциональную высоту столбца
              const fullHeight = 278;  // 296 - 18 (отступ снизу)
              const barHeight = (value / maxValue) * fullHeight;
              
              // Разделяем столбец на части
              const initialContribution = i === 0 ? yearlyData[0] : 0;
              const monthlyContributions = i > 0 ? document.getElementById('monthly-deposit').value * 12 * i : 0;
              const totalContributions = initialContribution + parseFloat(monthlyContributions);
              
              // Вычисляем высоты для каждой части
              const contributionRatio = Math.min(totalContributions / value, 1);
              const initialHeight = barHeight * contributionRatio / 2;
              const monthlyHeight = barHeight * contributionRatio / 2;
              const profitHeight = barHeight * (1 - contributionRatio);
              
              // Начальные позиции Y для каждой части
              const profitY = 296 - barHeight;
              const monthlyY = profitY + profitHeight;
              const initialY = monthlyY + monthlyHeight;
              
              // Создаем элементы для трех частей столбца
              // 1. Первоначальный вклад (нижняя часть столбца)
              const initialPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              initialPath.setAttribute('d', `M${x} 296V${initialY}H${x + barWidth}V296H${x}Z`);
              initialPath.setAttribute('fill', '#F8A34D');
              svg.appendChild(initialPath);
              
              // 2. Ежемесячные пополнения (средняя часть столбца)
              const monthlyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              monthlyPath.setAttribute('d', `M${x} ${initialY}V${monthlyY}H${x + barWidth}V${initialY}H${x}Z`);
              monthlyPath.setAttribute('fill', '#FFD450');
              svg.appendChild(monthlyPath);
              
              // 3. Прибыль (верхняя часть столбца с закруглением)
              const profitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              const pathData = `M${x} ${monthlyY}V${profitY + 2}C${x} ${profitY} ${x + barWidth/2} ${profitY - 2} ${x + barWidth/2} ${profitY - 2}C${x + barWidth/2} ${profitY - 2} ${x + barWidth} ${profitY} ${x + barWidth} ${profitY + 2}V${monthlyY}H${x}Z`;
              profitPath.setAttribute('d', pathData);
              profitPath.setAttribute('fill', '#73B077');
              svg.appendChild(profitPath);
          }
          
          // Удаляем предыдущий график, если он существует
          const oldSvg = chartContainer.querySelector('svg');
          if (oldSvg) {
              oldSvg.remove();
          }
          
          // Добавляем новый график
          chartContainer.insertBefore(svg, chartContainer.firstChild);
          
          // Обновляем маркеры на графике
          updateChartMarkers(term);
      }
      
      // Функция обновления маркеров на графике
      function updateChartMarkers(term) {
          const chartContainer = document.querySelector('.chart');
          let markersContainer = chartContainer.querySelector('.chart-markers');
          
          if (!markersContainer) {
              markersContainer = document.createElement('div');
              markersContainer.className = 'chart-markers';
              chartContainer.appendChild(markersContainer);
          } else {
              markersContainer.innerHTML = '';
          }
          
          // Создаем 5 маркеров
          const markerPositions = [1, Math.round(term * 0.25), Math.round(term * 0.5), Math.round(term * 0.75), term];
          
          markerPositions.forEach(position => {
              const marker = document.createElement('div');
              marker.className = 'marker';
              
              const markerLine = document.createElement('div');
              markerLine.className = 'marker-line';
              
              const markerLabel = document.createElement('div');
              markerLabel.className = 'marker-label';
              markerLabel.textContent = position === 1 ? '1 год' : `${position} ${getYearForm(position)}`;
              
              marker.appendChild(markerLine);
              marker.appendChild(markerLabel);
              markersContainer.appendChild(marker);
          });
      }
      
      // Функция обновления расчета и отображения
      function updateCalculation() {
          // Получаем текущие значения
          const initialAmount = parseFloat(document.getElementById('initial-amount').value);
          const monthlyDeposit = parseFloat(document.getElementById('monthly-deposit').value);
          const term = parseInt(document.getElementById('investment-term').value);
          
          // Получаем выбранную доходность из селектора
          let rate = 13.3; // Значение по умолчанию
          if (portfolioSelector && portfolioSelector.selectedIndex >= 0) {
              const selectedOption = portfolioSelector.options[portfolioSelector.selectedIndex];
              const optionText = selectedOption.textContent;
              const percentMatch = optionText.match(/\+(\d+[.,]?\d*)%/);
              if (percentMatch && percentMatch[1]) {
                  rate = parseFloat(percentMatch[1].replace(',', '.'));
              }
          }
          
          // Рассчитываем результат инвестиций
          const result = calculateInvestment(initialAmount, monthlyDeposit, term, rate);
          
          // Обновляем отображение результатов
          if (chartLabel) {
              chartLabel.innerHTML = `Всего через <span>${term} ${getYearForm(term)}</span>`;
          }
          
          if (totalAmount) {
              totalAmount.textContent = `${formatNumber(result.total)} ₸`;
          }
          
          if (profitAmount) {
              profitAmount.textContent = `${formatNumber(result.profit)} ₸`;
          }
          
          if (contributionsAmount) {
              contributionsAmount.textContent = `${formatNumber(result.contributions)} ₸`;
          }
          
          // Обновляем график
          updateChart(result.yearlyData, term);
      }
      
      // Инициализация калькулятора при загрузке страницы
      updateCalculation();
  });
  