let voice = new URLSearchParams(window.location.search).get(`voice`) || `tts`

app()

async function app() {
    let idiots = await fetch(`data.json`)
    idiots = await idiots.json()
    let randomIdiotsIndex = Math.floor(Math.random()*idiots.length)
    let idiot = idiots[randomIdiotsIndex];
    if (new URLSearchParams(window.location.search).get(`force`) != null) {
        idiots.forEach(idiotList => {
            if (idiotList.user === new URLSearchParams(window.location.search).get(`force`)) {
                idiot = idiotList
            }
        });
    }
    document.querySelector(`main .idiot-image img.forground-image`).src = `./images/logos/${idiot.user.toLowerCase()}.png`

    for (let imagesRunTime = 0; imagesRunTime < (idiot.images + 1); imagesRunTime++) {
        document.querySelector(`main .idiot-grid`).insertAdjacentHTML(`beforeend`, `<img src="./images/messages/${idiot.user}-${imagesRunTime}.png">`)
    }

    document.querySelector(`main .idiot-grid`).insertAdjacentHTML(`afterbegin`, `<p style="padding: 0; padding-left: 1rem;">${idiot.images + 1} wheels reinvented<br>${idiot.user.replaceAll(`-`, ` `)}</p>`)
    connecTwitchSpeakerws()
    
    async function connecTwitchSpeakerws() {
      if ("WebSocket" in window) {
        let wsServerUrl = `ws://localhost:7580/`
        const ws = new WebSocket(wsServerUrl)
        console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to TwitchSpeaker...")
    
        ws.onopen = function () {
          console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to TwitchSpeaker")
          ws.send(JSON.stringify(
            {
              request: "Speak",
              voice: voice,
              message: idiot.user + " Is reinventing a wheel!",
              id: "Speak"
            }
          ))
        }
    
        ws.addEventListener("message", (event) => {
          if (!event.data) return
          const data = JSON.parse(event.data)
          console.log(data)
        })
      }
    }
}
