document.body.insertAdjacentHTML(`afterbegin`, `<ul class="button-grid"></ul>`)  
connectvtubews()

function connectvtubews() {
  if ("WebSocket" in window) {
    let wsServerUrl = "ws://localhost:8001/"
    const ws = new WebSocket(wsServerUrl)

    ws.onclose = function () {
      setTimeout(connectvtubews, 10000)
    }

    ws.onopen = function () {
        ws.send(JSON.stringify(
            {
              apiName: "VTubeStudioPublicAPI",
              apiVersion: "1.0",
              requestID: "SomeID",
              messageType: "AuthenticationTokenRequest",
              data: {
                pluginName: "Streamer.bot VTube Studio Plugin",
                pluginDeveloper: "Ik1497"
              }
            }
        ))
    }

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)

      console.log(data)
      if (data.messageType === `AuthenticationTokenResponse`) {
          let authToken = data.data.authenticationToken
          ws.send(JSON.stringify(
            {
              apiName: "VTubeStudioPublicAPI",
              apiVersion: "1.0",
              requestID: "SomeID",
              messageType: "AuthenticationRequest",
              data: {
                pluginName: "Streamer.bot VTube Studio Plugin",
                pluginDeveloper: "Ik1497",
                authenticationToken: authToken
              }
            }
          ))
        }

        if (data.messageType === `AuthenticationResponse`) {
          ws.send(JSON.stringify(
            {
              apiName: "VTubeStudioPublicAPI",
              apiVersion: "1.0",
              requestID: "123",
              messageType: "HotkeysInCurrentModelRequest"
            }
          ))

          ws.send(JSON.stringify(
            {
              apiName: "VTubeStudioPublicAPI",
              apiVersion: "1.0",
              requestID: "123",
              messageType: "AvailableModelsRequest"
            }
          ))
        }

        if (data.messageType === `HotkeysInCurrentModelResponse`) {
          let vtubeData = data
          connectws()
    
          function connectws() {
            if ("WebSocket" in window) {
              let sbWsServerUrl = new URLSearchParams(window.location.search).get("sbWs") || "ws://localhost:8080/"
              const sbWs = new WebSocket(sbWsServerUrl)
              console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...")
    
              sbWs.onclose = function () {
                setTimeout(connectws, 10000)
                console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...")
    
              }
    
              sbWs.onopen = function () {
                sbWs.send(
                  JSON.stringify({
                    request: "Subscribe",
                    events: {
                      General: ["Custom"],
                    },
                    id: "123",
                  })
                )
                console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot")
              }
    
              sbWs.addEventListener("message", (event) => {
                if (!event.data) return
                const data = JSON.parse(event.data)
                if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return }
                let widget = data.data?.widget
                if (widget != "vtube-studio") return
                
                if (data.data?.request === `TriggerHotkey`) {
                  let hotkeyID;
                  vtubeData.data.availableHotkeys.forEach(hotkey => {
                    console.log(hotkey)
                    if (hotkey.name === data.data?.hotkeyName) {
                      hotkeyID = hotkey.hotkeyID
                    }
                  });
  
                  ws.send(JSON.stringify(
                    {
                      apiName: "VTubeStudioPublicAPI",
                      apiVersion: "1.0",
                      requestID: "123",
                      messageType: "HotkeyTriggerRequest",
                      data: {
                          hotkeyID: hotkeyID
                      }
                    }
                  ))
                }
              })
            }
          }
        }

        if (data.messageType === `AvailableModelsRequest`) {
          console.log(data)
          let vtubeData = data
          connectws()
    
          function connectws() {
            if ("WebSocket" in window) {
              let sbWsServerUrl = new URLSearchParams(window.location.search).get("sbWs") || "ws://localhost:8080/"
              const sbWs = new WebSocket(sbWsServerUrl)
              console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...")
    
              sbWs.onclose = function () {
                setTimeout(connectws, 10000)
                console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...")
    
              }
    
              sbWs.onopen = function () {
                sbWs.send(
                  JSON.stringify({
                    request: "Subscribe",
                    events: {
                      General: ["Custom"],
                    },
                    id: "123",
                  })
                )
                console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot")
              }
    
              sbWs.addEventListener("message", (event) => {
                if (!event.data) return
                const data = JSON.parse(event.data)
                if (JSON.stringify(data) === '{"id":"123","status":"ok"}') { console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Subscribed to the Events/Requests"); return }
                let widget = data.data?.widget
                if (widget != "vtube-studio") return
                
                if (data.data?.request === `LoadVTSModelName`) {
                };
              }
            )}
          }
        }
    })
  }
}

