        // Card design selection
        const cardDesignInputs = document.querySelectorAll('input[name="cardDesign"]');
        const previewImage = document.getElementById('previewImage');
        const cardDesigns = document.querySelectorAll('.card-design');

        cardDesignInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Update preview image
                previewImage.src = this.value;
                
                // Update active class
                cardDesigns.forEach(design => {
                    design.classList.remove('active');
                });
                this.parentElement.classList.add('active');
                
                updateProgress();
            });
        });

        // Category dropdown functionality
        const dropdownToggle = document.getElementById('dropdownToggle');
        const categoriesMenu = document.getElementById('categoriesMenu');
        const selectedCategories = document.getElementById('selectedCategories');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const selectedCategoriesArray = [];
        const MAX_CATEGORIES = 4;

        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            categoriesMenu.classList.toggle('show');
            dropdownToggle.querySelector('svg').classList.toggle('rotate-180');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown-container')) {
                categoriesMenu.classList.remove('show');
                dropdownToggle.querySelector('svg').classList.remove('rotate-180');
            }
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const categoryValue = this.getAttribute('data-value');
                
                // Check if already selected
                if (this.classList.contains('selected')) {
                    // Remove from selected
                    this.classList.remove('selected');
                    const index = selectedCategoriesArray.indexOf(categoryValue);
                    if (index !== -1) {
                        selectedCategoriesArray.splice(index, 1);
                    }
                } else {
                    // Add to selected if less than max
                    if (selectedCategoriesArray.length < MAX_CATEGORIES) {
                        this.classList.add('selected');
                        selectedCategoriesArray.push(categoryValue);
                    } else {
                        alert(`Вы можете выбрать максимум ${MAX_CATEGORIES} категории`);
                        return;
                    }
                }
                
                // Update selected categories display
                updateSelectedCategories();
                updateProgress();
            });
        });

        function updateSelectedCategories() {
            selectedCategories.innerHTML = '';
            selectedCategoriesArray.forEach(category => {
                const span = document.createElement('span');
                span.className = 'selected-option';
                span.innerHTML = `${category} <span class="remove-option" data-value="${category}">×</span>`;
                selectedCategories.appendChild(span);
            });

            // Add click event to remove buttons
            document.querySelectorAll('.remove-option').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const categoryToRemove = this.getAttribute('data-value');
                    const index = selectedCategoriesArray.indexOf(categoryToRemove);
                    if (index !== -1) {
                        selectedCategoriesArray.splice(index, 1);
                    }
                    // Remove selected class from dropdown item
                    document.querySelector(`.dropdown-item[data-value="${categoryToRemove}"]`).classList.remove('selected');
                    updateSelectedCategories();
                    updateProgress();
                });
            });
        }

        // Citizenship radio buttons
        const citizenYes = document.getElementById('citizenYes');
        const citizenNo = document.getElementById('citizenNo');
        
        citizenYes.addEventListener('click', function() {
            this.classList.add('selected');
            citizenNo.classList.remove('selected');
            this.querySelector('input').checked = true;
            updateProgress();
        });
        
        citizenNo.addEventListener('click', function() {
            this.classList.add('selected');
            citizenYes.classList.remove('selected');
            this.querySelector('input').checked = true;
            updateProgress();
        });

        // Form validation and progress
        const cardForm = document.getElementById('cardForm');
        const fullName = document.getElementById('fullName');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const birthdate = document.getElementById('birthdate');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressPercentage = document.getElementById('progressPercentage');

        // Input event listeners
        [fullName, phone, email, birthdate].forEach(input => {
            input.addEventListener('input', updateProgress);
        });

        // Phone mask
        phone.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + (x[3] ? x[3] + '-' : '') + (x[4] ? x[4] + '-' : '') + x[5];
        });

        // Form submission
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!fullName.value) {
                alert('Пожалуйста, укажите ФИО');
                fullName.focus();
                return;
            }
            
            if (!phone.value || phone.value.replace(/\D/g, '').length < 11) {
                alert('Пожалуйста, укажите корректный номер телефона');
                phone.focus();
                return;
            }

            if (email.value && !isValidEmail(email.value)) {
                alert('Пожалуйста, укажите корректный email');
                email.focus();
                return;
            }

            if (!birthdate.value) {
                alert('Пожалуйста, укажите дату рождения');
                birthdate.focus();
                return;
            }

            // If all validation passes, you would typically submit the form to the server
            alert('Форма отправлена успешно!');
        });

        // Email validation
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Update progress function
        function updateProgress() {
            let progress = 5; // Starting with 5%
            
            // Card design selected (10%)
            if (document.querySelector('input[name="cardDesign"]:checked')) {
                progress += 10;
            }
            
            // Categories selected (up to 20%)
            progress += selectedCategoriesArray.length * 5;
            
            // Full name (20%)
            if (fullName.value.trim() !== '') {
                progress += 20;
            }
            
            // Phone (15%)
            if (phone.value && phone.value.replace(/\D/g, '').length >= 11) {
                progress += 15;
            }
            
            // Email (optional - 10%)
            if (email.value && isValidEmail(email.value)) {
                progress += 10;
            }
            
            // Birthdate (15%)
            if (birthdate.value) {
                progress += 15;
            }
            
            // Citizenship already selected by default (5%)
            progress += 5;
            
            // Set progress (cap at 100%)
            progress = Math.min(progress, 100);
            progressBarFill.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
        }

        // Initial progress update
        updateProgress();