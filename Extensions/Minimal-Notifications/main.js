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
            Twitch: ["ChatMessage"],
          },
          id: "123",
        })
      );
      console.log("Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;

      var data = JSON.parse(event.data);
      console.log(data);
      var dataEvent = JSON.parse(data.event);
      console.log(dataEvent);
      var dataData = JSON.parse(data.data);
      console.log(dataData);
    });
  }
}
