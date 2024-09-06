import { initializeApp, getCoordinates, showLocationError } from './modules/geolocation.js';
import { generateCarousel } from './modules/carousel.js';
import { setupSearchEvent } from './modules/citySearch.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeApp(); // Starts the app by getting the user's location and generating the top carousel
    setupSearchEvent(); // Sets up the city search event listener
});