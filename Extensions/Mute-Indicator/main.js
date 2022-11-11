connectws();

function connectws() {
  if ("WebSocket" in window) {
    const ws = new WebSocket("ws://localhost:8080/");
    console.log("Trying to connect to Streamer.bot...");

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      console.log(
        "No connection found to Streamer.bot, reconnecting every 10s..."
      );
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
      console.log("Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;

      const data = JSON.parse(event.data);
      var widget = data.data?.widget;
      if (widget != "mute-indicator") return;

      var sourceName = data.data?.sourceName;
      if (sourceName === undefined) return;

      var muted = data.data?.muted;
      if (muted === undefined) return;

      const params = new URLSearchParams(window.location.search);
      let exclude = params.get("exclude");
      if (exclude != undefined) {
        if (exclude.indexOf(sourceName) !== -1) {
          console.log("Exluding " + exclude);
          console.log('"' + sourceName + '" excluded from widget');
          return;
        }
      }

      if (muted === "True") {
        addMute(sourceName);
      }
      if (muted === "False") {
        removeMute(sourceName);
      }
      console.log(
        'Event received with the source name: "' +
          sourceName +
          '", and the mute state: "' +
          muted +
          '"'
      );
    });
  }
}

function addMute(sourceName) {
  var muteSourceHtml =
    '<li class="animated fadeInLeft wait-ps2" id="' +
    sourceName +
    '"><img class="mute-indicator-image" src="./Mute-Indicator.svg" alt="Mute Indicator Image"><p class="sourceName">' +
    sourceName +
    "</p></li>";
  document.querySelector("ul").insertAdjacentHTML("beforeend", muteSourceHtml);
}

function removeMute(sourceName) {
  document.getElementById(sourceName).classList.add("fadeOutRight");
  setTimeout(function () {
    document
      .getElementById(sourceName)
      .parentNode.removeChild(document.getElementById(sourceName));
  }, 1000);
}

//////////////////////
/// URL Paramaters ///
//////////////////////
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

// Gap
let gapHeight = params.get("gap-height");
root.style.setProperty("--gap-height", gapHeight);

let gapWidth = params.get("gap-width");
root.style.setProperty("--gap-width", gapWidth);

// Chip
let chipBackground = params.get("chip-background");
root.style.setProperty("--chip-background", chipBackground);

let chipBorderRadius = params.get("chip-border-radius");
root.style.setProperty("--chip-border-radius", chipBorderRadius);