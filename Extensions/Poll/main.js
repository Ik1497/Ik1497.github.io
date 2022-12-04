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
            General: ["Custom"],
          },
          id: "123",
        })
      );
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");
    };

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the events"); return; };
      console.log(data);
      var widget = data.data?.widget;
      var pollEvent = data.data?.pollEvent;
      if (widget != "poll") return;
      console.log("Event received...");
      var pollTitle = data.data?.pollTitle;
      var pollDuration = data.data?.pollDuration;
      var pollOption1Title = data.data?.pollOption1Title;
      var pollOption2Title = data.data?.pollOption2Title;
      var pollOption3Title = data.data?.pollOption3Title;
      var pollOption4Title = data.data?.pollOption4Title;
      var pollOption5Title = data.data?.pollOption5Title;

      ////////////////////////////////////////
      /////// ----> POLL CREATED <---- ///////
      ////////////////////////////////////////

      if (pollEvent === "created") {
        if (pollTitle === undefined) return;
        if (pollDuration === undefined) return;
        if (pollOption1Title === undefined) return;
        if (pollOption2Title === undefined) return;

        /// --> Set Text Properties / Add Options <-- ///
        // Default
        document.querySelector(".poll-data .title").innerHTML = pollTitle;
        // Poll Option 1
        document.querySelector(
          ".poll-options .poll-option.option-1 .title"
        ).innerHTML = pollOption1Title;
        document.querySelector(
          ".poll-options .poll-option.option-1 .votes"
        ).innerHTML = "0% (0 votes)";

        // Poll Option 2
        document.querySelector(
          ".poll-options .poll-option.option-2 .title"
        ).innerHTML = pollOption2Title;
        document.querySelector(
          ".poll-options .poll-option.option-2 .votes"
        ).innerHTML = "0% (0 votes)";

        // Poll Option 3
        if (pollOption3Title != undefined) {
          var pollOption3Html =
            '<div class="poll-option option-2"><p class="title">' +
            pollOption3Title +
            '</p><p class="votes">0% (0 votes)</p><p class="progress-bar-background"></p><p class="progress-bar"></p>';
          document
            .querySelector(".poll-options .poll-option.option-2")
            .insertAdjacentHTML("afterend", pollOption3Html);

          document.querySelector(
            ".poll-options .poll-option.option-3 .title"
          ).innerHTML = pollOption3Title;
          document.querySelector(
            ".poll-options .poll-option.option-3 .votes"
          ).innerHTML = "0% (0 votes)";
        }

        // Poll Option 4
        // Poll Option 5

        /// --> Set Percentages <-- ///
        var pollOption1VotesPercentage = Math.round(
          (pollOption1Votes / pollVotes + Number.EPSILON) * 100
        );
        document.querySelector(
          ".poll-options .poll-option.option-1 .progress-bar"
        ).style.width = pollOption1VotesPercentage + "%";
        document.querySelector(
          ".poll-options .poll-option.option-1 .votes"
        ).innerHTML =
          pollOption1VotesPercentage + "% (" + pollOption1Votes + " votes)";

        var pollOption2VotesPercentage = Math.round(
          (pollOption2Votes / pollVotes + Number.EPSILON) * 100
        );
        document.querySelector(
          ".poll-options .poll-option.option-2 .progress-bar"
        ).style.width = pollOption2VotesPercentage + "%";
        document.querySelector(
          ".poll-options .poll-option.option-2 .votes"
        ).innerHTML =
          pollOption2VotesPercentage + "% (" + pollOption2Votes + " votes)";
      }
    });
  }
}
