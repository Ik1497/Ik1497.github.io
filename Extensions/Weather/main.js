let iconMap = [
  {
    name: "Sunny",
    iconGroup: {day: [`day`], night: [`night`], misc: []},
    weatherCodes: [0, 1]
  },
  {
    name: "Cloudy & Sunny",
    iconGroup: {day: [`cloudy-day-1`, `cloudy-day-2`, `cloudy-day-3`], night: [`cloudy-night-1`, `cloudy-night-2`, `cloudy-night-3`], misc: []},
    weatherCodes: [2]
  },
  {
    name: "Cloudy",
    iconGroup: {day: [], night: [], misc: [`cloudy`]},
    weatherCodes: [3]
  },
  {
    name: "Foggy",
    iconGroup: {day: [], night: [], misc: [`cloudy`]},
    weatherCodes: [45, 48]
  },
  {
    name: "Rainy",
    iconGroup: {day: [`rainy-1`, `rainy-2`, `rainy-3`], night: [`rainy-4`, `rainy-5`, `rainy-6`, `rainy-7`], misc: []},
    weatherCodes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
  },
  {
    name: "Snowy",
    iconGroup: {day: [`snowy-1`, `snowy-2`, `snowy-3`], night: [`snowy-4`, `snowy-5`, `snowy-6`], misc: []},
    weatherCodes: [71, 73, 75, 77, 85, 86]
  },
  {
    name: "Thunderstorm",
    iconGroup: {day: [], night: [], misc: [`thunder`]},
    weatherCodes: [95, 96, 99]
  },

]

app()

async function app() {
  let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.382158355677774&longitude=4.887103035690015&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode`)
  weather = await weather.json()
  let temperature = weather.current_weather.temperature
  let icon = {icon: `weather`, timerPeriod: `Misc`}
  console.log(weather)
  document.body.insertAdjacentHTML(`afterbegin`, `<div class="weather-widget"><img class="weather-icon" src="./icons/${icon.icon}.svg"><p class="weather-subtitle">${icon.timerPeriod}</p><p class="temperature">${temperature}</p></div>`)
}

