//////////////////////
/// Default Values ///
//////////////////////
let artistNameDefault = `for this widget to work!`
let songNameDefault = `Play a Song`
let albumArtDefault = `./placeholder.png`
let animationTime = 8000

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...");

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...");

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
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };
      console.log(data)

      let songName = data?.data?.songName
      let artistName = data?.data?.artistName
      let albumArt = data?.data?.albumArt
      // if (albumArt.includes(`/9j/`)) albumArt = `data:image/jpg;base64,${albumArt}`

      if (songName === undefined || artistName === undefined || albumArt === undefined) return
      if (songName === null || artistName === null || albumArt === null) return
      if (songName === "" || artistName === "" || albumArt === "") return
      if (document.querySelector(`.container`) != null) return

      let theme = new URLSearchParams(window.location.search).get(`theme`) || `default`
      document.body.setAttribute(`data-theme`, theme)

      
      if (theme === `minimal`) {
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
              }, animationTime + 750);
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
let fontFamily = params.get(`font-family`)
root.style.setProperty(`--font-family`, fontFamily)

let fontStyle = params.get(`font-style`)
root.style.setProperty(`--font-style`, fontStyle)

let fontSize = params.get(`font-size`)
root.style.setProperty(`--font-size`, fontSize)

// Misc
let imageSize = params.get(`image-size`) || `8em`
root.style.setProperty(`--image-size`, imageSize)
root.style.setProperty(`--image-size-minus`, `-` + imageSize)

let borderRadiusAlbumCover = params.get(`border-radius-album-cover`)
root.style.setProperty(`--border-radius-album-cover`, borderRadiusAlbumCover)

let borderRadiusTextsBackground = params.get(`border-radius-texts-background`)
root.style.setProperty(`--border-radius-texts-background`, borderRadiusTextsBackground)

// Colors
let colorPrimary = params.get(`color-primary`)
root.style.setProperty(`--color-primary`, colorPrimary)

let colorAccent = params.get(`color-accent`)
root.style.setProperty(`--color-accent`, colorAccent)

// Background
let background = params.get(`background`)
root.style.setProperty(`--background`, background)

let altBackgroundColor = params.get(`alt-background`)
root.style.setProperty(`--alt-background`, altBackgroundColor)
