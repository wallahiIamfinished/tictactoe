window.addEventListener('DOMContentLoaded', (event) => {
    const navItems = document.querySelectorAll('#navbar li a');

    navItems.forEach((navItem) => {
        navItem.addEventListener('click', (event) => {
            navItems.forEach((item) => {
                if (item === event.target) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    });
});
