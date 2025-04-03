/* Importamos las funciones necesarias desde el módulo weather.js */
import { getWeatherData, cleanWeatherData } from './weather.js';

/* Objeto que almacena información sobre los carruseles, como el índice actual, el número total de diapositivas y las visibles */
export const carousels = {
    'carousel-top': { currentSlide: 0, totalSlides: 14, visibleSlides: 5 },
    'carousel-bottom': { currentSlide: 0, totalSlides: 14, visibleSlides: 5 }
};

/* Función asincrónica que genera un carrusel con datos meteorológicos */
export async function generateCarousel(selector, location) {
    setupCarousel(selector); // Configura la estructura HTML del carrusel
    const data = await getWeatherData(location); // Obtiene los datos del clima
    const cleanData = await cleanWeatherData(data); // Limpia y estructura los datos obtenidos
    await renderWeatherCarousel(cleanData, selector); // Renderiza el carrusel con los datos procesados
}

/* Función que configura la estructura HTML de un carrusel */
function setupCarousel(carouselId) {
    const div = document.getElementById(carouselId);
    div.innerHTML = `
    <button class="carousel-button left"><span class="material-icons">chevron_left</span></button>
    <div class="carousel-track"></div>
    <button class="carousel-button right"><span class="material-icons">chevron_right</span></button>`;
    
    // Agrega eventos a los botones de navegación del carrusel
    addCarouselArrowEvents(
        `#${carouselId} .carousel-button.left`,
        `#${carouselId} .carousel-button.right`,
        carouselId
    );
}

/* Función que actualiza la posición del carrusel en función del slide actual */
export function updateCarousel(carouselId) {
    const div = document.getElementById(carouselId);
    const carousel = div.querySelector(".carousel-track");
    const { currentSlide, visibleSlides } = carousels[carouselId];
    const offset = -(currentSlide * (100 / visibleSlides)); // Calcula el desplazamiento
    carousel.style.transform = `translateX(${offset}%)`; // Aplica el desplazamiento
}

/* Función que avanza al siguiente slide del carrusel */
export function nextSlide(carouselId) {
    const carousel = carousels[carouselId];
    if (carousel.currentSlide < carousel.totalSlides - carousel.visibleSlides) {
        carousel.currentSlide++;
    } else {
        carousel.currentSlide = 0; // Si está en el último slide, vuelve al inicio
    }
    updateCarousel(carouselId); // Actualiza la vista del carrusel
}

/* Función que retrocede al slide anterior del carrusel */
export function previousSlide(carouselId) {
    const carousel = carousels[carouselId];
    if (carousel.currentSlide > 0) {
        carousel.currentSlide--;
    } else {
        carousel.currentSlide = carousel.totalSlides - carousel.visibleSlides; // Si está en el primer slide, vuelve al final
    }
    updateCarousel(carouselId);
}

/* Agrega eventos de clic a los botones de navegación del carrusel */
export function addCarouselArrowEvents(leftSelector, rightSelector, carouselId) {
    document.querySelector(leftSelector).addEventListener('click', () => previousSlide(carouselId));
    document.querySelector(rightSelector).addEventListener('click', () => nextSlide(carouselId));
}

/* Función asincrónica que renderiza los elementos del carrusel con datos meteorológicos */
export async function renderWeatherCarousel(weatherData, carouselId) {
    const carouselElement = document.getElementById(carouselId);
    const carouselContainer = carouselElement.querySelector(".carousel-track");

    // Iteramos sobre los datos del clima y creamos un elemento de carrusel por cada día
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
        carouselContainer.appendChild(carouselItem); // Agrega el elemento al carrusel
    });
}