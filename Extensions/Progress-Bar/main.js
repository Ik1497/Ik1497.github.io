document.body.insertAdjacentHTML(`afterbegin`, `
<ul class="progress-bar-list"></ul>
`)

let cycleDuration = new URLSearchParams(window.location.search).get(`cycle-duration`) ||15000
let cycleTransitionDuration = new URLSearchParams(window.location.search).get(`cycle-transition-duration`) ||500

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
      if (data?.data?.args?.id === undefined) return
      
      console.log(data)
      
      if (data?.data?.args?.request === `create`) {
        if (data?.data?.args?.title === undefined) return
        if (data?.data?.args?.maximum === undefined) return
        if (data?.data?.args?.minimum === undefined) return
        if (data?.data?.args?.startValue === undefined) return

        create(data?.data?.args?.id, data?.data?.args?.title, data?.data?.args?.maximum, data?.data?.args?.minimum, data?.data?.args?.startValue)
      }
      
      else if (data?.data?.args?.request === `progress`) {
        if (data?.data?.args?.value === undefined) return

        progress(data?.data?.args?.id, data?.data?.args?.value)
      }

      else if (data?.data?.args?.request === `update`) {
        if (data?.data?.args === undefined) return

        update(data?.data?.args?.id, data?.data?.args)
      }
      
      else if (data?.data?.args?.request === `remove`) {
        remove(data?.data?.args?.id)
      }


      function create(id, title = `Progress Bar`, maximum = 50, minimum = 0, startValue = ``) {
        let progressBarContainer = document.createElement(`div`)
        progressBarContainer.id = id
        progressBarContainer.className = `container`
        progressBarContainer.dataset.state = `hidden`

        progressBarContainer.innerHTML = `
        <p class="start-goal">${minimum}</p>
        <div class="progress-bar"></div>
        <div class="goal-title-container">
          <p class="goal-title">${title}</p>
        </div>
        <p class="end-goal">${maximum}</p>
        <p class="progress-text">0%</p>`

        document.querySelector(`ul.progress-bar-list`).prepend(progressBarContainer)
        if (data?.data?.args?.progressBackgroundColor != null && data?.data?.args?.progressBackgroundColor != undefined) {
          progressBarContainer.style.setProperty(`--background`, data?.data?.args?.progressBackgroundColor)
        }

        if (data?.data?.args?.progressBarColor != null && data?.data?.args?.progressBarColor != undefined) {
          progressBarContainer.style.setProperty(`--background-progress-bar`, data?.data?.args?.progressBarColor)
        }

        if (startValue != ``) set(id, startValue)

        updateCycle()
      }
      
      function progress(id, value = `50`) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          let maximum = container.querySelector(".end-goal").innerText;

          if (!isNaN(Math.round((Number(container.querySelector(".start-goal").innerText) + Number(value)) * 100) / 100)) {
            container.querySelector(".start-goal").innerText = Math.round((Number(container.querySelector(".start-goal").innerText) + Number(value)) * 100) / 100;
            container.querySelector(".progress-bar").style.width = `${Number(container.querySelector(".start-goal").innerText) / maximum * 100}%`
          }

          if (Number(container.querySelector(".start-goal").innerText) >= maximum) {
            finish(id);
          }
        });
      }

      function set(id, value = `0`) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          let maximum = container.querySelector(".end-goal").innerText;

          container.querySelector(".start-goal").innerText = value;
          container.querySelector(".progress-bar").style.width = `${value / maximum * 100}%`;

          if (Number(container.querySelector(".start-goal").innerText) >= maximum) {
            finish(id);
          }
        });
      }


      function update(id, args) {
        if (args.value != undefined) {
          set(id, args.value)
        }
        
        if (args.progressBackgroundColor != undefined) {
          document.querySelectorAll(`#${id}`).forEach(container => {
            container.style.setProperty(`--background`, args.progressBackgroundColor)
          })
        }

        if (args.progressBarColor != undefined) {
          document.querySelectorAll(`#${id}`).forEach(container => {
            container.style.setProperty(`--background-progress-bar`, args.progressBarColor)
          })
        }
      }
      
      function remove(id) {        
        document.querySelectorAll(`#${id}`).forEach(container => {
          container.classList.add(`removing`)
          
          container.addEventListener(`animationend`, () => {
            container.remove();

            updateCycle()
          });
        });

      }
      
      
      function finish(id) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          let title = container.querySelector(`.goal-title`).innerHTML;
        
          container.insertAdjacentHTML(`beforeend`, `<p class="goal-finished">${title} Finished!!!</p>`);
        
          setTimeout(() => {
            remove(id)
          }, 7500);
        });
      }
    })
  }
}

function updateCycle() {
  if (new URLSearchParams(window.location.search).get(`cycle`) != null) {
    document.body.setAttribute(`progress-bar-count`, document.querySelectorAll(`.progress-bar-list .container`).length)
    if (document.body.getAttribute(`current-progress-bar`) === null) {
      document.body.setAttribute(`current-progress-bar`, 0)
    }
  }
}

setInterval(() => {
  if (document.body.getAttribute(`current-progress-bar`) != null && document.body.getAttribute(`progress-bar-count`) != null) {
    let currentProgressBar = Number(document.body.getAttribute(`current-progress-bar`))
    let progressBarCount = Number(document.body.getAttribute(`progress-bar-count`))


    if (Number(document.body.getAttribute(`current-progress-bar`)) < Number(document.body.getAttribute(`progress-bar-count`))) {
      document.body.setAttribute(`current-progress-bar`, Number(document.body.getAttribute(`current-progress-bar`)) + 1)
      currentProgressBar += 1
    } else {
      document.body.setAttribute(`current-progress-bar`, 1)
      currentProgressBar = 1
    }

    console.log(progressBarCount, currentProgressBar)
    document.querySelectorAll(`.progress-bar-list .container`).forEach(container => {
      if (container.getAttribute(`data-state`) === `shown` || container.getAttribute(`data-state`) === `showing`) {
        container.setAttribute(`data-state`, `hiding`)
      }

      setTimeout(() => {
        if (container.getAttribute(`data-state`) === `hiding`) {
          container.setAttribute(`data-state`, `hidden`)
        }
      }, cycleTransitionDuration);
    });
    Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].setAttribute(`data-state`, `showing`)
    
    setTimeout(() => {
      if (Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].getAttribute(`data-state`) === `showing`) {
        Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].setAttribute(`data-state`, `shown`)
      }
    }, cycleTransitionDuration);
  }
}, cycleDuration);

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

// Cycle
root.style.setProperty("--cycle-transition-duration", cycleTransitionDuration + `ms`)
root.style.setProperty("--cycle-duration", cycleDuration + `ms`)

if (params.get("cycle") != null) {
  if (params.get("cycle-transition") != null) {
    document.body.dataset.cycleTransition = params.get("cycle-transition")
  } else {
    document.body.dataset.cycleTransition = `fade`
  }
}
