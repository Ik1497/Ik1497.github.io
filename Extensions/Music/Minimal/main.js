//////////////////////
/// Default Values ///
//////////////////////
var artistNameDefault = "for this widget to work!";
var songNameDefault = "Play a Song";
var albumArtDefault = "./placeholder.png";

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
  update(songName, artistName, albumArt);
  if (songName != undefined) {widgetAnimation();}
});

function update(songName, artistName, albumArt) {
  document.querySelector(".artistName").innerHTML =
    artistName || artistNameDefault;
  document.querySelector(".songName").innerHTML = songName || songNameDefault;
  document.querySelector(".album-cover").src = albumArt || albumArtDefault;
}
//////////////////////
/// Animation Code ///
//////////////////////
var sizeDelay = 8000;

function widgetAnimation() {
  document.body.classList.remove("small");
  setTimeout(function () {
    document.body.classList.add("small");
  }, sizeDelay);
  console.log("Animated succesfully");
}