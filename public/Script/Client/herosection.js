// Get all the slide elements and the main-content div
let slides = document.querySelectorAll('.slideshow-container .slide');
let mainContent = document.querySelector('.main-content');
let currentIndex = 0;
let totalSlides = slides.length;
let nextButton = document.querySelector('.next');
let prevButton = document.querySelector('.prev');

// Function to show the active slide and update the background
function showSlide(index) {
    // Hide all slides
    slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'flex' : 'none'; // Show the active slide
    });

    // Update the background of the main-content div
    let bgImage = slides[index].getAttribute('data-bg');
    mainContent.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5)), url('${bgImage}')`;
}

// Event listeners for the next and previous buttons
nextButton.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % totalSlides; // Move to the next slide
    showSlide(currentIndex);
});

prevButton.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Move to the previous slide
    showSlide(currentIndex);
});

// Auto-slide every 5 seconds
let slideInterval = setInterval(function() {
    nextButton.click();
}, 20000);

// Show the first slide initially
showSlide(currentIndex);
