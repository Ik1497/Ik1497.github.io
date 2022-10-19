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
  update(artist, song, album);
});

function update(artist, song, album) {
  document.querySelector(".description").innerHTML = artist;
  document.querySelector(".title").innerHTML = song;
  document.querySelector(".album-cover").src = album;
  fitty("p");
}
fitty("p");
