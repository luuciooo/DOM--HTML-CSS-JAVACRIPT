const carruseles = {
    'carousel-top': {
        currentSlide: 0,
        totalSlides: 14,
        visibleSlides: 5
    },
    'carousel-buttom': {
        currentSlide: 0,
        totalSlides: 14,
        visibleSlides: 5
    }
};

document.addEventListener("DOMContentLoaded", () => {
    general();
});

async function general() {
    const ubicacion = await getCoords();
    if (!ubicacion) {
        mostrarMensajePermisos();
        return;
    }
    configurarCarusel()
    const data = await getWeatherData(ubicacion);
    console.log(data)
    const json = await limpiarJson(data);
    console.log(json)
    await renderWeatherCarousel(json,"carousel-top");
    updateCarousel("carousel-top");
}

async function getCoords() {
    try {
        const { coords: { latitude, longitude } } = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return `${latitude},${longitude}`;

    } catch (error) {
        console.error(`Error al obtener las coordenadas: ${error.message}`);
        return null;
    }
}

function mostrarMensajePermisos() {
    const carouselTop = document.getElementById("carousel-top");
    carouselTop.innerHTML = `
        <div id="location-error">
            <p>No has permitido los permisos de ubicación.</p>
            <button id="retry-location">Volver a preguntar</button>
        </div>
    `;

    document.getElementById('retry-location').addEventListener('click', async () => {
        general();
    });
}

function configurarCarusel() {
    const carouselTop = document.getElementById("carousel-top");
    const locationErrorDiv = document.getElementById("location-error");

    if (locationErrorDiv) {
        locationErrorDiv.style.display = 'none'; // Oculta el div
    } // Verifica si el div "location-error" no está presente
    carouselTop.innerHTML = `
    <button class="carousel-button left" ">
        <span class="material-icons">chevron_left</span>
    </button>
    <div class="carousel-track">
        <!-- Aquí irían los elementos del carrusel -->
    </div>
    <button class="carousel-button right" ">
        <span class="material-icons">chevron_right</span>
    </button>`;
    document.querySelector('#carousel-top .carousel-button.left').addEventListener('click', () => {
        prevSlide('carousel-top');
    });
    document.querySelector('#carousel-top .carousel-button.right').addEventListener('click', () => {
        nextSlide('carousel-top');
    });
}

async function getWeatherData(position) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?q=${position}&days=14&lang=es&key=1f0a8081147146ef8f1220418242908&hour=12`
        );
        if (!response.ok) {
            throw new Error(
                `Error al obtener datos del clima: ${response.statusText}`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function limpiarJson(data) {
    try {
        const dias = data.forecast.forecastday;
        console.log(dias)
        const resultados = [];

        dias.forEach((dia) => {
            const diasSemana = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ];
            const date = new Date(dia.date + 'T00:00:00');
            console.log(date);

            const nombreDia = diasSemana[date.getDay()];
            console.log(nombreDia);

            const day = date.getDate();
            const month = date.toLocaleString("en-US", { month: "short" });
            const fecha = `${day} ${month}`;

            const temperaturaMax = Math.round(dia.day.maxtemp_c);
            const temperaturaMin = Math.round(dia.day.mintemp_c);

            const condicion = dia.hour[0].condition.text;
            const icon = dia.hour[0].condition.icon;
            const precipitaciones = dia.day.daily_chance_of_rain;
            const humedad = dia.day.avghumidity;
            const viento = Math.round(21.2);

            resultados.push({
                nombreDia,
                fecha,
                icon,
                temperaturaMax,
                temperaturaMin,
                condicion,
                precipitaciones,
                humedad,
                viento,
            });
        });

        console.log(resultados); // Muestra el array de objetos en consola
        return resultados; // Devuelve el array de objetos
    } catch (error) {
        console.error(error);
        return []; // Devuelve un array vacío en caso de error
    }
}

async function renderWeatherCarousel(weatherData, carousel) {
    const carouselTop = document.getElementById(`${carousel}`);
    const carouselContainer = carouselTop.querySelector(".carousel-track");
    console.log(carouselContainer);

    weatherData.forEach((dia) => {
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "icon-wrapper";
        const icon = document.createElement("img");
        icon.src = dia.icon;
        icon.alt = dia.condicion;
        icon.className = "weather-icon";

        iconWrapper.appendChild(icon);

        carouselItem.innerHTML = `<div class="carousel-item-content">
        <div class="icon-and-header">
            <div class="icon-wrapper">${icon.outerHTML}</div>
            <div class="header-info">
                <p class="nombre-dia">${dia.nombreDia}</p>
                <p class="fecha">${dia.fecha}</p>
            </div>
        </div>
        <div class="temperaturas">
            <span class="temperatura-min">${dia.temperaturaMin}º</span>
            <span class="barra">/</span>
            <span class="temperatura-max">${dia.temperaturaMax}º</span>
        </div>
        <p class="condicion">${dia.condicion}</p>
        <div class="carousel-item-buttom">
            <p class="precipitaciones"><i class="fas fa-cloud-rain"></i> ${dia.precipitaciones}%</p>
            <p class="humedad"><i class="fas fa-tint"></i> ${dia.humedad}%</p>
            <p class="viento"><i class="fas fa-wind"></i> ${dia.viento} km/h</p>
        </div>
    </div>
`;
        carouselContainer.appendChild(carouselItem);
    });
}

function updateCarousel(carusel) {
    const div = document.getElementById(carusel);
    const carousel = div.querySelector(".carousel-track");
    const { currentSlide, visibleSlides } = carruseles[carusel];
    const offset = -(currentSlide * (100 / visibleSlides));
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlide(carusel) {
    const carrusel = carruseles[carusel];
    if (carrusel.currentSlide < carrusel.totalSlides - carrusel.visibleSlides) {
        carrusel.currentSlide++;
    } else {
        carrusel.currentSlide = 0;
    }
    updateCarousel(carusel);
}

function prevSlide(carusel) {
    const carrusel = carruseles[carusel];
    if (carrusel.currentSlide > 0) {
        carrusel.currentSlide--;
    } else {
        carrusel.currentSlide = carrusel.totalSlides - carrusel.visibleSlides;
    }
    updateCarousel(carusel);
}


const inputCiudad = document.getElementById('ciudad');
const sugerencias = document.getElementById('sugerencias');
const username = 'luuciooo'; // Reemplaza 'demo' con tu username de GeoNames
const buscar = document.getElementById('buscar-clima');

inputCiudad.addEventListener('input', () => {
    const query = inputCiudad.value.trim();

    if (query.length > 2) {
        fetch(`http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=5&username=${username}`)
            .then(response => response.json())
            .then(data => {
                sugerencias.innerHTML = ''; // Limpiar sugerencias anteriores
                const ciudades = data.geonames;

                if (ciudades.length > 0) {
                    ciudades.forEach(ciudad => {
                        const li = document.createElement('li');
                        li.textContent = `${ciudad.name}, ${ciudad.countryName}`;
                        li.addEventListener('click', () => {
                            inputCiudad.value = ciudad.name;
                            sugerencias.innerHTML = ''; // Limpiar sugerencias
                            sugerencias.style.display = 'none'; // Ocultar la lista
                            buscar.addEventListener('click', () => {
                                general2(`${ciudad.lat},${ciudad.lng}`)
                            });
                        });
                        sugerencias.appendChild(li);
                    });
                    sugerencias.style.display = 'block'; // Mostrar la lista
                } else {
                    sugerencias.style.display = 'none'; // Ocultar la lista si no hay resultados
                }
            })
            .catch(error => {
                console.error('Error al obtener sugerencias:', error);
                sugerencias.style.display = 'none'; // Ocultar la lista en caso de error
            });
    } else {
        sugerencias.innerHTML = ''; // Limpiar sugerencias si la entrada es corta
        sugerencias.style.display = 'none'; // Ocultar la lista si el input está vacío
    }
});


async function general2(hola) {
    console.log(hola)
    if (hola) {
        const div = document.getElementById('carousel-buttom');
        div.innerHTML = ''
        div.innerHTML = `
    <button class="carousel-button left" ">
        <span class="material-icons">chevron_left</span>
    </button>
    <div class="carousel-track">
        <!-- Aquí irían los elementos del carrusel -->
    </div>
    <button class="carousel-button right" ">
        <span class="material-icons">chevron_right</span>
    </button>`;
    }
    document.querySelector('#carousel-buttom .carousel-button.left').addEventListener('click', () => {
        prevSlide('carousel-buttom');
    });
    document.querySelector('#carousel-buttom .carousel-button.right').addEventListener('click', () => {
        nextSlide('carousel-buttom');
    });
    const data = await getWeatherData(hola);
    console.log(data)
    const json = await limpiarJson(data);
    console.log(json)
    await renderWeatherCarousel(json,"carousel-buttom");
    updateCarousel("carousel-buttom");

}

