let iconMap = [
  {
    name: `Sunny`,
    id: `sun`,
    iconGroup: {day: [`day`], night: [`night`], misc: []},
    weatherCode: [0, 1]
  },
  {
    name: `Breeze`,
    id: `breeze`,
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
    name: `Rain`,
    id: `rain`,
    iconGroup: {day: [`rainy-1`, `rainy-2`, `rainy-3`], night: [`rainy-4`, `rainy-5`, `rainy-6`, `rainy-7`], misc: []},
    weatherCode: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
  },
  {
    name: `Snow`,
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

let lang = new URLSearchParams(window.location.search).get("lang") || `en`
console.log(lang)


app()

async function app() {
  let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.382158355677774&longitude=4.887103035690015&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode`)
  weather = await weather.json()

  let langData = await fetch(`/api/translations/${lang}.json`)
  langData = await langData.json()
  langData = langData.weather
  langDataArray = Object.entries(langData)
  console.log(`lang`, langDataArray)
  let temperature;
  let weatherCode = weather.current_weather.weathercode

  console.log(`unit`, new URLSearchParams(window.location.search).get("unit").toLowerCase())
  if (new URLSearchParams(window.location.search).get("unit").toUpperCase() === `F`) {
    temperature = Math.round((weather.current_weather.temperature * 9/5) + 32)
    unit = `F`
  } else {
    temperature = weather.current_weather.temperature
    unit = `C`
  }


  let day;
  if (new URLSearchParams(window.location.search).get("force-time") === null) {
    day = weather.current_weather.time.split(`T`)[1]

    day = day.split(`:`)[0]
    if (day >= 7 && day <= 19) {
      day = `day`
    } else {
      day = `night`
    }
  } else {
    day = new URLSearchParams(window.location.search).get("force-time")
  }

  let iconType = `animated`
  if (new URLSearchParams(window.location.search).get(`animation-off`) != undefined) iconType = `static`

  let randomIcon;
  let weatherName;

  iconMap.forEach(iconMapIcon => {
    iconMapIcon.weatherCode.forEach(iconMapIconWeatherCode => {
      if (iconMapIconWeatherCode === weatherCode) {

        
        langDataArray.forEach(langDataId => {
          if (langDataId[0] === iconMapIcon.id) {
            weatherName = langDataId[1]
          }
        });


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
  
  document.body.insertAdjacentHTML(`afterbegin`, `<div class="weather-widget"><img class="weather-icon" src="./icons/${iconType}/${randomIcon}.svg"><p class="weather-subtitle">${weatherName}</p><p class="temperature">${temperature}<small>°${unit}</small></p></div>`)
}

setInterval(() => {
  location.reload()
}, 300000);

//////////////////////
/// URL Paramaters ///
//////////////////////
// General
const params = new URLSearchParams(window.location.search)
var root = document.querySelector(":root")

// Font
let fontFamily = params.get("font-family")
root.style.setProperty("--font-family", fontFamily)

let fontWeight = params.get("font-weight")
root.style.setProperty("--font-weight", fontWeight)

let fontStyle = params.get("font-style")
root.style.setProperty("--font-style", fontStyle)

let fontSize = params.get("font-size")
root.style.setProperty("--font-size", fontSize)

let fontColor = params.get("font-color")
root.style.setProperty("--font-color", fontColor)
