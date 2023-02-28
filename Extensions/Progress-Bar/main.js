document.body.insertAdjacentHTML(`afterbegin`, `
<ul class="progress-bar-list"></ul>
`)

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl =
      new URLSearchParams(window.location.search).get("ws") ||
      "ws://localhost:8080/";
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
            General: ["Custom"]
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);

      if (data?.data?.widget != `progress-bar`) return
      if (data?.data?.id === undefined) return
      
      console.log(data)
      
      if (data?.data?.eventType === `create`) {
        if (data?.data?.title === undefined) return
        if (data?.data?.maximum === undefined) return
        if (data?.data?.minimum === undefined) return
        if (data?.data?.startValue === undefined) return

        create(data?.data?.id, data?.data?.title, data?.data?.maximum, data?.data?.minimum, data?.data?.startValue)
      }
      
      else if (data?.data?.eventType === `progress`) {
        if (data?.data?.value === undefined) return

        progress(data?.data?.id, data?.data?.value)
      }
      
      else if (data?.data?.eventType === `remove`) {
        remove(data?.data?.id)
      }


      function create(id, title = `Progress Bar`, maximum = 50, minimum = 0, startValue = 0) {
        if (id === undefined || title === undefined || maximum === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id, string: title, number: maximum)"; }
        let progressBarContainer = document.createElement(`div`)
        progressBarContainer.id = id
        progressBarContainer.className = `container`
        progressBarContainer.innerHTML = `<p class="start-goal">0</p><div class="progress-bar"></div><div class="goal-title-container"><p class="goal-title">${title}</p></div><p class="end-goal">${maximum}</p><p class="progress-text">0%</p>`
        document.querySelector(`ul.progress-bar-list`).prepend(progressBarContainer)
        if (data?.data?.settings?.progressColor != null || data?.data?.settings?.progressColor != `None`) {
          progressBarContainer.style.setProperty(`--background-progress-bar`, data?.data?.settings?.progressColor)
        }
      }
      
      function progress(id, value = `50`) {
        if (id === undefined || value === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id, number: value)"; }
        document.querySelectorAll(`#${id}`).forEach(container => {
          let maximum = container.querySelector(".end-goal").innerText;

          container.querySelector(".start-goal").innerText = Number(container.querySelector(".start-goal").innerText) + Number(value);
          container.querySelector(".progress-bar").style.width = `${Number(container.querySelector(".start-goal").innerText) / maximum * 100}%`;

          if (Number(container.querySelector(".start-goal").innerText) >= maximum) {
            finish(id);
          }
        });
      }
      
      function remove(id) {
        if (id === undefined) { return "[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "ERROR: Data is missing (string/number: id)"; }
        
        document.querySelectorAll(`#${id}`).forEach(container => {
          container.classList.add(`removing`)
          
          container.addEventListener(`animationend`, () => {
            container.remove();
          });
        });
      }
      
      
      function finish(id) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          let title = container.querySelector(`.goal-title`).innerHTML;
        
          container.insertAdjacentHTML(`beforeend`, `<p class="goal-finished">${title} Finished!!!</p>`);
        
          setTimeout(() => {
            remove(id)
          }, 3000);
        });
      }
    })
  }
}

//////////////////////
/// URL parameters ///
//////////////////////
// General
const params = new URLSearchParams(window.location.search)
const root = document.querySelector(":root")

// Font
root.style.setProperty("--font-family", params.get("font-family"))
root.style.setProperty("--font-weight", params.get("font-weight"))
root.style.setProperty("--font-style", params.get("font-style"))
root.style.setProperty("--font-size", params.get("font-size"))
root.style.setProperty("--font-color", params.get("font-color"))

// Background
root.style.setProperty("--background", params.get("background"))
root.style.setProperty("--background-progress-bar", params.get("background-progress-bar"))
root.style.setProperty("--background-border-radius", params.get("background-border-radius"))

// Animations
root.style.setProperty("--animation-duration", params.get("animation-duration"))
root.style.setProperty("--transition-duration", params.get("transition-duration"))
