document.addEventListener('DOMContentLoaded', function() {
    // Выбор дизайна карты
    const cardOptions = document.querySelectorAll('.card-option');
    const cardRadios = document.querySelectorAll('.card-radio');
    const previewImage = document.getElementById('preview-image');
    
    cardOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Удалить выбранный класс из всех вариантов
            cardOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Добавить выбранный класс к выбранной опции
            this.classList.add('selected');
            
            // Найдите и проверьте переключатель.
            const radio = this.querySelector('.card-radio');
            radio.checked = true;
            
            // Обновить изображение предварительного просмотра
            const cardImage = this.querySelector('.card-image');
            previewImage.src = cardImage.src;
        });
    });
    
    // Функциональность ползунка кредитного лимита
    const sliderContainer = document.getElementById('slider-container');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderFill = document.getElementById('slider-fill');
    const limitDisplay = document.getElementById('limit-display');
    const infoAmountDisplay = document.getElementById('info-amount-display');
    
    // Минимальные и максимальные значения
    const minValue = 15000;
    const maxValue = 1000000;
    let currentValue = 70000;
    
    // Инициализировать положение ползунка
    updateSliderPosition();
    
    // Функция перетаскивания слайдера
    let isDragging = false;
    
    sliderHandle.addEventListener('mousedown', startDrag);
    sliderHandle.addEventListener('touchstart', startDrag, { passive: false });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    // Функциональность щелчка слайдера
    sliderContainer.addEventListener('click', function(e) {
        if (e.target !== sliderHandle) {
            const rect = sliderContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            
            currentValue = Math.round((percentage * (maxValue - minValue)) + minValue);
            updateSliderPosition();
        }
    });
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const rect = sliderContainer.getBoundingClientRect();
        
        // Получите clientX для событий мыши и касания
        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        // Рассчитать положение x в пределах границ контейнера
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        // Рассчитать процент и значение
        const percentage = x / rect.width;
        currentValue = Math.round((percentage * (maxValue - minValue)) + minValue);
        
        updateSliderPosition();
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    function updateSliderPosition() {
        // Убедитесь, что ценность находится в пределах границ
        if (currentValue < minValue) currentValue = minValue;
        if (currentValue > maxValue) currentValue = maxValue;
        
        // Рассчитать процент для визуального представления
        const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
        
        // Обновить ползунок и заполнить позицию
        sliderHandle.style.left = `${percentage}%`;
        sliderFill.style.width = `${percentage}%`;
        
        // Форматировать и отображать значениеe
        const formattedValue = formatCurrency(currentValue);
        limitDisplay.textContent = formattedValue;
        infoAmountDisplay.textContent = formattedValue;
        
        // Обновить атрибуты арии
        sliderContainer.setAttribute('aria-valuenow', currentValue);
    }
    
    function formatCurrency(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
    }
    
    // Функциональность раскрывающегося списка
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownLabel = document.getElementById('dropdown-label');
    const purposeInput = document.getElementById('purpose-input');
    
    // Переключить раскрывающийся список
    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('active');
        const isExpanded = dropdownMenu.classList.contains('active');
        dropdownButton.setAttribute('aria-expanded', isExpanded);
    });
    
    // Закройте раскрывающийся список при щелчке за пределами
    document.addEventListener('click', function(e) {
        if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            dropdownButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Выберите элемент раскрывающегося списка
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            dropdownLabel.textContent = value;
            purposeInput.value = value;
            dropdownMenu.classList.remove('active');
            dropdownButton.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Форматирование ввода телефона
    const phoneInput = document.getElementById('phone-input');
    
    phoneInput.addEventListener('input', function(e) {
        let input = e.target.value.replace(/\D/g, '');
        if (input.length > 0) {
            if (input[0] === '7') {
                input = input;
            } else if (input[0] === '8') {
                input = '7' + input.substring(1);
            } else {
                input = '7' + input;
            }
            
            let formatted = '';
            if (input.length > 0) formatted += '+' + input[0];
            if (input.length > 1) formatted += ' (' + input.substring(1, 4);
            if (input.length > 4) formatted += ') ' + input.substring(4, 7);
            if (input.length > 7) formatted += '-' + input.substring(7, 9);
            if (input.length > 9) formatted += '-' + input.substring(9, 11);
            
            e.target.value = formatted;
        }
    });
    
    // Отправка формы
    const form = document.getElementById('form-section');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Базовая проверка
        if (!purposeInput.value) {
            alert('Пожалуйста, выберите цель использования карты');
            return;
        }
        
        if (!phoneInput.value) {
            alert('Пожалуйста, введите номер телефона');
            return;
        }
        
        // Форма сбора данных для отправки
        const selectedCard = document.querySelector('.card-radio:checked').value;
        
        const formData = {
            cardDesign: selectedCard,
            creditLimit: currentValue,
            purpose: purposeInput.value,
            phoneNumber: phoneInput.value
        };
        
        console.log('Form submitted with data:', formData);
        alert('Форма успешно отправлена!');
    });
});
