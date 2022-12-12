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

      var widget = data.data.widget;
      var timerEventType = data.data.eventType;

      if (timerEventType === "timer-started") {
        var timerDuration = data.data.duration;
      };

      if (timerEventType === "timer-paused") {
        
      };

      if (timerEventType === "timer-stopped") {
        
      };
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


// ------------------ //
// ANIMATION SETTINGS //
// ------------------ //
function animateOff() {
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
};
