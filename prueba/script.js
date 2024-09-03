let currentSlide = 0;
const totalSlides = 14;
const visibleSlides = 5;

function updateCarousel() {
    const carousel = document.querySelector('carousel-track');
    const offset = -(currentSlide * (100 / visibleSlides));
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    if (currentSlide < totalSlides - visibleSlides) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateCarousel();
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = totalSlides - visibleSlides;
    }
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', updateCarousel);