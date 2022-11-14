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
      document.querySelector("body").insertAdjacentHTML(`afterbegin`, `<ul class="notifications"></ul>`)
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;

      var data = JSON.parse(event.data);
      var chatMessage = data.data.message.message;
      var chatDisplayName = data.data.message.displayName;
      var chatColor = data.data.message.color;
      if (chatColor === undefined) { chatColor = "#f08080"}
      var broadcasterEventSource = data.event.source;
      var broadcasterEventType = data.event.type;

      /// CHAT MESSAGE ///
      if (broadcasterEventType === "ChatMessage") {
        document.querySelector("ul.notifications").insertAdjacentHTML(`afterbegin`, `<li class="animated fadeInRight"><img src="https://static-cdn.jtvnw.net/jtv_user_pictures/f273242c-5693-4196-baf8-070b30453096-profile_image-300x300.png"><div class="notification-content"><div class="description"><span class="pre-description" style="color: ` + chatColor + `;">` + chatDisplayName +`</span>` + chatMessage + `</div></div></li>`)
        console.log(broadcasterEventSource + ` chat message received from: "` + chatDisplayName + `" with the message: "` + chatMessage + `"`)
      }
    });
  }
}
