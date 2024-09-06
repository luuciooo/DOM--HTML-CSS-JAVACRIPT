export async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${location}&days=14&lang=es&key=1f0a8081147146ef8f1220418242908&hour=12`);
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function cleanWeatherData(data) {
    try {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return data.forecast.forecastday.map(({ date, day, hour }) => {
            const dateObj = new Date(date + 'T00:00:00');
            return {
                dayName: daysOfWeek[dateObj.getDay()],
                date: `${dateObj.getDate()} ${dateObj.toLocaleString("en-US", { month: "short" })}`,
                icon: hour[0].condition.icon,
                maxTemp: Math.round(day.maxtemp_c),
                minTemp: Math.round(day.mintemp_c),
                condition: hour[0].condition.text,
                precipitation: day.daily_chance_of_rain,
                humidity: day.avghumidity,
                wind: 21.2, // Constant value in your code
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}