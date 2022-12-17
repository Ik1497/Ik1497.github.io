//////////////////////
/// Websocket Code ///
//////////////////////
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
            Twitch: ["HypeTrainStart", "HypeTrainUpdate", "HypeTrainLevelUp", "HypeTrainEnd"],
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      console.log(data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return; };

      let hypeTrainEventType = data.event.type;

      if (hypeTrainEventType === "HypeTrainStart") {
        // Create Hype Train
        document.body.insertAdjacentHTML(`afterbegin`, `<div class="hype-train"><p class="hype-train-percent">0%</p><div class="left"><p class="hype-train-level">LVL 1</p><p class="hype-train-time">00:00</p></div><div class="hype-train-progress-bar"></div><div class="hype-train-background"></div></div>`);

        document.querySelector(".hype-train-progress-bar").style.width = "0%";
        document.querySelector(".hype-train-percent").innerHTML = "0%";
        document.querySelector(".hype-train-level").innerHTML = "LVL 1";
        document.querySelector(".hype-train-time").innerHTML = "00:00";
      }

      if (hypeTrainEventType === "HypeTrainUpdate") {
        let hypeTrainDataLevel = data.data.level;
        let hypeTrainDataProgress = data.data.progress;
        let hypeTrainDataGoal = data.data.goal;
        let hypeTrainDataPercent = Math.round(hypeTrainDataProgress / hypeTrainDataGoal * 100);

        document.querySelector(".hype-train-progress-bar").style.width = hypeTrainDataPercent + "%";
        document.querySelector(".hype-train-percent").innerHTML = hypeTrainDataPercent + "%";
        document.querySelector(".hype-train-level").innerHTML = "LVL " + hypeTrainDataLevel;
        document.querySelector(".hype-train-time").innerHTML = "00:00";
      }

      if (hypeTrainEventType === "HypeTrainLevelUp") {
        let hypeTrainDataLevel = data.data.level;
        let hypeTrainDataPrevLevel = hypeTrainDataLevel - 1;
        let hypeTrainDataProgress = data.data.progress;
        let hypeTrainDataGoal = data.data.goal;
        let hypeTrainDataPercent = Math.round(hypeTrainDataProgress / hypeTrainDataGoal * 100);

        document.querySelector(".hype-train-background").insertAdjacentHTML(`afterend`, `<div class="hype-train-alert">Level ` + hypeTrainDataPrevLevel + ` Completed!</div>`);

        setTimeout(function () {
          document.querySelector(".hype-train-progress-bar").style.width = hypeTrainDataPercent + "%";
          document.querySelector(".hype-train-percent").innerHTML = hypeTrainDataPercent + "%";
          document.querySelector(".hype-train-level").innerHTML = "LVL " + hypeTrainDataLevel;
          document.querySelector(".hype-train-time").innerHTML = "00:00";
        }, 1000);

        setTimeout(function () {
          document.querySelector(".hype-train-alert").parentNode.removeChild(document.querySelector(".hype-train-alert"));
        }, 5000);
      }

      if (hypeTrainEventType === "HypeTrainEnd") {
        let hypeTrainDataContributorCount = data.data.contributorCount;
        let hypeTrainDataContributors = data.data.contributors;

        document.querySelector(".hype-train-background").insertAdjacentHTML("afterend", `<div style="--duration: 10s;" class="hype-train-alert"><marquee direction="right" scrollamount="10">Hype Train Completed!</marquee></div>`);
        setTimeout(function () {
          document.querySelector(`.hype-train-alert`).insertAdjacentHTML(`afterend`, `<div class="hype-train-alert">` +hypeTrainDataContributorCount +` Contributors</div>`);
        }, 8000);

        setTimeout(function () {
          document.querySelector(".hype-train-alert").parentNode.removeChild(document.querySelector(".hype-train-alert"));
          document.querySelector(".hype-train-alert").parentNode.removeChild(document.querySelector(".hype-train-alert"));
          document.querySelector(".hype-train").classList.add("remove");
        }, 13000);

        setTimeout(function () {
          document.querySelector(".hype-train-progress-bar").style.width = "0%";
          document.querySelector(".hype-train-percent").innerHTML = "0%";
          document.querySelector(".hype-train-level").innerHTML = "LVL 1";
          document.querySelector(".hype-train-time").innerHTML = "00:00";
        }, 2000);

        setTimeout(function () {
          document.querySelector(".hype-train").parentNode.removeChild(document.querySelector(".hype-train"));
        }, 14500);
      }
    });
  }
}

//////////////////////
/// URL Paramaters ///
//////////////////////
// General
const params = new URLSearchParams(window.location.search);
let root = document.querySelector(":root");

// Font
let fontFamily = params.get("font-family");
root.style.setProperty("--font-family", fontFamily);

let fontWeight = params.get("font-weight");
root.style.setProperty("--font-weight", fontWeight);

let fontStyle = params.get("font-style");
root.style.setProperty("--font-style", fontStyle);

let fontSize = params.get("font-size");
root.style.setProperty("--font-size", fontSize);

let fontColor = params.get("font-color");
root.style.setProperty("--font-color", fontColor);

// Misc
let background = params.get("background");
root.style.setProperty("--background", background);

let backgroundProgressBar = params.get("background-progress-bar");
root.style.setProperty("--background-progress-bar", backgroundProgressBar);

let borderRadius = params.get("border-radius");
root.style.setProperty("--border-radius", borderRadius);

// Theme
let theme = params.get("theme");

if (theme === "soon") {
  document.body.setAttribute("data-theme", "soon");
} else if (theme != undefined) {
  console.log("Theme unknown");
}
