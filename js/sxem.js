document.addEventListener('DOMContentLoaded', function() {
    // Card design selection
    const cardOptions = document.querySelectorAll('.card-option');
    const cardRadios = document.querySelectorAll('.card-radio');
    const previewImage = document.getElementById('preview-image');
    
    cardOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            cardOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Find and check the radio button
            const radio = this.querySelector('.card-radio');
            radio.checked = true;
            
            // Update preview image
            const cardImage = this.querySelector('.card-image');
            previewImage.src = cardImage.src;
        });
    });
    
    // Credit limit slider functionality
    const sliderContainer = document.getElementById('slider-container');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderFill = document.getElementById('slider-fill');
    const limitDisplay = document.getElementById('limit-display');
    const infoAmountDisplay = document.getElementById('info-amount-display');
    
    // Min and max values
    const minValue = 15000;
    const maxValue = 1000000;
    let currentValue = 70000;
    
    // Initialize slider position
    updateSliderPosition();
    
    // Slider drag functionality
    let isDragging = false;
    
    sliderHandle.addEventListener('mousedown', startDrag);
    sliderHandle.addEventListener('touchstart', startDrag, { passive: false });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    // Slider click functionality
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
        
        // Get clientX for both mouse and touch events
        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        // Calculate x position within the container bounds
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        // Calculate percentage and value
        const percentage = x / rect.width;
        currentValue = Math.round((percentage * (maxValue - minValue)) + minValue);
        
        updateSliderPosition();
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    function updateSliderPosition() {
        // Ensure value is within boundaries
        if (currentValue < minValue) currentValue = minValue;
        if (currentValue > maxValue) currentValue = maxValue;
        
        // Calculate percentage for visual representation
        const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
        
        // Update slider handle and fill position
        sliderHandle.style.left = `${percentage}%`;
        sliderFill.style.width = `${percentage}%`;
        
        // Format and display the value
        const formattedValue = formatCurrency(currentValue);
        limitDisplay.textContent = formattedValue;
        infoAmountDisplay.textContent = formattedValue;
        
        // Update aria attributes
        sliderContainer.setAttribute('aria-valuenow', currentValue);
    }
    
    function formatCurrency(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
    }
    
    // Dropdown functionality
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownLabel = document.getElementById('dropdown-label');
    const purposeInput = document.getElementById('purpose-input');
    
    // Toggle dropdown
    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('active');
        const isExpanded = dropdownMenu.classList.contains('active');
        dropdownButton.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            dropdownButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Select dropdown item
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
    
    // Phone input formatting
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
    
    // Form submission
    const form = document.getElementById('form-section');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        if (!purposeInput.value) {
            alert('Пожалуйста, выберите цель использования карты');
            return;
        }
        
        if (!phoneInput.value) {
            alert('Пожалуйста, введите номер телефона');
            return;
        }
        
        // Form data collection for submission
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