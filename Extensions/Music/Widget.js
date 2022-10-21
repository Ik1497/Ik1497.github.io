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
  var title = data.data?.title;
  var description = data.data?.description;
  var image = data.data?.image;
  var duration = data.data?.duration;
  update(title, description, image, duration);
  widgetAnimation();
});

function update(title, description, image, duration) {
  document.querySelector(".description").innerHTML =
  description || "for this widget to work!";
  document.querySelector(".title").innerHTML = title || "Play a Song";
  document.querySelector(".album-cover").src = image || "./placeholder.png";
  document.querySelector(".end-time").innerHTML = duration || "N/A";
}

//////////////////////
/// Animation Code ///
//////////////////////

function widgetAnimation() {
  document.body.classList.remove("small");
  setTimeout(function () {
    document.body.classList.add("small");
  }, 8000);
}

////////////////
/// URL code ///
////////////////

/// General ///
var root = document.querySelector(":root");
const params = new URLSearchParams(window.location.search);

/// Transition ///
let transitionTime = params.get("transition-time");
root.style.setProperty("--transition-time", transitionTime);
let transitionTimingFunction = params.get("transition-timing-function");
root.style.setProperty("--transition-timing-function", transitionTimingFunction);

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
