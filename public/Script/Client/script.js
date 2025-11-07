const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navbg = document.querySelector('.nav-bg');
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    navbg.classList.toggle('active');
});
const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,   // Default: Show 4 cards at once
    spaceBetween: 30,   // Space between the cards
    loop: true,         // Enable continuous loop
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 1,   // Show 1 card on smaller screens
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,   // Show 2 cards on medium screens
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,   // Show 4 cards on larger screens
            spaceBetween: 40,
        },
        1280: {
            slidesPerView: 4,   // Show 4 cards on larger screens
            spaceBetween: 40,
        },
    }
});

setInterval(() => {
    swiper.slideNext();
}, 3000); // Change slide every 3 seconds
