let lang = new URLSearchParams(window.location.search).get("lang") || `en`
document.documentElement.setAttribute(`lang`, lang);

let coords = {}
coords.latitude = (new URLSearchParams(window.location.search).get("lat") || `52.52`)
coords.longitude = (new URLSearchParams(window.location.search).get("lon") || `13.419998`)

app()

async function app() {
  let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode`)
  weather = await weather.json()
  
  let iconMap = await fetch(`./iconmap.json`)
  iconMap = await iconMap.json()
  
  let langData = await fetch(`/api/translations/${lang}.json`)
  langData = await langData.json()
  langData = langData.weather
  langDataArray = Object.entries(langData)

  let weatherCode = weather.current_weather.weathercode
  let temperature;
  let unit;

  console.log(`Weather`, weather)
  console.log(`Iconmap`, iconMap)
  console.log(`Language Data`, langData)

  unit = new URLSearchParams(window.location.search).get("unit") || `C`
  if (unit.toUpperCase() === `F`) {
    temperature = Math.round(((weather.current_weather.temperature * 9/5) + 32) * 10) / 10
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

  if (new URLSearchParams(window.location.search).get(`force-weather-name`) != null) weatherName = new URLSearchParams(window.location.search).get(`force-weather-name`)
  if (new URLSearchParams(window.location.search).get(`weather-name-prefix`) != null) weatherName += new URLSearchParams(window.location.search).get(`weather-name-prefix`)
  if (new URLSearchParams(window.location.search).get(`weather-name-suffix`) != null) weatherName = weatherName + new URLSearchParams(window.location.search).get(`weather-name-suffix`)

  if (weatherName.includes(`\\n`)) {
    weatherName = weatherName.split(`\\n`)
    weatherName = `${weatherName[0]}<br><small>${weatherName[1]}</small>`
  }

  document.body.setAttribute(`data-time`, day)
  
  document.body.insertAdjacentHTML(`afterbegin`, `<div class="weather-widget"><img class="weather-icon" src="./icons/${iconType}/${randomIcon}.svg"><p class="weather-subtitle">${weatherName}</p><p class="temperature">${temperature}<small>&deg;${unit}</small></p></div>`)
}

setInterval(() => {
  location.reload()
}, 300000);

//////////////////////
/// URL parameters ///
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

// Widget

let background = params.get("background")
root.style.setProperty("--background", background)

let borderRadius = params.get("border-radius")
root.style.setProperty("--border-radius", borderRadius)
