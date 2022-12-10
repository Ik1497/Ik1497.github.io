//////////////////////
/// Default Values ///
//////////////////////
var artistNameDefault = "for this widget to work!";
var songNameDefault = "Play a Song";
var albumArtDefault = "./placeholder.png";
var durationDefault = "N/A";

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl =
      new URLSearchParams(window.location.search).get("ws") ||
      "ws://localhost:8080/";
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
      var songName = data.data?.songName;
      var artistName = data.data?.artistName;
      var albumArt = data.data?.albumArt;
      var duration = data.data?.duration;
      var durationIncludes = duration.includes(":");

      if (durationIncludes != true) {
        var durationSeconds = duration / 1000;
        var durationMinutes = durationSeconds / 60;
        var durationSecondsRounded = Math.floor(
          (durationMinutes - Math.floor(durationMinutes)) * 60
        );
        var durationMinutesRounded = Math.floor(durationMinutes);

        duration = durationMinutesRounded + ":" + durationSecondsRounded;
      }

      if (songName === undefined) return;
      if (artistName === undefined) return;
      if (albumArt === undefined) return;

      if (songName === "") return;
      if (artistName === "") return;
      if (albumArt === "") return;

      update(songName, artistName, albumArt, duration);
    });
  }
}

function update(songName, artistName, albumArt, duration) {
  document.querySelector(".artistName").innerHTML =
    artistName || artistNameDefault;
  document.querySelector(".songName").innerHTML = songName || songNameDefault;
  document.querySelector(".album-cover").src = albumArt || albumArtDefault;
  document.querySelector(".end-time").innerHTML = duration || durationDefault;
  refreshAlbumCover();
  widgetAnimation();
}

//////////////////////
/// Animation Code ///
//////////////////////
function widgetAnimation() {
  let sizeDelay =
    new URLSearchParams(window.location.search).get("size-delay") || 8000;
  console.log(sizeDelay);
  document.body.classList.remove("small");
  setTimeout(function () {
    document.body.classList.add("small");
  }, sizeDelay);
  console.log("Animated successfully");
}

////////////////////////////
/// Image Refresh Issues ///
////////////////////////////

function refresh(node) {
  var times = 3000;

  (function startRefresh() {
    var address;
    if (node.src.indexOf("?") > -1) address = node.src.split("?")[0];
    else address = node.src;
    node.src = address + "?time=" + new Date().getTime();
  })();
}

function refreshAlbumCover() {
  var node = document.querySelector(".album-cover");
  refresh(node);
}

//////////////////////
/// URL Parameters ///
//////////////////////

/// General ///
var root = document.querySelector(":root");
const params = new URLSearchParams(window.location.search);

/// Transition ///
let transitionTime = params.get("transition-time");
root.style.setProperty("--transition-time", transitionTime);
let transitionTimingFunction = params.get("transition-timing-function");
root.style.setProperty(
  "--transition-timing-function",
  transitionTimingFunction
);

/// Background ///
let backgroundOpacity = params.get("background-opacity");
root.style.setProperty("--background-opacity", backgroundOpacity);
let backgroundHue = params.get("background-hue");
root.style.setProperty("--background-hue", backgroundHue);
let backgroundSaturation = params.get("background-saturation");
root.style.setProperty("--background-saturation", backgroundSaturation);
let backgroundLightness1 = params.get("background-lightness1");
root.style.setProperty("--background-lightness1", backgroundLightness1);
let backgroundLightness2 = params.get("background-lightness2");
root.style.setProperty("--background-lightness2", backgroundLightness2);
let altBackgroundColor = params.get("alt-background-color");
root.style.setProperty("--alt-background-color", altBackgroundColor);

/// Font ///
let fontFamily = params.get("font-family");
root.style.setProperty("--font-family", fontFamily);
let colorPrimary = params.get("color-primary");
root.style.setProperty("--color-primary", colorPrimary);
let colorAccent = params.get("color-accent");
root.style.setProperty("--color-accent", colorAccent);

// Sizing ///
let canvasSpacing = params.get("canvas-spacing");
root.style.setProperty("--canvas-spacing", canvasSpacing);
let height = params.get("height");
root.style.setProperty("--height", height);
let width = params.get("width");
root.style.setProperty("--width", width);
let borderRadius = params.get("border-radius");
root.style.setProperty("--border-radius", borderRadius);
let heightSmall = params.get("height-small");
root.style.setProperty("--height-small", heightSmall);
let borderRadiusSmall = params.get("border-radius-small");
root.style.setProperty("--border-radius-small", borderRadiusSmall);

// Visibility
let progressBarHidden = params.get("progress-bar-hidden");
if (progressBarHidden === "") {
  root.style.setProperty("--progress-bar-visibility", "none");
}
