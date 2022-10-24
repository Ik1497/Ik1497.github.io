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
const ws = new WebSocket("ws://127.0.0.1:8080/");
ws.addEventListener("open", (event) => {
  console.log("Connected to Streamer.bot");
  ws.send(
    JSON.stringify({
      request: "Subscribe",
      id: "123",
      events: {
        general: ["Custom"],
      },
    })
  );
});

ws.addEventListener("message", (event) => {
  if (!event.data) return;

  const data = JSON.parse(event.data);
  var songName = data.data?.songName;
  var artistName = data.data?.artistName;
  var albumArt = data.data?.albumArt;
  var duration = data.data?.duration;
  update(songName, artistName, albumArt, duration);
  if (songName != undefined) {widgetAnimation();}
});

function update(songName, artistName, albumArt, duration) {
  document.querySelector(".artistName").innerHTML =
    artistName || artistNameDefault;
  document.querySelector(".songName").innerHTML = songName || songNameDefault;
  document.querySelector(".album-cover").src = albumArt || albumArtDefault;
  document.querySelector(".end-time").innerHTML = duration || durationDefault;
}

////////////////
/// URL code ///
////////////////

/// General ///
var root = document.querySelector(":root");
const params = new URLSearchParams(window.location.search);

/// Transition ///
let sizeDelay = params.get("size-delay") || 8000;
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
if (progressBarHidden === "") {root.style.setProperty("--progress-bar-visibility", "none");}

//////////////////////
/// Animation Code ///
//////////////////////
function widgetAnimation() {
  document.querySelector(".default").classList.remove("small");
  setTimeout(function () {
    document.querySelector(".default").classList.add("small");
  }, sizeDelay);
  console.log("Animated succesfully");
}