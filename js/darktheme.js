document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-theme');
        document.body.classList.toggle('dark-theme');
        themeToggle.classList.toggle('light');
        
        // Опционально: сохраняем выбор пользователя в localStorage
        if(document.documentElement.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Проверяем сохраненную тему при загрузке страницы
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
        themeToggle.classList.remove('light');
    }
});