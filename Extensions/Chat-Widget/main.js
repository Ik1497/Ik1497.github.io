//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
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
            Twitch: ["ChatMessage"],
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.querySelector("body").insertAdjacentHTML(`afterbegin`, `<ul class="messages"></ul>`)
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };
      
      console.log(data);
      var chatMessage = data.data.message.message;
      var chatDisplayName = data.data.message.displayName;
      var chatId = data.data.message.msgId;
      var chatColor = data.data.message.color;
      if (chatColor === undefined) { chatColor = "#f08080"}
      var broadcasterEventSource = data.event.source;
      var broadcasterEventType = data.event.type;

      /// CHAT MESSAGE - TWITCH ///
      if (broadcasterEventType === "ChatMessage") {
        // // GET PROFILE PICTURE
        // var profilePictureUrl;
        // fetch('https://decapi.me/twitch/avatar/MisschienIkBOT')
        //   .then(data => {
        //     profilePictureUrl = data;
        //     console.log(profilePictureUrl);
        //   });
        // Default
        document.querySelector("ul.messages").insertAdjacentHTML(`afterbegin`, `<li id="` + chatId + `" class="animated fadeInRight"><img src="https://static-cdn.jtvnw.net/jtv_user_pictures/f273242c-5693-4196-baf8-070b30453096-profile_image-300x300.png"><div class="message-content"><div class="description"><span class="pre-description" style="color: ` + chatColor + `;">` + chatDisplayName +`</span><span class="post-description">` + chatMessage + `</span></div></div></li>`)
        console.log(broadcasterEventSource + ` chat message received from: "` + chatDisplayName + `" with the message: "` + chatMessage + `"`)
        for (var i = 0; i < data.data.message.badges.length; i++) {
          var badges = data.data.message.badges[i];
          document.querySelector(".pre-description").insertAdjacentHTML(`afterbegin`, `<img src="` + badges.imageUrl + `" alt="` + badges.name + `">`);
        }

        // Extras
        var chatIsMe = data.data.message.isMe;
        if (chatIsMe === true) { 
          document.querySelector(".post-description").style.fontStyle = "italic";
        }
      }
    });
  }
}
