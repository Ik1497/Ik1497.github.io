// -------------- //
// Websocket Code //
// -------------- //

connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl =
      new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
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
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };
      console.log(data);

      let widget = data.data.widget;
      if (widget != "timer") return;

      let eventType = data.data.eventType;
      let duration = data.data.duration;

      if (eventType === "start") {
        create();
        start(duration);
      };

      if (eventType === "pause") {
        pause();
      };

      if (eventType === "stop") {
        stop();
      };

      function DoAction(action) {
        ws.send(
          JSON.stringify({
            request: "DoAction",
            action: {
              name: action
            },
            id: "123",
          })
        );
      }

      
      
      function stop() {
        console.log("Stopping Timer...");
        DoAction("Timer Finished | Timer Widget");

        setTimeout(function () {
          document.querySelector('.container').classList.toggle('center-animation'); 
          setTimeout(function () {
            document.querySelector(".container").classList.add("center");
          }, animationDuration / 2);

          setTimeout(function () {
            document.querySelector(".container").classList.add("off-animation");
          }, animationDuration * 5);

          setTimeout(function () {
            document.querySelector(".container").parentNode.removeChild(document.querySelector(".container"));
          }, animationDuration * 6);
        }, 1000);

      };      

      function create() {
        console.log("Creating Timer...");
        document.body.insertAdjacentHTML(`afterbegin`, `<div class="container"><div class="timer-wrapper"><p class="timer-text">0:00</p></div></div>`);
      }
      
      function start(timeSeconds) {
        console.log("Starting Timer...");
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

          timeSecondsInterval = timeSecondsInterval - 1;
          
          let intervalTimeMinutes = Math.floor(timeSecondsInterval / 60);
          let intervalTimeSeconds = Math.round(timeSecondsInterval - (intervalTimeMinutes * 60));
        
          if (intervalTimeSeconds < 10) {intervalTimeSeconds = "0" + intervalTimeSeconds;}
          intervalTime    = `${intervalTimeMinutes}:${intervalTimeSeconds}`;
          
          document.querySelector(".timer-text").innerHTML = intervalTime;
      
          if (timeSecondsInterval < 1) {
            document.querySelector(".timer-text").innerHTML = "0:00";
            clearInterval(timerInterval);
            stop();
          }
        }, 1000);
      }
      
      function pause() {
        console.log("Pausing Timer...");
        clearInterval(timerInterval);
      }
    });
  }
}



// -------------- //
// URL Paramaters //
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

// Animation
let animationDuration = params.get("animation-duration") || 2000;
root.style.setProperty("--animation-duration", animationDuration + "ms");
