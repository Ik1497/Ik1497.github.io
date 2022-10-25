/**
 * Adding Websocket after the Page is fully loaded
 * This is only nessesary if you are processing other content first
 * and can be skiped if not needed
 */
window.addEventListener("load", (event) => {
  console.log("Page has been fully loaded");
  connectws();
});

/**
 * Connect to Websocket Server
 */
function connectws() {
  if ("WebSocket" in window) {
    console.log("Connecting to Streamer.Bot....");
    ws = new WebSocket("ws://localhost:8080/");
    bindEvents();
  }
}

/**
 * Binding Events after connecting to prevent Errors
 */
function bindEvents() {
  ws.onopen = function () {
    console.log("Connected. Binding Events...");

    // Subscribe here to the events you wanne listen to
    ws.send(
      JSON.stringify({
        request: "Subscribe",
        events: {
          raw: ["Action", "SubAction"],
          Custom: [],
        },
        id: "WebsocketDemo",
      })
    );
  };

  ws.onmessage = function (event) {
    // grab message and parse JSON
    const msg = event.data;
    const wsdata = JSON.parse(msg);

    console.debug(wsdata);

    if (wsdata.event == "Raw" && wsdata.event.type == "Action") {
      // Checking for Action names
      switch (wsdata.data.name) {
        case "Websocket Test":
          console.log("Websocket Test ran");
          break;
        default:
          console.log(wsdata.data.name);
      }
    }
  };

  // Catch Event code and try to reconnect
  ws.onclose = function (event) {
    console.log("Could not connect. Trying to reconnect...");
    setTimeout(connectws, 10000);
  };
}

///////////////////
/// Actual Code ///
///////////////////

getActions();

function getActions() {
  ws.send(
    JSON.stringify({
      request: "GetActions",
      id: "WSEGetActions",
    })
  );
}

console.log(JSON);