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
            raw: [
                "Action"
              ]
            },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.body.insertAdjacentHTML(`beforeend`, `<nav class="nav"><ul class="nav-list"></ul></nav>`);
      document.body.insertAdjacentHTML(`beforeend`, `<main></main>`);
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };
      console.log(data);

      let timestamp = event.timeStamp.toHHMMSS()

      document.querySelector(`.nav-list`).insertAdjacentHTML(`afterbegin`, `<li class="nav-list-item" data-nav-action="${data.data?.name}" data-nav-timestamp="${timestamp}"><button><p class="Action-Name">${data.data?.name}</p><p class="Action-Timestamp">${event.timeStamp.toHHMMSS()}</p></button></li>`);

      document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `<section data-action="${data.data?.name}" data-timestamp="${timestamp}" hidden><h1>${data.data?.name}</h1><p class="subtitle">${timestamp}</p><table><tbody></tbody></table></section>`);

      const entries = Object.entries(data.data?.arguments);

      entries.forEach(index => {
        document.querySelector(`section[data-action="${data.data?.name}"][data-timestamp="${timestamp}"] table tbody`).insertAdjacentHTML(`beforeend`, `<tr><td class="key" style="text-align: right;">${index[0]}</td><td class="value" style="text-align: left;">${index[1]}</td></tr>`);
      });
        // Nav Buttons
        let liQuery = `.nav .nav-list li[data-nav-action="${data.data?.name}"][data-nav-timestamp="${timestamp}"]`
        document.querySelector(liQuery).addEventListener("click", function(index) {
          // Event listener when someone clicks on a nav item

          // Removes all previous nav-active classes
          document.querySelectorAll(".nav-active").forEach(index => {
            document.querySelector(".nav-active").classList.remove("nav-active");
          });

          // Make previous hidden
          document.querySelectorAll(`section:not([hidden])`).forEach(index => {
            document.querySelector(`section[data-action="${index.getAttribute("data-action")}"][data-timestamp="${index.getAttribute("data-timestamp")}"]`).setAttribute(`hidden`, ``);
          });


          // Adds nav-active class to the clicked item
          document.querySelector(liQuery).classList.add("nav-active");
          document.querySelector(`section[data-action="${data.data?.name}"][data-timestamp="${timestamp}"]`).removeAttribute(`hidden`);
          document.title = `${data.data?.name} | Streamer.bot Action History | Streamer.bot Actions`;
        });
    });
  }
}


Number.prototype.toHHMMSS = function () {
  let hours   = new Date().getHours()
  let minutes = new Date().getMinutes()
  let seconds = new Date().getSeconds()
  let milliseconds = new Date().getMilliseconds()

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  let time    = `${hours}:${minutes}:${seconds}:${milliseconds}`;
  return time;
};