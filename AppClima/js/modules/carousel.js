import { getWeatherData, cleanWeatherData } from './weather.js';

export const carousels = {
    'carousel-top': { currentSlide: 0, totalSlides: 14, visibleSlides: 5 },
    'carousel-bottom': { currentSlide: 0, totalSlides: 14, visibleSlides: 5 }
};

export async function generateCarousel(selector, location) {
    setupCarousel(selector);
    const data = await getWeatherData(location);
    const cleanData = await cleanWeatherData(data);
    await renderWeatherCarousel(cleanData, selector);
}

function setupCarousel(carouselId) {
    const div = document.getElementById(carouselId);
    div.innerHTML = `
    <button class="carousel-button left"><span class="material-icons">chevron_left</span></button>
    <div class="carousel-track"></div>
    <button class="carousel-button right"><span class="material-icons">chevron_right</span></button>`;
    
    addCarouselArrowEvents(
        `#${carouselId} .carousel-button.left`,
        `#${carouselId} .carousel-button.right`,
        carouselId
    );
}

export function updateCarousel(carouselId) {
    const div = document.getElementById(carouselId);
    const carousel = div.querySelector(".carousel-track");
    const { currentSlide, visibleSlides } = carousels[carouselId];
    const offset = -(currentSlide * (100 / visibleSlides));
    carousel.style.transform = `translateX(${offset}%)`;
}

export function nextSlide(carouselId) {
    const carousel = carousels[carouselId];
    if (carousel.currentSlide < carousel.totalSlides - carousel.visibleSlides) {
        carousel.currentSlide++;
    } else {
        carousel.currentSlide = 0;
    }
    updateCarousel(carouselId);
}

export function previousSlide(carouselId) {
    const carousel = carousels[carouselId];
    if (carousel.currentSlide > 0) {
        carousel.currentSlide--;
    } else {
        carousel.currentSlide = carousel.totalSlides - carousel.visibleSlides;
    }
    updateCarousel(carouselId);
}

export function addCarouselArrowEvents(leftSelector, rightSelector, carouselId) {
    document.querySelector(leftSelector).addEventListener('click', () => previousSlide(carouselId));
    document.querySelector(rightSelector).addEventListener('click', () => nextSlide(carouselId));
}

export async function renderWeatherCarousel(weatherData, carouselId) {
    const carouselElement = document.getElementById(carouselId);
    const carouselContainer = carouselElement.querySelector(".carousel-track");

    weatherData.forEach((day) => {
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";
        const carouselContent = `
        <div class="carousel-item-content">
            <div class="icon-and-header">
                <div class="icon-wrapper">
                    <img src="${day.icon}" alt="${day.condition}" class="weather-icon">
                </div>
                <div class="header-info">
                    <p class="day-name">${day.dayName}</p>
                    <p class="date">${day.date}</p>
                </div>
            </div>
            <div class="temperatures">
                <span class="min-temp">${day.minTemp}º</span>
                <span class="divider">/</span>
                <span class="max-temp">${day.maxTemp}º</span>
            </div>
            <p class="condition">${day.condition}</p>
            <div class="carousel-item-bottom">
                <p class="precipitation"><i class="fas fa-cloud-rain"></i> ${day.precipitation}%</p>
                <p class="humidity"><i class="fas fa-tint"></i> ${day.humidity}%</p>
                <p class="wind"><i class="fas fa-wind"></i> ${day.wind} km/h</p>
            </div>
        </div>`;
        carouselItem.innerHTML = carouselContent;
        carouselContainer.appendChild(carouselItem);
    });
}