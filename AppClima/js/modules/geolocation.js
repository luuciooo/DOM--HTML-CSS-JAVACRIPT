import { generateCarousel } from './carousel.js';

// Inicializa la aplicación obteniendo la ubicación del usuario y generando el carrusel
export async function initializeApp() {
    const location = await getCoordinates(); // Obtiene las coordenadas del usuario
    
    if (!location) { // Si no se pueden obtener las coordenadas, muestra un error
        showLocationError();
        return;
    }
    
    generateCarousel('carousel-top', location); // Genera el carrusel superior con la ubicación
}

// Obtiene las coordenadas de geolocalización del usuario
export async function getCoordinates() {
    try {
        // Utiliza la API de geolocalización para obtener la latitud y longitud
        const { coords: { latitude, longitude } } = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        return `${latitude},${longitude}`; // Retorna las coordenadas en formato "latitud,longitud"
    } catch (error) {
        console.error(`Error getting coordinates: ${error.message}`); // Muestra el error en la consola
        return null; // Retorna null si hay un error
    }
}

// Muestra un mensaje de error si el usuario no permite el acceso a la ubicación
export function showLocationError() {
    const carouselTop = document.getElementById("carousel-top");
    
    // Inserta un mensaje de error en el carrusel superior con un botón para reintentar
    carouselTop.innerHTML = `
        <div class="main-block" id="location-error">
            <p>You haven't allowed location access.</p>
            <button id="retry-location">Retry</button>
        </div>
    `;
    
    // Agrega un evento al botón para volver a intentar obtener la ubicación
    document.getElementById('retry-location').addEventListener('click', async () => {
        initializeApp();
    });
}