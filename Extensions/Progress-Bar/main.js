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
            General: ["Custom"]
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };

      var insertVariableHere = data.event.type;

    })
  }
}

function showWidget(id, title) {
  if (id === undefined || title === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id, string: title)"; }
  document.body.insertAdjacentHTML(`afterbegin`, `<div id="${id}" class="container"><p class="start-goal">0</p><div class="progress-bar"></div><div class="goal-title-container"><p class="goal-title">${title}</p></div><p class="end-goal">0</p><p class="progress-text">0%</p></div>`);
}

function removeWidget(id) {
  if (id === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id)"; }
  document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}
