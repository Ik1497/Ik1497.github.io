//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
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
          request: "Subscribe",
          events: {
            Twitch: [
              "HypeTrainStart",
              "HypeTrainUpdate",
              "HypeTrainLevelUp",
              "HypeTrainEnd",
            ],
          },
          id: "123",
        })
      );
      console.log("Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;

      var data = JSON.parse(event.data);

      var hypeTrainEventType = data.event.type;

      if (hypeTrainEventType === "HypeTrainStart") {
        // Create Hype Train
        document.body.insertAdjacentHTML(`afterbegin`, `<div class="hype-train"><p class="hype-train-percent">0%</p><div class="left"><p class="hype-train-level">LVL 1</p><p class="hype-train-time">00:00</p></div><div class="hype-train-progress-bar"></div><div class="hype-train-background"></div></div>`);

        document.querySelector(".hype-train-progress-bar").style.width = "0%";
        document.querySelector(".hype-train-percent").innerHTML = "0%";
        document.querySelector(".hype-train-level").innerHTML = "LVL 1";
        document.querySelector(".hype-train-time").innerHTML = "00:00";
      }

      if (hypeTrainEventType === "HypeTrainUpdate") {
        var hypeTrainDataPercent = data.data.percent;
        var hypeTrainDataLevel = data.data.level;
        var hypeTrainDataPercent100 = Math.round(hypeTrainDataPercent * 100);

        document.querySelector(".hype-train-progress-bar").style.width =
          hypeTrainDataPercent100 + "%";
        document.querySelector(".hype-train-percent").innerHTML =
          hypeTrainDataPercent100 + "%";
        document.querySelector(".hype-train-level").innerHTML =
          "LVL " + hypeTrainDataLevel;
        document.querySelector(".hype-train-time").innerHTML = "00:00";
      }

      if (hypeTrainEventType === "HypeTrainLevelUp") {
        var hypeTrainDataPrevLevel = data.data.prevLevel;
        var hypeTrainDataLevel = data.data.level;
        var hypeTrainDataPercent = data.data.percent;
        var hypeTrainDataPercent100 = Math.round(hypeTrainDataPercent * 100);

        document
          .querySelector(".hype-train-background")
          .insertAdjacentHTML(
            "afterend",
            `<div class="hype-train-alert">Level ` +
            hypeTrainDataPrevLevel +
              ` Completed!</div>`
          );

        setTimeout(function () {
          document.querySelector(".hype-train-progress-bar").style.width =
            hypeTrainDataPercent100 + "%";
          document.querySelector(".hype-train-percent").innerHTML =
            hypeTrainDataPercent100 + "%";
          document.querySelector(".hype-train-level").innerHTML =
            "LVL " + hypeTrainDataLevel;
          document.querySelector(".hype-train-time").innerHTML = "00:00";
        }, 1000);

        setTimeout(function () {
          document
            .querySelector(".hype-train-alert")
            .parentNode.removeChild(
              document.querySelector(".hype-train-alert")
            );
        }, 5000);
      }

      if (hypeTrainEventType === "HypeTrainEnd") {
        var hypeTrainDataContributorCount = data.data.contributorCount;
        var hypeTrainDataContributors = data.data.contributors;

        document
          .querySelector(".hype-train-background")
          .insertAdjacentHTML(
            "afterend",
            `<div class="hype-train-alert">Hype Train Completed!</div>`
          );
        setTimeout(function () {
          document
            .querySelector(".hype-train-alert")
            .insertAdjacentHTML(
              "afterend",
              `<div class="hype-train-alert">` +
                hypeTrainDataContributorCount +
                ` Contributors</div>`
            );
        }, 3500);

        setTimeout(function () {
          document
            .querySelector(".hype-train-alert")
            .parentNode.removeChild(
              document.querySelector(".hype-train-alert")
            );
          document
            .querySelector(".hype-train-alert")
            .parentNode.removeChild(
              document.querySelector(".hype-train-alert")
            );
            document.querySelector(".hype-train").classList.add("remove");
        }, 10000);

        setTimeout(function () {
          document.querySelector(".hype-train-progress-bar").style.width = "0%";
          document.querySelector(".hype-train-percent").innerHTML = "0%";
          document.querySelector(".hype-train-level").innerHTML = "LVL 1";
          document.querySelector(".hype-train-time").innerHTML = "00:00";
        }, 1000);

        setTimeout(function () {
          document
          .querySelector(".hype-train")
          .parentNode.removeChild(
            document.querySelector(".hype-train")
          );
        }, 13000)
      }
    });
  }
}
