// -------------- //
// Websocket Code //
// -------------- //

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
      const args = data?.data?.args
      const request = args?.request

      if (data?.data?.widget != "timer") return
      if (args === undefined) return
      if (request === undefined) return

      console.log(data)
      
      switch (request) {
        case `start`:
          if (args?.duration != undefined) start(args?.duration)
          break
        case `stop`:
          stop()
          break
        case `set-relative-duration`:
          if (args?.duration != undefined) setRelativeDuration(args?.duration)
          break
        case `set-duration`:
          if (args?.duration != undefined) setDuration(args?.duration)
          break
        case `pause`:
          pause()
          break
        case `unpause`:
          unpause()
          break
        case `toggle-pause`:
          togglePause()
          break
      }

      function start(duration) {
        if (document.querySelector(`.container`) != null) {
          unpause()
          return
        }
        document.body.insertAdjacentHTML(`afterbegin`, `<div class="container"><div class="timer-wrapper"><p class="timer-text">0:00</p></div></div>`);

        let normalTimeMinutes = Math.floor(duration / 60);
        let normalDuration = Math.round(duration - (normalTimeMinutes * 60))
      
        if (normalDuration < 10) normalDuration = "0" + normalDuration
        let normalTime = `${normalTimeMinutes}:${normalDuration}`
      
        let durationMinus = duration - 1
        let minusTimeMinutes = Math.floor(durationMinus / 60)
        let minusDuration = Math.round(durationMinus - (minusTimeMinutes * 60))
      
        if (minusDuration < 10) minusDuration = "0" + minusDuration
        let minusTime = `${minusTimeMinutes}:${minusDuration}`
        
        document.querySelector(".timer-text").innerHTML = normalTime

        let intervalTime
        let timerInterval = setInterval(() => {
          if (document.querySelector(`.container`) != null && document.querySelector(`.timer-wrapper`).dataset.stopped === undefined && document.querySelector(`.timer-wrapper`).dataset.paused === undefined) {
            if (document.querySelector(`.timer-wrapper`).dataset.duration === undefined) document.querySelector(`.timer-wrapper`).dataset.duration = duration
            document.querySelector(`.timer-wrapper`).dataset.duration = parseInt(document.querySelector(`.timer-wrapper`).dataset.duration) - 1 
            let durationInterval = parseInt(document.querySelector(`.timer-wrapper`).dataset.duration)
            
            let intervalTimeMinutes = Math.floor(durationInterval / 60);
            let intervalDuration = Math.round(durationInterval - (intervalTimeMinutes * 60));
          
            if (intervalDuration < 10) {intervalDuration = "0" + intervalDuration;}
            intervalTime = `${intervalTimeMinutes}:${intervalDuration}`;
            
            
            document.querySelector(".timer-text").innerHTML = intervalTime;
        
            if (durationInterval < 1) {
              document.querySelector(".timer-text").innerHTML = "0:00";
              clearInterval(timerInterval);
              stop();
            }
          }
        }, 1000);
        if (document.querySelector(`.container`) === null) clearInterval(timerInterval)
      }

      if (document.querySelector(`.container`) === null) return

      function pause() {
        document.querySelector(`.timer-wrapper`).dataset.paused = ``
      }

      function unpause() {
        document.querySelector(`.timer-wrapper`).dataset.paused = ``
        document.querySelector(`.timer-wrapper`).removeAttribute(`data-paused`)
      }

      function togglePause() {
        document.querySelector(`.timer-wrapper`).toggleAttribute(`data-paused`)
      }

      function setDuration(duration) {
        document.querySelector(`.timer-wrapper`).dataset.duration = parseInt(duration)
      }

      function setRelativeDuration(duration) {
        setDuration(parseInt(document.querySelector(`.timer-wrapper`).dataset.duration) + parseInt(duration))
      }

      function stop() {
        document.querySelector(`.timer-wrapper`).dataset.stopped = ``
        setTimeout(function () {
          document.querySelector('.container').classList.add('center-animation'); 

          setTimeout(function () {
            document.querySelector(".container").classList.add("center");

            setTimeout(function () {
              document.querySelector(".container").classList.add("off-animation");

              setTimeout(function () {
                document.querySelector(".container").remove()
                location.reload()

              }, animationDuration);
            }, animationDuration * 3);
          }, animationDuration / 2);
  
        }, 1000);   
      }
    });
  }
}

// -------------- //
// URL parameters //
// -------------- //
// General
const params = new URLSearchParams(window.location.search);
var root = document.querySelector(":root");

// Font
let fontFamily = params.get("font-family");
root.style.setProperty("--font-family", fontFamily);

let fontWeight = params.get("font-weight");
root.style.setProperty("--font-weight", fontWeight);

let fontStyle = params.get("font-style");
root.style.setProperty("--font-style", fontStyle);

let fontSize = params.get("font-size");
root.style.setProperty("--font-size", fontSize);

let fontColor = params.get("font-color");
root.style.setProperty("--font-color", fontColor);

// timer
let timerBackground = params.get("timer-background");
root.style.setProperty("--timer-background", timerBackground);

let timerBorderRadius = params.get("timer-border-radius");
root.style.setProperty("--timer-border-radius", timerBorderRadius);

let timerSpacing = params.get("timer-spacing");
root.style.setProperty("--timer-spacing", timerSpacing);

let timerPadding = params.get("timer-padding");
root.style.setProperty("--timer-padding", timerPadding);

let timerMinimumWidth = params.get("timer-minimum-width");
root.style.setProperty("--timer-minimum-width", timerMinimumWidth);

// Animation
let animationDuration = params.get("animation-duration") || 2000;
root.style.setProperty("--animation-duration", animationDuration + "ms");

let animationScaledSize = params.get("animation-scaled-size");
root.style.setProperty("--animation-scaled-size", animationScaledSize);
