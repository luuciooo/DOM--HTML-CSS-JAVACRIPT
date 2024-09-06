// modules/citySearch.js
export const cityInput = document.getElementById('city');
export const suggestions = document.getElementById('suggestions');
export const username = 'luuciooo';
import { generateCarousel } from './carousel.js'; 
let debounceTimeout;
let selectedCityCoords = null;

export function setupSearchEvent() {
    cityInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const query = cityInput.value.trim();
            if (query.length > 2) {
                searchCities(query);
            } else {
                suggestions.innerHTML = '';
                suggestions.style.display = 'none';
            }
        }, 300);
    });

    document.getElementById('search-weather').addEventListener('click', () => {
        if (selectedCityCoords) {
            generateCarousel('carousel-bottom', selectedCityCoords);
        } else {
            alert("No city selected");
        }
    });
}

function searchCities(query) {
    fetch(`http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=5&username=${username}`)
        .then(response => response.json())
        .then(data => {
            suggestions.innerHTML = '';
            const cities = data.geonames;

            if (cities.length > 0) {
                cities.forEach(city => {
                    const li = document.createElement('li');
                    li.textContent = `${city.name}, ${city.countryName}`;
                    li.addEventListener('click', () => {
                        cityInput.value = city.name;
                        selectedCityCoords = `${city.lat},${city.lng}`;
                        suggestions.innerHTML = '';
                        suggestions.style.display = 'none';
                    });
                    suggestions.appendChild(li);
                });
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching city suggestions:', error);
            suggestions.style.display = 'none';
        });
}