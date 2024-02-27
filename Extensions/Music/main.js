//////////////////////
/// Default Values ///
//////////////////////
window.musicData = {}

let artistNameDefault = `for this widget to work!`
let songNameDefault = `Play a Song`
let albumArtDefault = `./placeholder.png`
window.musicData.animationTime = 8000

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
    consoleLog(`Trying to connect to Streamer.bot...`)

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      consoleLog(`No connection found to Streamer.bot, reconnecting every 10s...`)
    };

    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          request: "Subscribe",
          events: {
            General: ["Custom"],
          },
          id: "123",
        })
      );
      consoleLog(`Connected to Streamer.bot`);
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') {
        consoleLog(`Subscribed to the Events/Requests`)
        return
      };

      console.log(data)

      let songName = data?.data?.songName
      let artistName = data?.data?.artistName
      let albumArt = `${data?.data?.albumArt}?t=${new Date().getTime()}`

      if (songName === undefined || artistName === undefined || albumArt === undefined) return
      if (songName === null || artistName === null || albumArt === null) return
      if (songName === "" || artistName === "" || albumArt === "") return
      if (document.querySelector(`.container`) != null) return

      let theme = new URLSearchParams(window.location.search).get(`theme`) || `default`
      document.body.setAttribute(`data-theme`, theme)

      if (theme === `default`) {
        document.body.insertAdjacentHTML(`afterbegin`, `
        <div class="container">
          <img class="album-cover" alt="Music Album Cover" src="${albumArt}">
          <div class="bottom-container">
            <div class="texts">
              <p class="songName">${songName}</p>
              <p class="artistName">${artistName}</p>
            </div>
          </div>
        </div>
        `)
        
        setTimeout(() => {
          document.querySelector(`.container`).setAttribute(`data-state`, `opening-1`)
          
          setTimeout(() => {
            document.querySelector(`.container`).setAttribute(`data-state`, `opening-2`)
            
            setTimeout(() => {
              document.querySelector(`.container`).setAttribute(`data-state`, `opened`)
              
              setTimeout(() => {
                document.querySelector(`.container`).setAttribute(`data-state`, `closing-1`)
                
                setTimeout(() => {
                  document.querySelector(`.container`).setAttribute(`data-state`, `closing-2`)
                  
                  setTimeout(() => {
                    document.querySelector(`.container`).setAttribute(`data-state`, `closed`)
                    document.querySelector(`.container`).remove()
        
                  }, 750);
                }, 750);
              }, window.musicData.animationTime || 8000 + 750);
            }, 750);
          }, 750);
        }, 50);
      }      
    });
  }
}

//////////////////////
/// URL Parameters ///
//////////////////////

//****************//
// THEME: Minimal //
//****************//

/// General ///
var root = document.body
const params = new URLSearchParams(window.location.search)

// Font
urlParam(`font-family`)
urlParam(`font-style`)
urlParam(`font-size`)

// Misc
let imageSize = params.get(`image-size`) || `8em`
root.style.setProperty(`--image-size`, imageSize)
root.style.setProperty(`--image-size-minus`, `-` + imageSize)

urlParam(`border-radius-album-cover`)
urlParam(`border-radius-texts-background`)

// Colors
urlParam(`color-primary`)
urlParam(`color-accent`)

// Background
urlParam(`background`)
urlParam(`alt-background`)

// Animation
window.musicData.animationTime = params.get(`animation-time`) || window.musicData.animationTime

function urlParam(name) {
  document.body.style.setProperty(`--${name}`, params.get(name))
}

function consoleLog(message) {
  console.log(
    "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " +
    message
  );
}