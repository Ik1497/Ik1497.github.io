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
            General: ["Custom"],
          },
          id: "123",
        })
      )
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot")
      document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<ul class="Mute-Indicator"></ul>`)
    }

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return }
      let widget = data.data?.widget
      if (widget != "mute-indicator") return

      let sourceName = data.data?.sourceName
      if (sourceName === undefined) return

      let muted = data.data?.muted
      if (muted === undefined) return

      const params = new URLSearchParams(window.location.search)
      let exclude = params.get("exclude")
      if (exclude != undefined) {
        if (exclude.indexOf(sourceName) !== -1) {
          return
        }
      }

      let include = params.get("include")
      if (include != undefined) {
        if (!include.includes(sourceName)) {
          return
        }
      }

      if (muted === "True") {
        addMute(sourceName)
      }
      if (muted === "False") {
        removeMute(sourceName)
      }
    })
  }
}

function addMute(sourceName) {
  var muteSourceHtml = '<li class="animated fadeInLeft wait-ps2" id="' + sourceName + '"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980.000000 778.000000" preserveAspectRatio="xMidYMid meet"><g class="mute-indicator-image" transform="translate(0.000000,778.000000) scale(0.100000,-0.100000)" fill="var(--font-color)" stroke="none"><path d="M4954 7747 c-35 -18 -128 -91 -219 -172 -88 -77 -261 -230 -385 -340 -124 -110 -354 -312 -510 -450 -370 -326 -671 -592 -1019 -900 l-283 -250 -1131 -5 -1132 -5 -60 -29 c-84 -42 -142 -99 -181 -180 l-34 -69 0 -1457 0 -1456 31 -60 c44 -81 110 -147 183 -181 l61 -28 1124 -3 1125 -2 30 -24 c17 -13 119 -101 226 -197 108 -96 249 -221 315 -279 66 -58 199 -175 295 -260 97 -85 303 -267 459 -405 157 -137 366 -322 465 -410 675 -599 649 -580 801 -580 78 0 98 4 151 28 73 34 142 101 181 177 l28 55 0 3625 0 3625 -28 61 c-34 74 -92 132 -171 173 -54 29 -65 31 -160 31 -94 -1 -105 -3 -162 -33z"/><path d="M6455 6047 c-109 -37 -186 -104 -233 -205 -23 -49 -27 -70 -27 -147 0 -146 -9 -132 449 -681 110 -131 236 -282 280 -334 44 -52 152 -182 240 -289 89 -107 205 -246 258 -309 l97 -115 -26 -31 c-14 -17 -56 -67 -92 -111 -76 -92 -352 -423 -421 -505 -49 -58 -363 -434 -565 -678 -210 -252 -231 -293 -223 -426 9 -136 78 -240 202 -304 66 -34 77 -37 161 -37 79 0 97 4 148 28 32 16 71 40 87 53 16 14 293 342 616 729 323 387 591 702 596 699 4 -3 61 -70 126 -148 118 -144 476 -574 562 -676 26 -30 129 -154 229 -275 281 -338 274 -331 354 -373 67 -34 78 -37 162 -37 79 0 97 3 150 29 84 42 142 99 181 180 31 62 34 78 34 156 0 75 -4 94 -29 146 -20 41 -223 291 -663 819 l-635 761 634 759 c432 519 642 779 663 820 27 54 30 70 30 151 0 83 -3 97 -31 150 -42 81 -109 147 -183 181 -53 24 -73 28 -151 28 -78 0 -98 -4 -151 -28 -82 -38 -68 -22 -529 -577 -65 -79 -183 -220 -425 -510 -53 -63 -149 -179 -214 -258 -96 -115 -122 -141 -131 -130 -7 7 -271 324 -587 703 -317 380 -588 702 -604 717 -16 15 -56 39 -89 54 -71 33 -186 42 -250 21z"/></g></svg><p class="sourceName">' + sourceName + "</p></li>"
  document.querySelector("ul").insertAdjacentHTML("beforeend", muteSourceHtml)
  console.log(`Adding ${sourceName}`)
}

function removeMute(sourceName) {
  console.log(`Removing ${sourceName}`)
  document.getElementById(sourceName).classList.add("fadeOutRight")
  setTimeout(function () {
    document.getElementById(sourceName).parentNode.removeChild(document.getElementById(sourceName))
  }, 1000)
}

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

// Gap
let gapHeight = params.get("gap-height")
root.style.setProperty("--gap-height", gapHeight)

let gapWidth = params.get("gap-width")
root.style.setProperty("--gap-width", gapWidth)

// Chip
let chipBackground = params.get("chip-background")
root.style.setProperty("--chip-background", chipBackground)

let chipBorderRadius = params.get("chip-border-radius")
root.style.setProperty("--chip-border-radius", chipBorderRadius)

// Theme
let theme = params.get("theme")

if (theme === "big") {
  document.body.setAttribute("data-theme", "big")
}
else {
  console.log("Theme unknown")
}
