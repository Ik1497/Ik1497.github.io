//////////////////////
/// Default Values ///
//////////////////////
let artistNameDefault = "for this widget to work!";
let songNameDefault = "Play a Song";
let albumArtDefault = "./placeholder.png";

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
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
      var songName = data.data?.songName;
      var artistName = data.data?.artistName;
      var albumArt = data.data?.albumArt;

      if (songName === undefined) return;
      if (artistName === undefined) return;
      if (albumArt === undefined) return;

      if (songName === "") return;
      if (artistName === "") return;
      if (albumArt === "") return;

      update(songName, artistName, albumArt);
    });
  }
}

function update(songName, artistName, albumArt) {
  document.querySelector(".artistName").innerHTML =
    artistName || artistNameDefault;
  document.querySelector(".songName").innerHTML = songName || songNameDefault;
  document.querySelector(".album-cover").src = albumArt || albumArtDefault;

  console.log(
    'Updated data, song name: "' +
      songName +
      '", artist name: "' +
      artistName +
      '"'
  );
  refreshAlbumCover();
  widgetAnimation();
}
//////////////////////
/// Animation Code ///
//////////////////////
var sizeDelay = 8000;

function widgetAnimation() {
  document.body.classList.remove("hidden");
  setTimeout(function () {
    document.body.classList.add("hidden");
    console.log("Animated succesfully");
  }, sizeDelay);
}

////////////////////////////
/// Image Refresh Issues ///
////////////////////////////

function refresh(node) {
  var times = 3000; // gap in Milli Seconds;

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
