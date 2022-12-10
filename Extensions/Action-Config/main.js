GetActions();

function GetActions() {
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
          request: "GetActions",
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<main><ul class="Actions"></ul><main>`);
      document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<nav><ul class="Actions-Nav"></ul></nav>`);
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      console.log(data);

      data.actions.forEach(index => {
        let group = index.group;

        document.querySelector(".Actions-Nav").insertAdjacentHTML(`beforeend`, `<li class="group group-${index.group}"><button onclick="ChangeMain('${index.group}')">${index.group}</button></li>`);
        console.log(index);
      });
    });
  }
}