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
          request: "GetActions",
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
      document.querySelector("body").insertAdjacentHTML(`afterbegin`,`<nav class="navbar"><ul class="navbar-list"></ul></nav><main><ul class="actions"></ul></main>`);
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
              document.querySelector(`main ul.actions`).insertAdjacentHTML(`beforeend`, `<li><p class="action-name">${action.name}</p><button>Execute</button></li>`);
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
                  id: "123",
                })
              );
            });
          });
        });
      });
    });
  }
}
