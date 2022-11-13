///////////////////
/// GET ACTIONS ///
///////////////////

connectws();

function connectws(action) {
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
          request: "GetActions",
          id: "123",
        })
      );
      console.log("Connected to Streamer.bot");
    };
    ws.addEventListener("message", (event) => {
      if (action === undefined) {
        if (!event.data) return;
        var data = JSON.parse(event.data);
        document.querySelector("body").insertAdjacentHTML("afterbegin" , `<header><p class="action-count">` + data.count + ` Actions</p></header>`);
        console.log(data);
        document
          .querySelector("body")
          .insertAdjacentHTML("beforeend", '<ul id="actions"></ul>');
        for (var i = 0; i < data.actions.length; i++) {
          var actions = data.actions[i];
          document
            .getElementById("actions")
            .insertAdjacentHTML(
              "beforeend",
              `<li onclick="var action = '` + actions.name + `'; connectws(action);" id="` + actions.id + `">` + actions.name + `<p class="group">` + actions.group + `</p><span class="tooltip">` + actions.id + `</span></li>`
            );
            if (actions.enabled === false) {
              document.getElementById(actions.id).classList.add("disabled");
            }
        }
      }
      else {
        // ws.send(
        //   JSON.stringify({
        //     request: "DoAction",
        //     action: {
        //       name: action
        //     },
        //     id: "123",
        //   })
        // );
        console.log('Running action: "' + action + '"... (SOON)');
      }
    });
  }
}