connectws();

function connectws() {
  if ("WebSocket" in window) {
    const ws = new WebSocket("ws://localhost:8080/");

    ws.onclose = function () {
      // "connectws" is the function we defined previously
      setTimeout(connectws, 10000);
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
    };

    ws.addEventListener("message", (event) => {
        console.log("Websocket Message Reveived...");
        if (!event.data) return;
      
        const data = JSON.parse(event.data);
        console.log(data);
        var widget = data.data?.widget;
        if (widget != "mute-indicator") return;
      
        var sourceName = data.data?.sourceName;
        if (sourceName === undefined) return;
      
        var muted = data.data?.muted;
        if (muted === undefined) return;
      
        if (muted === "True") {
          addMute(sourceName);
        }
        if (muted === "False") {
          removeMute(sourceName);
        }
        console.log(sourceName + ", " + muted);
      });
  }
}

function addMute(sourceName) {
//   var sourceName = "[A] Music";
  var muteSourceHtml =
    '<li class="animated fadeInDown wait-ps2" id="' +
    sourceName +
    '"><p class="sourceName">' +
    sourceName +
    "</p></li>";
  document.querySelector("ul").insertAdjacentHTML("beforeend", muteSourceHtml);
}

function removeMute(sourceName) {
//   var sourceName = "[A] Music";
  document
    .getElementById(sourceName)
    .parentNode.removeChild(document.getElementById(sourceName));
}
