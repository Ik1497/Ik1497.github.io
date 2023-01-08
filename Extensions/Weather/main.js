let iconMap = [
  {
    name: `Regular`,
    id: `regular`,
    iconGroup: {day: [`day`], night: [`night`], misc: []},
    weatherCode: [0, 1]
  },
  {
    name: `Breezy`,
    id: `wind`,
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

  console.log(new URLSearchParams(window.location.search).get("force-time"))

  let day;
  if (new URLSearchParams(window.location.search).get("force-time") === null) {
    day = weather.current_weather.time.split(`T`)[1]

    day = day.split(`:`)[0]
    if (day >= 7 && day <= 21) {
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

  connectws()

  function connectws() {
    if ("WebSocket" in window) {
      let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/"
      const ws = new WebSocket(wsServerUrl)
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...")

      ws.onclose = function () {
        setTimeout(connectws, 10000)
        console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...")
      }

      ws.onopen = function () {
        ws.send(
          JSON.stringify({
            request: "Subscribe",
            events: {
              raw: ["Action"],
            },
            id: "123",
          })
        )
        console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot")
        document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<ul class="Mute-Indicator"></ul>`)
      }
      
      let outputAction = `Weather Widget -- Outputted Data`
      let fetchAction = `Weather Widget -- Request Data`

      let wsBody = {
        request: "DoAction",
        action: {
          name: outputAction,
        },
        args: {
          temperature: weather.current_weather.temperature,
          time: weather.current_weather.time,
          weatherCode: weather.current_weather.weathercode,
          windDirection: weather.current_weather.winddirection,
          windSpeed: weather.current_weather.windspeed
        },
        id: "123",
      }

      ws.addEventListener("message", (event) => {
        if (!event.data) return
        const data = JSON.parse(event.data)
        if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return }
        let runningAction = data?.data.name
        
        if (runningAction === fetchAction) {
          ws.send(JSON.stringify(wsBody))
        }
      })
    }
  }
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
