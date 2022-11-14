///////////////////
/// GET ACTIONS ///
///////////////////

connectws();

function connectws(actionId, actionName) {
  if ("WebSocket" in window) {
    const ws = new WebSocket("ws://localhost:8080/");
    if (actionId === undefined || actionName === undefined) {
      console.log("Trying to connect to Streamer.bot...");
    }

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
      if (actionId === undefined || actionName === undefined) {
        console.log("Connected to Streamer.bot");
      }
    };
    ws.addEventListener("message", (event) => {
      if (actionId === undefined || actionName === undefined) {
        if (!event.data) return;
        var data = JSON.parse(event.data);
        document
          .querySelector("body")
          .insertAdjacentHTML(
            "afterbegin",
            `<header><p class="action-count">` +
              data.count +
              ` Actions</p></header>`
          );
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
              `<li onclick="var actionId = '` +
                actions.id +
                `'; var actionName = '` +
                actions.name +
                `'; connectws(actionId, actionName);" id="` +
                actions.id +
                `">` +
                actions.name +
                `<p class="group">` +
                actions.group +
                `</p><span class="tooltip">` +
                actions.id +
                `</span></li>`
            );
          if (actions.enabled === false) {
            document.getElementById(actions.id).classList.add("disabled");
          }
        }
      } else {
        // console.log(
        //   'Running action: "' +
        //     actionName +
        //     '" with the id "' +
        //     actionId +
        //     '"... (SOON)'
        // );
        var modalHtml =
          `<div id="modal" class="modal"><div class="upper"><p class="modal-title">Action Config</p><p onclick="var modal = document.getElementById('modal'); modal.parentNode.removeChild(modal);" class="modal-close">&times;</p></div><div class="lower"><p class="modal-action-name">` +
          actionName +
          `</p><button onclick="ws.send(JSON.stringify({request: 'DoAction',action: {id: '` +
          actionId +
          `'},id: '123',})); console.log('Running action: ` +
          actionName + `');" class="modal-action-button">Run Action</button></div></div>`;
        document
          .querySelector("body")
          .insertAdjacentHTML("beforeend", modalHtml);
      }
    });
  }
}
