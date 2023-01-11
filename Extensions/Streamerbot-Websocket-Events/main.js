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
      console.log(data, JSON.stringify(data))
      // Get all keys e.g. twitch, youTube, etc.
      var keys = [];

      Object.keys(data.events).forEach(function (key) {
        if (keys.indexOf(key) == -1)
        {
          keys.push(key);
        }
      });

      keys.sort()

      keys.forEach(index => {
        // Adds all keys in nav
        document.querySelector(".nav-list").insertAdjacentHTML(`beforeend`, `<li class="nav-list-item"><button>${index}</button></li>`);
      });

      document.querySelectorAll(`nav.nav .nav-list .nav-list-item button`).forEach(button => {
        button.addEventListener("click", function (index) {
          // Event listener when someone clicks on a nav item
          button.parentNode.classList.forEach(click => {
            // Adds nav-active to the clicked nav item
            document.querySelectorAll(".nav-active").forEach(item => {
              // removes all previous nav-actibe classes
              item.classList.remove("nav-active")
            });
  
            
          });
          // Add the new nav-active class
          button.parentNode.classList.add("nav-active");

          // Add main contents
          addMainContents(button);
        });
      });

      function addMainContents(group) {
          document.querySelector(".event-items").innerHTML = ``
          let entries = Object.entries(data.events)
          console.log(entries)
          let eventItems = []
          entries.forEach(entry => {
            if (entry[0] === group.innerHTML) {
              eventItems = entry[1]
            }
          });
          eventItems.forEach(item => {
            document.querySelector(".event-items").insertAdjacentHTML(`beforeend`, `<li class="event-item">${item}</li>`);
          });
        }
    });
  }
}
