import { initializeApp, getCoordinates, showLocationError } from './modules/geolocation.js';
import { generateCarousel } from './modules/carousel.js';
import { setupSearchEvent } from './modules/citySearch.js';

// Espera a que el documento HTML esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    initializeApp(); // Inicializa la aplicación obteniendo la ubicación del usuario y generando el carrusel superior
    setupSearchEvent(); // Configura el evento para la búsqueda de ciudades
});