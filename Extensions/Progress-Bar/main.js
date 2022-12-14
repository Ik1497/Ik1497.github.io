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

function add(id, title, maximum) {
  if (id === undefined || title === undefined || maximum === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id, string: title, number: maximum)"; }
  document.body.insertAdjacentHTML(`afterbegin`, `<div id="${id}" class="container"><p class="start-goal">0</p><div class="progress-bar"></div><div class="goal-title-container"><p class="goal-title">${title}</p></div><p class="end-goal">${maximum}</p><p class="progress-text">0%</p></div>`);
  return "Adding Widget";
}

function remove(id) {
  if (id === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id)"; }
  document.getElementById(id).parentNode.removeChild(document.getElementById(id));
  return "Removing Widget";
}

function update(id, value) {
  if (id === undefined || value === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id, number: value)"; }
  document.getElementById(id).querySelector(".start-goal").innerHTML = value;

  let maximum = document.getElementById(id).querySelector(".end-goal").innerHTML;
  document.getElementById(id).querySelector(".progress-bar").style.width = `${value / maximum * 100}%`;

  if (value >= maximum) {
    finish(id, value, maximum);
  }
  return "Updating Widget";
}

function finish(id) {
  let title   = document.getElementById(id).querySelector(`.goal-title`).innerHTML;
  let maximum = document.getElementById(id).querySelector(`.end-goal`).innerHTML;
  let value   = document.getElementById(id).querySelector(`.start-goal`).innerHTML;


  document.getElementById(id).insertAdjacentHTML(`beforeend`, `<p class="goal-finished">${title} Finished!!!</p>`);

  setTimeout(() => {
    console.log("Removing Widget")
  }, 3000);

  return "Finsihed Widget Goal";
}