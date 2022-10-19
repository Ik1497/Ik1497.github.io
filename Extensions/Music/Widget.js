function width() {
    document.body.classList.add("small")
}

function small() {
    document.body.classList.remove("small")
}

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
  console.log(event.data);
  var artist = data.data?.artistName;
  //console.log(artist);
  var song = data.data?.songName;
  //console.log(song);
  var album = data.data?.thumbNail;
  //console.log(album);
  var duration = data.data?.durationMs;
  //console.log(album);
  update(artist, song, album, duration);
});

function update(artist, song, album, duration) {
  document.querySelector(".description").innerHTML = artist || "Helynt GameChops";
  document.querySelector(".title").innerHTML = song || "Continue";
  document.querySelector(".album-cover").src = album || "./photo.png";
  document.querySelector(".end-time").innerHTML = duration || "2:53";
}
