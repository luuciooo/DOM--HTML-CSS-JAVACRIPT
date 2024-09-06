import { generateCarousel } from './carousel.js';

export async function initializeApp() {
    const location = await getCoordinates();
    if (!location) {
        showLocationError();
        return;
    }
    generateCarousel('carousel-top', location);
}

export async function getCoordinates() {
    try {
        const { coords: { latitude, longitude } } = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        return `${latitude},${longitude}`;
    } catch (error) {
        console.error(`Error getting coordinates: ${error.message}`);
        return null;
    }
}

export function showLocationError() {
    const carouselTop = document.getElementById("carousel-top");
    carouselTop.innerHTML = `
        <div class="main-block" id="location-error">
            <p>You haven't allowed location access.</p>
            <button id="retry-location">Retry</button>
        </div>
    `;

    document.getElementById('retry-location').addEventListener('click', async () => {
        initializeApp();
    });
}