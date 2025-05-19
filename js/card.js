        // Выбор дизайна карты
        const cardDesignInputs = document.querySelectorAll('input[name="cardDesign"]');
        const previewImage = document.getElementById('previewImage');
        const cardDesigns = document.querySelectorAll('.card-design');

        cardDesignInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Обновить изображение предварительного просмотра
                previewImage.src = this.value;
                
                // Обновить активный класс
                cardDesigns.forEach(design => {
                    design.classList.remove('active');
                });
                this.parentElement.classList.add('active');
                
                updateProgress();
            });
        });

        // Функциональность раскрывающегося списка категорий
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

        // Закройте раскрывающийся список при щелчке за пределами
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown-container')) {
                categoriesMenu.classList.remove('show');
                dropdownToggle.querySelector('svg').classList.remove('rotate-180');
            }
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const categoryValue = this.getAttribute('data-value');
                
                // Проверьте, выбрано ли оно уже
                if (this.classList.contains('selected')) {
                    // Удалить из выбранных
                    this.classList.remove('selected');
                    const index = selectedCategoriesArray.indexOf(categoryValue);
                    if (index !== -1) {
                        selectedCategoriesArray.splice(index, 1);
                    }
                } else {
                    // Добавить к выбранным, если меньше макс.
                    if (selectedCategoriesArray.length < MAX_CATEGORIES) {
                        this.classList.add('selected');
                        selectedCategoriesArray.push(categoryValue);
                    } else {
                        alert(`Вы можете выбрать максимум ${MAX_CATEGORIES} категории`);
                        return;
                    }
                }
                
                // Обновить отображение выбранных категорий
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

            // Добавить событие нажатия для удаления кнопок
            document.querySelectorAll('.remove-option').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const categoryToRemove = this.getAttribute('data-value');
                    const index = selectedCategoriesArray.indexOf(categoryToRemove);
                    if (index !== -1) {
                        selectedCategoriesArray.splice(index, 1);
                    }
                    // Удалить выбранный класс из раскрывающегося списка
                    document.querySelector(`.dropdown-item[data-value="${categoryToRemove}"]`).classList.remove('selected');
                    updateSelectedCategories();
                    updateProgress();
                });
            });
        }

        // Радиокнопки гражданства
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

        // Проверка формы и прогресс
        const cardForm = document.getElementById('cardForm');
        const fullName = document.getElementById('fullName');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const birthdate = document.getElementById('birthdate');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressPercentage = document.getElementById('progressPercentage');

        // Слушатели входных событий
        [fullName, phone, email, birthdate].forEach(input => {
            input.addEventListener('input', updateProgress);
        });

        // Маска телефона
        phone.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + (x[3] ? x[3] + '-' : '') + (x[4] ? x[4] + '-' : '') + x[5];
        });

        // Отправка формы
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Базовая проверка
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

            // Если все проверки пройдены, вы обычно отправляете форму на сервер.
            alert('Форма отправлена успешно!');
        });

        // Проверка электронной почты
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Обновление функции прогресса
        function updateProgress() {
            let progress = 5; // Начиная с 5%
            
            // Выбран дизайн карты (10%)
            if (document.querySelector('input[name="cardDesign"]:checked')) {
                progress += 10;
            }
            
            // Выбранные категории (до 20%) 
            progress += selectedCategoriesArray.length * 5;
            
            // Полное имя (20%)
            if (fullName.value.trim() !== '') {
                progress += 20;
            }
            
            // Телефон (15%)
            if (phone.value && phone.value.replace(/\D/g, '').length >= 11) {
                progress += 15;
            }
            
            // Электронная почта (необязательно - 10%)
            if (email.value && isValidEmail(email.value)) {
                progress += 10;
            }
            
            // Дата рождения (15%)
            if (birthdate.value) {
                progress += 15;
            }
            
            // Гражданство уже выбрано по умолчанию (5%)
            progress += 5;
            
            // Установить прогресс (ограничение 100%)
            progress = Math.min(progress, 100);
            progressBarFill.style.width = `${progress}%`;
            progressPercentage.textContent = `${progress}%`;
        }

        // Первоначальное обновление прогресса
        updateProgress();
