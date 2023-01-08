let iconMap = [
  {
    name: `Regular`,
    id: `regular`,
    iconGroup: {day: [`day`], night: [`night`], misc: []},
    weatherCode: [0, 1]
  },
  {
    name: `Cloudy & Regular`,
    id: `cloud-regular`,
    iconGroup: {day: [`cloudy-day-1`, `cloudy-day-2`, `cloudy-day-3`], night: [`cloudy-night-1`, `cloudy-night-2`, `cloudy-night-3`], misc: []},
    weatherCode: [2]
  },
  {
    name: `Cloudy`,
    id: `cloud`,
    iconGroup: {day: [], night: [], misc: [`cloudy`]},
    weatherCode: [3]
  },
  {
    name: `Foggy`,
    id: `fog`,
    iconGroup: {day: [], night: [], misc: [`cloudy`]},
    weatherCode: [45, 48]
  },
  {
    name: `Rainy`,
    id: `rain`,
    iconGroup: {day: [`rainy-1`, `rainy-2`, `rainy-3`], night: [`rainy-4`, `rainy-5`, `rainy-6`, `rainy-7`], misc: []},
    weatherCode: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
  },
  {
    name: `Snowy`,
    id: `snow`,
    iconGroup: {day: [`snowy-1`, `snowy-2`, `snowy-3`], night: [`snowy-4`, `snowy-5`, `snowy-6`], misc: []},
    weatherCode: [71, 73, 75, 77, 85, 86]
  },
  {
    name: `Thunderstorm`,
    id: `thunder`,
    iconGroup: {day: [], night: [], misc: [`thunder`]},
    weatherCode: [95, 96, 99]
  }
]

app()

async function app() {
  let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.382158355677774&longitude=4.887103035690015&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode`)
  weather = await weather.json()

  console.log(`Fetched weather:`, weather)

  let temperature = weather.current_weather.temperature
  let weatherCode = weather.current_weather.weathercode

  let day = weather.current_weather.time.split(`T`)[1]

  day = day.split(`:`)[0]
  if (day >= 7 && day <= 21) {
    day = `day`
  } else {
    day = `night`
  }

  let iconType = `animated`
  if (new URLSearchParams(window.location.search).get(`animated`) != undefined) iconType = `animated`

  let randomIcon;
  let weatherName;

  iconMap.forEach(iconMapIcon => {
    iconMapIcon.weatherCode.forEach(iconMapIconWeatherCode => {
      if (iconMapIconWeatherCode === weatherCode) {

        weatherName = iconMapIcon.name
        if (iconMapIcon.iconGroup.misc.toString() === ``) {
          
          if (day === `day`) {
            randomIcon = iconMapIcon.iconGroup.day[Math.floor(Math.random() * iconMapIcon.iconGroup.day.length)];
          }
          
          if (day === `night`) {
            randomIcon = iconMapIcon.iconGroup.night[Math.floor(Math.random() * iconMapIcon.iconGroup.night.length)];
          }
          
        } else {
          randomIcon = iconMapIcon.iconGroup.misc[Math.floor(Math.random() * iconMapIcon.iconGroup.misc.length)];
        }

      }
    });
  });

  document.body.setAttribute(`data-time`, day)
  
  document.body.insertAdjacentHTML(`afterbegin`, `<div class="weather-widget"><img class="weather-icon" src="./icons/${iconType}/${randomIcon}.svg"><p class="weather-subtitle">${weatherName}</p><p class="temperature">${temperature}</p></div>`)
}
