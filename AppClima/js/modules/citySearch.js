// modules/citySearch.js

// Selecciona el input de la ciudad y el contenedor de sugerencias en el HTML
export const cityInput = document.getElementById('city');
export const suggestions = document.getElementById('suggestions');

// Define el nombre de usuario para la API de GeoNames
export const username = 'luuciooo';

// Importa la función para generar el carrusel
import { generateCarousel } from './carousel.js';

let debounceTimeout; // Variable para almacenar el temporizador de debounce
let selectedCityCoords = null; // Variable para almacenar las coordenadas de la ciudad seleccionada

// Configura los eventos para la búsqueda de ciudad
export function setupSearchEvent() {
    // Evento que se activa cada vez que se escribe en el campo de entrada
    cityInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout); // Cancela el temporizador anterior
        debounceTimeout = setTimeout(() => {
            const query = cityInput.value.trim(); // Obtiene el valor ingresado por el usuario y elimina los espacios extra
            if (query.length > 2) { // Solo busca si el texto tiene más de 2 caracteres
                searchCities(query); // Llama a la función para buscar las ciudades
            } else {
                suggestions.innerHTML = ''; // Limpia las sugerencias si no hay texto suficiente
                suggestions.style.display = 'none'; // Oculta las sugerencias
            }
        }, 300); // Establece un retraso de 300ms para evitar múltiples búsquedas rápidas
    });

    // Evento que se activa al hacer clic en el botón de búsqueda de clima
    document.getElementById('search-weather').addEventListener('click', () => {
        if (selectedCityCoords) { // Si se ha seleccionado una ciudad
            generateCarousel('carousel-bottom', selectedCityCoords); // Genera el carrusel con las coordenadas de la ciudad seleccionada
        } else {
            alert("No city selected"); // Muestra un mensaje de alerta si no se ha seleccionado una ciudad
        }
    });
}

// Función para buscar ciudades utilizando la API de GeoNames
function searchCities(query) {
    // Realiza una solicitud HTTP a la API de GeoNames para buscar ciudades que comiencen con la cadena de búsqueda
    fetch(`http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=5&username=${username}`)
        .then(response => response.json()) // Convierte la respuesta en formato JSON
        .then(data => {
            suggestions.innerHTML = ''; // Limpia las sugerencias previas
            const cities = data.geonames; // Extrae las ciudades de la respuesta

            if (cities.length > 0) { // Si se encontraron ciudades
                cities.forEach(city => {
                    // Crea un elemento <li> para cada ciudad y lo agrega a la lista de sugerencias
                    const li = document.createElement('li');
                    li.textContent = `${city.name}, ${city.countryName}`; // Muestra el nombre y país de la ciudad
                    li.addEventListener('click', () => {
                        // Cuando se hace clic en una ciudad, establece las coordenadas y limpia las sugerencias
                        cityInput.value = city.name;
                        selectedCityCoords = `${city.lat},${city.lng}`;
                        suggestions.innerHTML = '';
                        suggestions.style.display = 'none';
                    });
                    suggestions.appendChild(li); // Añade el <li> a la lista de sugerencias
                });
                suggestions.style.display = 'block'; // Muestra las sugerencias
            } else {
                suggestions.style.display = 'none'; // Si no se encuentran ciudades, oculta las sugerencias
            }
        })
        .catch(error => {
            // Maneja cualquier error en la solicitud
            console.error('Error fetching city suggestions:', error);
            suggestions.style.display = 'none'; // Si hay un error, oculta las sugerencias
        });
}