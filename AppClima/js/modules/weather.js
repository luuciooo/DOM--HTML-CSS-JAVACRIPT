export async function getWeatherData(location) {
    try {
        // Realiza una solicitud a la API de WeatherAPI para obtener datos del clima
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${location}&days=14&lang=es&key=26265312b1624754a44135128250304&hour=12`);
        
        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
        
        // Convierte la respuesta en formato JSON y la devuelve
        return await response.json();
    } catch (error) {
        console.error(error); // Muestra el error en la consola
    }
}

export async function cleanWeatherData(data) {
    try {
        // Array con los nombres de los días de la semana en inglés
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Muestra en la consola la cantidad de días en el pronóstico
        console.log(`Cantidad de días en el pronóstico: ${data.forecast.forecastday.length}`);

        // Mapea los datos del pronóstico para obtener información más limpia y estructurada
        return data.forecast.forecastday.map(({ date, day, hour }) => {
            // Convierte la fecha en un objeto Date para extraer información
            const dateObj = new Date(date + 'T00:00:00');
            
            return {
                dayName: daysOfWeek[dateObj.getDay()], // Nombre del día de la semana
                date: `${dateObj.getDate()} ${dateObj.toLocaleString("en-US", { month: "short" })}`, // Fecha en formato día y mes abreviado
                icon: hour[0].condition.icon, // URL del ícono del clima
                maxTemp: Math.round(day.maxtemp_c), // Temperatura máxima redondeada
                minTemp: Math.round(day.mintemp_c), // Temperatura mínima redondeada
                condition: hour[0].condition.text, // Descripción del clima
                precipitation: day.daily_chance_of_rain, // Probabilidad de lluvia
                humidity: day.avghumidity, // Humedad promedio
                wind: 21.2, // Valor constante en el código original (se podría mejorar tomando datos reales)
            };
        });
    } catch (error) {
        console.error(error); // Muestra el error en la consola
        return []; // Retorna un array vacío en caso de error
    }
}