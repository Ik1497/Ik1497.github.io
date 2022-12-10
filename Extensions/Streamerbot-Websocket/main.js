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
          request: "GetEvents",
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.body.insertAdjacentHTML(`beforeend`, `<nav class="nav"><ul class="nav-list"></ul></nav>`);
      document.body.insertAdjacentHTML(`beforeend`, `<main><ul class="event-items"></ul></main>`);
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      console.log(data);

      // Get all keys e.g. twitch, youTube, etc.
      var keys = [];

      Object.keys(data.events).forEach(function (key) {
        if (keys.indexOf(key) == -1)
        {
          keys.push(key);
        }
      });

      keys.forEach(index => {
        // Adds all keys in nav
        document.querySelector(".nav-list").insertAdjacentHTML(`beforeend`, `<li class="nav-list-item group-${index}"><button>${index}</button></li>`);
        document.querySelector(`.group-${index}`).addEventListener("click", function(index) {
          // Event listener when someone clicks on a nav item
          let path = index.path[1];
          path.classList.forEach(index => {
            // Adds nav-active to the clicked nav item
            document.querySelectorAll(".nav-active").forEach(index => {
              // removes all previous nav-actibe classes
              document.querySelector(".nav-active").classList.remove("nav-active");
            });

            // Add the new nav-active class
            document.querySelector(`.${index}`).classList.add("nav-active");

            // Add main contents
            addMainContents(index);

          });
        });
      });

      function addMainContents(group) {
        if (group.includes("group-") === true) {
          document.querySelector(".event-items").parentNode.removeChild(document.querySelector(".event-items"))
          document.querySelector("main").insertAdjacentHTML(`beforeend`, `<ul class="event-items"></ul>`);
          group = group.replace("group-", "");
          
          data.events.streamlabs.forEach(index => {
            document.querySelector(".event-items").insertAdjacentHTML(`beforeend`, `<li class="event-item">${index}</li>`);
          });
        }
      }
    });
  }
}
