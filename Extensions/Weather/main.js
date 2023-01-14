let lang = new URLSearchParams(window.location.search).get("lang") || `en`
document.documentElement.setAttribute(`lang`, lang);

let coords = {}
coords.latitude = (new URLSearchParams(window.location.search).get("lat") || `52.52`)
coords.longitude = (new URLSearchParams(window.location.search).get("lon") || `13.419998`)

app()

async function app() {
  let weather
  let iconMap
  let weatherCode
  let temperature
  let unit = new URLSearchParams(window.location.search).get("unit") || `C`
  let day

  if (new URLSearchParams(window.location.search).get("open-weather-map-api-key") === null) {
    weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&timezone=auto`)
    weather = await weather.json()
    weatherType = `openMeteo`

    iconMap = await fetch(`./iconmap.json`)
    iconMap = await iconMap.json()
    iconMap = iconMap.openMeteo
    weatherCode = weather.current_weather.weathercode
    temperature = weather.current_weather.temperature
    day = weather.current_weather.time
  }
  
  if (new URLSearchParams(window.location.search).get("open-weather-map-api-key") != null) {
    weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${new URLSearchParams(window.location.search).get("open-weather-map-api-key")}`)
    weather = await weather.json()
    weatherType = `openweathermap`
    
    iconMap = await fetch(`./iconmap.json`)
    iconMap = await iconMap.json()
    iconMap = iconMap.openweathermap
    temperature = weather.main.temp
    weatherCode = weather.weather[0].icon
    day = new Date().getHours()
  }

  if (unit.toUpperCase() === `F`) {
    unit = `F`
    temperature = Math.round(((temperature * 9/5) + 32) * 10) / 10
  } else {
    unit = `C`
    temperature = Math.round(temperature * 10) / 10
  }
  
  let langData = await fetch(`/api/translations/${lang}.json`)
  langData = await langData.json()
  langData = langData.weather
  langDataArray = Object.entries(langData)
  
  console.log(`Weather`, weather)
  console.log(`Iconmap`, iconMap)
  console.log(`Language Data`, langData)


  if (new URLSearchParams(window.location.search).get("force-time") === null) {
    if (weatherType === `openMeteo`) {
      day = day.split(`T`)[1]
  
      day = day.split(`:`)[0]
    }

    if (day >= 7 && day <= 19) {
      day = `day`
    } else {
      day = `night`
    }
  } 
  
  if (new URLSearchParams(window.location.search).get("force-time") != null) {
    day = new URLSearchParams(window.location.search).get("force-time").toLowerCase()
  }
  document.body.setAttribute(`data-time`, day)
  
  let iconType = `animated`
  if (new URLSearchParams(window.location.search).get(`animation-off`) != undefined) iconType = `static`

  let randomIcon;
  let weatherName;
  if (new URLSearchParams(window.location.search).get("force-icon-time") != null) {
    day = new URLSearchParams(window.location.search).get("force-icon-time").toLowerCase()
  }
  
  if (weatherType === `openMeteo`) {
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
  } else if (weatherType === `openweathermap`) {
    iconMap.forEach(iconMapIcon => {
      iconMapIcon.weatherCode.forEach(iconMapIconWeatherCode => {   
        if (weatherCode === `${iconMapIconWeatherCode}d` || weatherCode === `${iconMapIconWeatherCode}n`) {
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

  }

  if (new URLSearchParams(window.location.search).get(`weather-name`) != null) weatherName = new URLSearchParams(window.location.search).get(`force-weather-name`)
  if (new URLSearchParams(window.location.search).get(`weather-name-prefix`) != null) weatherName += new URLSearchParams(window.location.search).get(`weather-name-prefix`)
  if (new URLSearchParams(window.location.search).get(`weather-name-suffix`) != null) weatherName = weatherName + new URLSearchParams(window.location.search).get(`weather-name-suffix`)
  if (new URLSearchParams(window.location.search).get(`weather-name-subtitle`) != null) weatherName = `${weatherName}<br><small>${new URLSearchParams(window.location.search).get(`weather-name-subtitle`)}</small>`

  
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
