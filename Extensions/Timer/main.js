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
      if (!event.data) return;
      const data = JSON.parse(event.data);
      console.log(data);

      if (data?.data?.widget != "timer") return;

      let eventType = data?.data?.eventType;
      let duration = data?.data?.duration;

      let timeSeconds = duration

      if (eventType === "start") {
        if (document.querySelector(`.container`) != null) return
        document.body.insertAdjacentHTML(`afterbegin`, `<div class="container"><div class="timer-wrapper"><p class="timer-text">0:00</p></div></div>`);

        let normalTimeMinutes = Math.floor(timeSeconds / 60);
        let normalTimeSeconds = Math.round(timeSeconds - (normalTimeMinutes * 60));
      
        if (normalTimeSeconds < 10) {normalTimeSeconds = "0" + normalTimeSeconds;}
        let normalTime    = `${normalTimeMinutes}:${normalTimeSeconds}`;
      
        let timeSecondsMinus = timeSeconds - 1
        let minusTimeMinutes = Math.floor(timeSecondsMinus / 60);
        let minusTimeSeconds = Math.round(timeSecondsMinus - (minusTimeMinutes * 60));
      
        if (minusTimeSeconds < 10) {minusTimeSeconds = "0" + minusTimeSeconds;}
        let minusTime    = `${minusTimeMinutes}:${minusTimeSeconds}`;
        
        document.querySelector(".timer-text").innerHTML = normalTime;

        let timeSecondsInterval = timeSeconds;
        
        let intervalTime;
        let timerInterval = setInterval(() => {
          if (document.querySelector(`.container`) != null && document.querySelector(`.timer-wrapper`).getAttribute(`data-paused`) === null && document.querySelector(`.timer-wrapper`).getAttribute(`data-stopped`) === null) {
            timeSecondsInterval = timeSecondsInterval - 1;
            
            let intervalTimeMinutes = Math.floor(timeSecondsInterval / 60);
            let intervalTimeSeconds = Math.round(timeSecondsInterval - (intervalTimeMinutes * 60));
          
            if (intervalTimeSeconds < 10) {intervalTimeSeconds = "0" + intervalTimeSeconds;}
            intervalTime = `${intervalTimeMinutes}:${intervalTimeSeconds}`;
            
            
            document.querySelector(".timer-text").innerHTML = intervalTime;
        
            if (timeSecondsInterval < 1) {
              document.querySelector(".timer-text").innerHTML = "0:00";
              clearInterval(timerInterval);
              stop();
            }
          }
        }, 1000);
        if (document.querySelector(`.container`) === null) clearInterval(timerInterval)
      };

      if (document.querySelector(`.container`) === null) return

      if (eventType === "pause") {
        document.querySelector(`.timer-wrapper`).setAttribute(`data-paused`, ``)
      };
      
      if (eventType === "unpause") {
        document.querySelector(`.timer-wrapper`).setAttribute(`data-paused`, ``)
        document.querySelector(`.timer-wrapper`).removeAttribute(`data-paused`)
      };

      if (eventType === "togglepause") {
        document.querySelector(`.timer-wrapper`).toggleAttribute(`data-paused`)
      };

      if (eventType === "stop") {
        stop()
      };

      function stop() {
        document.querySelector(`.timer-wrapper`).setAttribute(`data-stopped`, ``)
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
