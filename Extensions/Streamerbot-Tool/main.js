let headerHtml = `<header><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.ico" alt="favicon"><div class="name-description"><p class="name">Streamer.bot Tool</p><p class="description">by Ik1497</p></div></div><aside><div class="form-area"><label>Url</label><input type="url" value="localhost" class="url"></div><div class="form-area"><label>Port</label><input type="number" value="8080" max="9999" class="port"></div><div class="form-area"><label>Endpoint</label><input type="text" value="/" class="endpoint"></div><button class="connect-websocket">Connect</button></aside></header>`
document.querySelector("body").insertAdjacentHTML(`afterbegin`,`${headerHtml}<nav class="navbar"><ul class="navbar-list"></ul></nav><main><ul class="actions"></ul></main>`);

document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, function () {
  window.location = `?ws=ws://${document.querySelector(`header aside .form-area .url`).value}:${document.querySelector(`header aside .form-area .port`).value}${document.querySelector(`header aside .form-area .endpoint`).value}`
});

connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...");
    document.querySelector(`header aside button.connect-websocket`).innerText = `Connecting...`;

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...");
      document.querySelector(`header aside button.connect-websocket`).innerText = `Disconnected`;
    };

    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          request: "GetActions",
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.querySelector(`header aside button.connect-websocket`).innerText = `Connected`;
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      
      // ------ //
      // NAVBAR //
      // ------ //

      let uniqueGroups = [];
      
      // Unique Groups Array
      data.actions.forEach(action => {
        if (action.group === "") {

        } else if (!uniqueGroups.includes(action.group)) {
          uniqueGroups.push(action.group);
        }
      });
      uniqueGroups = uniqueGroups.sort();
      uniqueGroups.unshift("None");

      // Groups Navbar
      uniqueGroups.forEach(group => {
        document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item"><button>${group}</button></li>`);
      });

      // Button Logic
      document.querySelectorAll(`ul.navbar-list button`).forEach(buttonHtml => {
        buttonHtml.addEventListener(`click`, function () {

          // Button Logic || Remove old active classes
          document.querySelectorAll(`nav.navbar ul.navbar-list .nav-active`).forEach(oldNavActiveHtml => {
            oldNavActiveHtml.classList.remove(`nav-active`);
          });

          // Button Logic || Add new active class
          buttonHtml.parentElement.classList.add(`nav-active`);

          // ---- //
          // MAIN //
          // ---- //

          // Add Main Contents

          document.querySelector(`main ul.actions`).parentNode.removeChild(document.querySelector(`main ul.actions`));

          document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `<ul class="actions"></ul>`);
          buttonHtmlText = buttonHtml.innerText
          if (buttonHtmlText === "None") buttonHtmlText = "";
          data.actions.forEach(action => {
            if (action.group === buttonHtmlText) {
              document.querySelector(`main ul.actions`).insertAdjacentHTML(`beforeend`, `<li><p class="action-name">${action.name}</p><button title="Execute Action">Execute</button></li>`);
            }
          });

          // Execute Button
          document.querySelectorAll(`main ul.actions button`).forEach(buttonHtml => {
            buttonHtml.addEventListener(`click`, function () { 
              ws.send(
                JSON.stringify({
                  request: "DoAction",
                  action: {
                    name: buttonHtml.parentNode.querySelector(`p.action-name`).innerText
                  },
                  args: {
                    source: "StreamerbotTool"
                  },
                  id: "123",
                })
              );
            });
          });
        });
      });


      //////////////////////
      // Global Arguments //
      //////////////////////
      let globalArgsHtml = `<div class="global-args"><div class="header"><div class="info"><p class="title">Global Arguments</p><p class="description">Arguments that will be assigned to all actions</p></div><button class="close-button">&times;</button></div><div class="main"><table><thead><tr><th>Argument</th><th>Value</th></tr></thead><tbody><tr><td><input type="text" placeholder="Argument"></td><td><input type="text" placeholder="Value"></td><td><button title="Remove Argument"class="remove-row mdi mdi-trash-can"></button></td></tr><tr><td></td><td><button title="Add Argument" class="add-row mdi mdi-plus-box"></button></td></tr></tbody></table></div></div>`;
      document.querySelector(`.open-global-args`).addEventListener(`click`, function () {
        document.querySelector(`.open-global-args`).insertAdjacentHTML(`afterend`, globalArgsHtml);
        document.querySelector(`.global-args .header .close-button`).addEventListener(`click`, function () {
          document.querySelector(`.global-args`).parentNode.removeChild(document.querySelector(`.global-args`));
        });
      });
    });
  }
}