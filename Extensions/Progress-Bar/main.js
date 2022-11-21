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
            general: ["Custom"]
          },
          id: "123",
        })
      );
      console.log("Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;

      var data = JSON.parse(event.data);

      var hypeTrainEventType = data.event.type;

    })
  }
}
