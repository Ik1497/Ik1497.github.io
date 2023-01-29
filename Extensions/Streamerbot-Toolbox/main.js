let version = `1.0.0-pre`
let title = `Streamer.bot Toolbox v${version}`
let documentTitle = `${title} | Streamer.bot Actions`
document.title = documentTitle

let headerTagsMap = [
  {
    name: `About`,
    integration: `streamer.bot`
  },
  {
    name: `Actions`,
    integration: `streamer.bot`
  },
  {
    name: `Action History`,
    integration: `streamer.bot`
  },
  {
    name: `Present Viewers`,
    integration: `streamer.bot`
  },
  {
    name: `Websocket Events`,
    integration: `streamer.bot`
  },
  {
    name: `Chat`,
    integration: `streamer.bot`
  },
  {
    name: `TwitchSpeaker`,
    integration: `twitchspeaker`
  }
]


if (location.hash === ``) location.href = `#About`

let headerAside = `<div class="form-area"><label>Url</label><input type="url" value="localhost" class="url"></div><div class="form-area"><label>Port</label><input type="number" value="8080" max="9999" class="port"></div><div class="form-area"><label>Endpoint</label><input type="text" value="/" class="endpoint"></div><button class="connect-websocket">Connect</button>`
let headerHtml = `<header><a href="/"><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon"><div class="name-description"><p class="name">${title}</p><p class="description">by Ik1497</p></div></div></a><aside>${headerAside}</aside></header>`
document.querySelector("body").insertAdjacentHTML(`afterbegin`,`${headerHtml}<nav class="navbar"><input type="search" placeholder="Search..."><ul class="navbar-list"></ul></nav><main><ul class="main-list"></ul></main>`)

document.querySelector(`header`).insertAdjacentHTML(`beforeend`, `<ul class="header-tags tags"></ul>`)

headerTagsMap.forEach(headerTag => {
  let hidden = ``
  let headerTagActive = ``

  let headerTagHash = headerTag.name
    .replaceAll(` `, `-`)
    .replaceAll(`.`, ``)
  
  if (location.hash === `#${headerTagHash}`) headerTagActive = ` class="tag-active"`
  if (headerTag.integration != `streamer.bot` && headerTag.integration != `streamerbotIdeas`) hidden = ` hidden`

  document.querySelector(`header .header-tags`).insertAdjacentHTML(`beforeend`, `<li${headerTagActive}><a href="#${headerTagHash}" title="${headerTag.name}" data-integration="${headerTag.integration}"${hidden}>${headerTag.name}</a></li$>`)
});

let state__404 = true

headerTagsMap.forEach(headerTag => {
  let headerTagHash = headerTag.name
    .replaceAll(` `, `-`)
    .replaceAll(`.`, ``)
  
  if (headerTagHash === location.hash.replace(`#`, ``)) {
      state__404 = false
  }
});

if (state__404 === true) document.body.classList.add(`not_found`)


document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, function () {
  window.location = `?ws=ws://${document.querySelector(`header aside .form-area .url`).value}:${document.querySelector(`header aside .form-area .port`).value}${document.querySelector(`header aside .form-area .endpoint`).value}`
})

document.querySelector(`nav.navbar > input[type=search]`).addEventListener(`keydown`, function () {
  setTimeout(() => {    
    let currentSearchTerm = document.querySelector(`nav.navbar > input[type=search]`).value.toLowerCase()
    document.querySelectorAll(`nav.navbar ul.navbar-list li`).forEach(listItem => {
      if (!listItem.querySelector(`button p.title`).innerText.toLowerCase().includes(currentSearchTerm)) {
        listItem.setAttribute(`hidden`, ``)
        listItem.setAttribute(`aria-hidden`, `true`)
      } else {
        listItem.removeAttribute(`hidden`)
        listItem.setAttribute(`aria-hidden`, `false`)
      }
    });
  }, 50);
})

window.addEventListener('hashchange', () => {
  location.reload()
});

connectws()

async function connectws() {
  let eventArgsMap = await fetch(`./eventArgsMap.json`)
  eventArgsMap = await eventArgsMap.json()

  let randomEventArgs = await fetch(`./random.json`)
  randomEventArgs = await randomEventArgs.json()

  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/"
    const ws = new WebSocket(wsServerUrl)
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...")
    document.querySelector(`header aside button.connect-websocket`).innerText = `Connecting...`
    document.querySelector(`header aside`).setAttribute(`data-connection`, `connecting`)
    document.documentElement.style.cursor = `wait`
    
    ws.onclose = function () {
      setTimeout(connectws, 10000)
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...")
      if (document.querySelector(`header aside`))
      document.querySelector(`header aside`).innerHTML = headerAside
      document.querySelector(`header aside button.connect-websocket`).innerText = `Connect`
      document.querySelector(`header aside`).setAttribute(`data-connection`, `disconnected`)
      document.documentElement.style.cursor = ``
      location.reload()
      document.body.classList.add(`disconnected`)
    }
    
    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          request: "GetInfo",
          id: "GetInfo",
        })
        )
        console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot")
        document.querySelector(`header aside button.connect-websocket`).innerText = `Connected`
        document.querySelector(`header aside`).setAttribute(`data-connection`, `connected`)
        document.documentElement.style.cursor = ``
        document.body.classList.remove(`disconnected`)
    }
    
    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      console.log(data)
      let instance
      if (data?.id === `GetInfo`) {
        let instanceOS = data.info.os
        if (data.info.os === `windows`) instanceOS = `<span class="mdi mdi-microsoft-windows"> Windows</span>`
        document.querySelector(`header aside`).innerHTML = `
        <p class="instance-info">Streamer.bot - ${data.info.name}
        <small>${data.info.instanceId}<br>
        ${instanceOS} • ${data.info.version}</small></p>`
        document.title = `${data.info.name} • ${documentTitle}`

        instance = data.info
      }

      if (location.hash === `#Actions` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: "GetActions",
            id: "GetActions",
          })
        )
        ws.send(
          JSON.stringify({
            request: "GetBroadcaster",
            id: "GetBroadcaster",
          })
        )
        ws.send(
          JSON.stringify({
            request: "GetActiveViewers",
            id: "GetActiveViewers",
          })
        )
      } else if (location.hash === `#About` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: "GetBroadcaster",
            id: "GetBroadcaster",
          })
        )
      } else if (location.hash === `#Action-History` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: `GetActions`,
            id: `GetActions`,
          })
        )
        ws.send(
          JSON.stringify({
            request: `Subscribe`,
            events: {
              raw: [`Action`, `ActionCompleted`, `SubAction`]
            },
            id: `ActionCompleted`,
          })
        )
      } else if (location.hash === `#Present-Viewers` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: `GetActiveViewers`,
            id: `GetActiveViewers`,
          })
        )
      } else if (location.hash === `#Websocket-Events` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: `GetEvents`,
            id: `GetEvents`,
          })
        )
      } else if (location.hash === `#Chat` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: `Subscribe`,
            events: {
              twitch: [`ChatMessage`],
              youTube: [`Message`]
            },
            id: `Chat`,
          })
        )
        ws.send(
          JSON.stringify({
            request: `GetActions`,
            id: `GetActions`,
          })
        )
      }

      if (data.id === `GetBroadcaster`) broadcaster = data
      if (data.id === `GetActiveViewers`) presentViewers = data

      if (location.hash === `#About` && data.id === `GetBroadcaster`) {
        AboutAsyncPage()
        async function AboutAsyncPage() {
          document.body.removeChild(document.querySelector(`nav.navbar`))
          let profileImage = ``
          if (data.connected.includes(`youtube`)) profileImage = data.platforms.youtube.broadcastUserProfileImage
          if (data.connected.includes(`twitch`)) profileImage = await fetch(`https://decapi.me/twitch/avatar/${data.platforms.twitch.broadcastUserName}`)
          if (data.connected.includes(`twitch`)) profileImage = await profileImage.text()

          if (profileImage != ``) profileImage = `<img style="width: 1em; height: 1em; border-radius: 100vmax; margin-right: .125em" src="${profileImage}" alt="Broadcaster's Avatar">`
          
          let welcomeMessage = `Welcome!`
          let welcomeUser = ``
          if (data.connected.includes(`youtube`)) welcomeUser = data.platforms.youtube.broadcastUserName
          if (data.connected.includes(`twitch`)) welcomeUser = data.platforms.twitch.broadcastUser
          if (data.connected.includes(`twitch`) || data.connected.includes(`youtube`)) welcomeMessage = `Welcome, <span style="display: flex; align-items: center;">${profileImage}${welcomeUser}!</span>`
          document.body.querySelector(`main`).innerHTML = `
          <h1 style="padding-bottom: 3rem;">${welcomeMessage}</h1>
          <p>Streamer.bot Toolbox (v${version}) is made for making developing Streamer.bot actions easier;</p>
          <p>this tool is currently a very work in progress, feautures may come and go over time.</p>
          <br>
          <p>This tool requires your <code>Server/Clients</code> --> <code>Websocket Server</code> to be enabled.</p>
          <br>
          <p>Integrations:</p>
          <p>• Streamer.bot</p>
          <p>• TwitchSpeaker</p>
          `
        }
      }

      if (data.id === `GetInfo`) {
        ///////////////////
        // Setting Modal //
        ///////////////////
        document.body.insertAdjacentHTML(`afterbegin`, `<div title="Open Settings" class="open-settings-modal mdi mdi-cog"></div>`)

        let globalArgsHtml = `<div class="settings-modal" data-active-page="integrations">
        <nav><ul>
          <li class="nav-active"><button data-page="integrations">Integrations</button></li>
          <li><button data-page="global-arguments">Global Arguments</button></li>
          <li><button data-page="broadcaster">Broadcaster</button></li>
          <li><button data-page="random-users">Random Users</button></li>
        </ul></nav>
        <div class="header">
          <div class="info"><p class="title"></p><p class="description"></p></div>
          <button class="close-button" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)">&times</button></div><div class="main">
        </div></div>`
        document.querySelector(`.open-settings-modal`).addEventListener(`click`, function () {
          document.querySelector(`.open-settings-modal`).insertAdjacentHTML(`afterend`, globalArgsHtml)
          
          reloadPages()
          function reloadPages() {
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `integrations`) reloadIntegrations()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `global-arguments`) reloadGlobalArguments()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `broadcaster`) reloadBroadcaster()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `random-users`) reloadRandomUsers()
          }

          document.querySelectorAll(`.settings-modal nav ul li button`).forEach(navButton => {
            navButton.addEventListener(`click`, function () {
              navButtonPage = navButton.getAttribute(`data-page`)
              document.querySelector(`.settings-modal`).setAttribute(`data-active-page`, navButtonPage)
              navButton.parentNode.classList.add(`nav-active`)
              document.querySelectorAll(`.settings-modal nav ul li.nav-active`).forEach(navActiveButton => {
                navActiveButton.classList.remove(`nav-active`)
              });
              navButton.parentNode.classList.add(`nav-active`)
              reloadPages()
            })
          });

          function reloadIntegrations() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Integrations • Settings`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `All integrations that can be connected`
            
            document.querySelector(`.settings-modal .main`).innerHTML = `
            <ul class="integrations-list">
              <li class="mdi mdi-check" data-integration="streamer.bot"> Streamer.bot (${instance.version}) • ${wsServerUrl}</li>
            </ul>
            `

            // TwitchSpeaker
            
            let integrationsList__twitchspeaker = `<li class="mdi mdi-plus" data-integration="twitchspeaker"> TwitchSpeaker <button>Connect!</button></p>`

            if (document.body.getAttribute(`twitchspeaker-state`) === null) {
            } else if (document.body.getAttribute(`twitchspeaker-state`) === `connected`) {
              let integrationsList__twitchspeaker_wsUrl = localStorage.getItem(`streamerbotToolbox__twitchspeaker`)
              integrationsList__twitchspeaker_wsUrl = JSON.parse(integrationsList__twitchspeaker_wsUrl)
              integrationsList__twitchspeaker_wsUrl = `ws://${integrationsList__twitchspeaker_wsUrl.host}:${integrationsList__twitchspeaker_wsUrl.port}${integrationsList__twitchspeaker_wsUrl.endpoint}`
              integrationsList__twitchspeaker = `<li class="mdi mdi-check" data-integration="twitchspeaker"> TwitchSpeaker (Connected) • ${integrationsList__twitchspeaker_wsUrl} <button class="mdi mdi-cog"></button></p>`
            } else if (document.body.getAttribute(`twitchspeaker-state`) === `disconnected`) {
              integrationsList__twitchspeaker = `<li class="mdi mdi-reload" data-integration="twitchspeaker"> TwitchSpeaker <button>Reconnect!</button></p>`
            }

            document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, integrationsList__twitchspeaker)
            
            document.querySelector(`.settings-modal .main ul.integrations-list li[data-integration="twitchspeaker"] button`).addEventListener(`click`, function () {
              let twitchspeakerDefaultValues = localStorage.getItem(`streamerbotToolbox__twitchspeaker`)
              if (twitchspeakerDefaultValues === null) {
                twitchspeakerDefaultValues = {}
                twitchspeakerDefaultValues.host     = `localhost`
                twitchspeakerDefaultValues.port     = `7580`
                twitchspeakerDefaultValues.endpoint = `/`
              } else {
                twitchspeakerDefaultValues = JSON.parse(twitchspeakerDefaultValues)
              }

              document.body.insertAdjacentHTML(`afterbegin`, `
                <div class="settings-modal-alt small" data-settings-modal-alt="twitchspeaker-connection">
                <button class="close-button mdi mdi-close" onclick="location.reload()"></button>
                <div class="main"><h2>TwitchSpeaker</h3><br><table><tbody>
                  <tr>
                    <td style="text-align: right; padding-right: .25rem;"><label for="websocket-url">Host</label></td>
                    <td style="text-align: left;"><input type="url" name="websocket-host" id="websocket-host" value="${twitchspeakerDefaultValues.host}" placeholder="${twitchspeakerDefaultValues.host}"></td>
                  </tr>
                  <tr>
                    <td style="text-align: right; padding-right: .25rem;"><label for="websocket-url">Port</label></td>
                    <td style="text-align: left;"><input type="url" name="websocket-port" id="websocket-port" value="${twitchspeakerDefaultValues.port}" placeholder="${twitchspeakerDefaultValues.port}"></td>
                  </tr>
                  <tr>
                    <td style="text-align: right; padding-right: .25rem;"><label for="websocket-url">Endpoint</label></td>
                    <td style="text-align: left;"><input type="url" name="websocket-endpoint" id="websocket-endpoint" value="${twitchspeakerDefaultValues.endpoint}" placeholder="${twitchspeakerDefaultValues.endpoint}"></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style="text-align: right;"><button class="connect-button">Connect!</button></td>
                  </tr>
                </tbody></table></div></div>
              `)

              document.querySelector(`.settings-modal-alt[data-settings-modal-alt=twitchspeaker-connection] .main table tbody tr td button.connect-button`).addEventListener(`click`, function () {
                let table = document.querySelector(`.settings-modal-alt[data-settings-modal-alt=twitchspeaker-connection] .main table`)
                localStorage.setItem(`streamerbotToolbox__twitchspeaker`, JSON.stringify(
                  {
                    host: table.querySelector(`tbody tr td input#websocket-host`).value,
                    port: table.querySelector(`tbody tr td input#websocket-port`).value,
                    endpoint: table.querySelector(`tbody tr td input#websocket-endpoint`).value
                  }))
                location.reload()
              })
            })

            // Streamer.bot Ideas
            /*
            let integrationsList__streamerbotIdeas = `<li class="mdi mdi-plus" data-integration="streamerbotIdeas"> Streamer.bot Ideas <button>Enable!</button></p>`

            if (document.body.getAttribute(`streamerbotIdeas-state`) === null) {
            } else if (document.body.getAttribute(`streamerbotIdeas-state`) === `enabled`) {
              integrationsList__streamerbotIdeas = `<li class="mdi mdi-check" data-integration="streamerbotIdeas"> Streamer.bot Ideas (Enabled) <button class="mdi mdi-cog"></button></p>`
            }

            document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, integrationsList__streamerbotIdeas)

            let streamerbotIdeasDefaultValues = localStorage.getItem(`streamerbotToolbox__streamerbotIdeas`)

            if (streamerbotIdeasDefaultValues === null) {
              streamerbotIdeasDefaultValues = {}
              streamerbotIdeasDefaultValues.apiKey = ``
            } else {
              streamerbotIdeasDefaultValues = JSON.parse(streamerbotIdeasDefaultValues)
            }

            document.querySelector(`.settings-modal .main ul.integrations-list li[data-integration=streamerbotIdeas] button`).addEventListener(`click`, function () {
              document.body.insertAdjacentHTML(`afterbegin`, `
                <div class="settings-modal-alt small" data-settings-modal-alt="streamerbotIdeas-connection">
                <button class="close-button mdi mdi-close" onclick="location.reload()"></button>
                <div class="main"><h2>Streamerbot Ideas</h3><br><table><tbody>
                  <tr>
                    <td style="text-align: right; padding-right: .25rem;"><label for="apiKey">API Key</label></td>
                    <td style="text-align: left;"><input type="url" name="apiKey" id="apiKey" value="${streamerbotIdeasDefaultValues.apiKey}" placeholder="${streamerbotIdeasDefaultValues.apiKey}"></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style="text-align: right;"><button class="connect-button">Enable!</button></td>
                  </tr>
                </tbody></table></div></div>
              `)

              document.querySelector(`.settings-modal-alt[data-settings-modal-alt=streamerbotIdeas-connection] .main table tbody tr td button.connect-button`).addEventListener(`click`, function () {
                let table = document.querySelector(`.settings-modal-alt[data-settings-modal-alt=streamerbotIdeas-connection] .main table`)

                let apiKey = table.querySelector(`tbody tr td input#apiKey`).value
                if (apiKey != ``) {
                  localStorage.setItem(`streamerbotToolbox__streamerbotIdeas`, JSON.stringify(
                    {
                      apiKey: apiKey
                    }))
                }
                location.reload()
              })
            })
            */
          }
        
          function reloadBroadcaster() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Broadcaster Settings • Settings`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Setting of argument for the Broadcast User`

            let options = {
              Disabled: `<option>Disabled</option>`,
              Twitch: `<option>Twitch</option>`,
              YouTube: `<option>YouTube</option>`
            }
            let broadcastService = localStorage.getItem(`streamerbotToolbox__broadcastService`) || `Disabled`

            if (broadcastService === `Twitch`) {
              options = options.Twitch + options.Twitch + options.Disabled
            } else if (broadcastService === `YouTube`) {
              options = options.YouTube + options.Twitch + options.Disabled
            } else if (broadcastService === `Disabled`) {
              options = options.Disabled + options.Twitch + options.YouTube
            }
            
            document.querySelector(`.settings-modal .main`).innerHTML = `<p>Choose Between YouTube or Twitch</p><small>When the service is disconnected no broadcaster variables will be emitted</small><p><select>${options}</select></p>`

            localStorage.setItem(`streamerbotToolbox__broadcastService`, document.querySelector(`.settings-modal .main select`).value)
            document.querySelector(`.settings-modal .main select`).addEventListener(`click`, function () {
              localStorage.setItem(`streamerbotToolbox__broadcastService`, document.querySelector(`.settings-modal .main select`).value)
            })
          }

          function reloadRandomUsers() {
            let prevRandomUsers = localStorage.getItem(`streamerbotToolbox__randomUsers`) || 0
            if (prevRandomUsers <= 0) prevRandomUsers = `0`
            if (isNaN(prevRandomUsers)) prevRandomUsers = `0`
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Random Users • Settings`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Random user variables`
            document.querySelector(`.settings-modal .main`).innerHTML = `<div class="form-group"><label>Random Users:</label> <input type="number" value="${prevRandomUsers}"></div>`           
            
            localStorage.setItem(`streamerbotToolbox__randomUsers`, document.querySelector(`.settings-modal .main input`).value)

            document.querySelector(`.settings-modal .main input`).addEventListener(`keydown`, function () {
              setTimeout(() => {
                let randomUsers = document.querySelector(`.settings-modal .main input`).value
                if (randomUsers <= 0) randomUsers = 0
                if (isNaN(randomUsers)) randomUsers = 0
                localStorage.setItem(`streamerbotToolbox__randomUsers`, randomUsers)
              }, 50);
            })
          }

          function reloadGlobalArguments() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Global Arguments • Settings`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Arguments that will be assigned to all actions`
            document.querySelector(`.settings-modal .main`).innerHTML = `<table class="add-contents"><thead><tr><th>Argument</th><th>Value</th></tr></thead><tbody><tr><td class="argument"><input type="text" placeholder="Argument"></td><td class="value"><input type="text" placeholder="Value"></td><td><button title="Add Argument"class="add-row mdi mdi-plus-box"></button></td></tr></tbody></table>`

            document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).focus()
            document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).select()

            let globalArgsData = localStorage.getItem(`streamerbotToolbox__globalArgs`) || `{}`
            globalArgsData = JSON.parse(globalArgsData)
            globalArgsData = Object.entries(globalArgsData)

            globalArgsData.forEach(globalArgData => {
              document.querySelector(`.settings-modal .main table.add-contents tbody`).insertAdjacentHTML(`beforeend`, `<tr><td><input type="text" placeholder="Argument" value="${globalArgData[0]}"></td><td><input type="text" placeholder="Value" value="${globalArgData[1]}"></td><td><button title="Remove Argument" class="remove-row mdi mdi-trash-can"></button></td></tr>`)
            });

            // document.querySelector(`.settings-modal .main table.add-contents .add-row`).addEventListener(`click`, GlobalArgumentsAddRow()) 
            // document.querySelector(`.settings-modal .main table.add-contents tbody tr:not(:first-child) td input`).addEventListener(`keydown`, GlobalArgumentsUpdateRow()) 
            
            function GlobalArgumentsUpdateRow() {
              
            }

            function GlobalArgumentsAddRow() {
              let globalArgsData = []
              document.querySelectorAll(`.settings-modal .main table tbody tr`).forEach(tableRow => {
                let tableCell1 = tableRow.querySelector(`td:nth-child(1) input`).value
                let tableCell2 = tableRow.querySelector(`td:nth-child(2) input`).value

                if (tableCell1 === ``) tableCell1 = `Argument`
                if (tableCell2 === ``) tableCell2 = `Value`

                // globalArgsData.push([tableCell1, tableCell2])
                console.log([tableCell1, tableCell2])
              })
              globalArgsData = Object.entries(globalArgsData)
              globalArgsData = Object.fromEntries(globalArgsData)
              console.log(globalArgsData)

              localStorage.setItem(`streamerbotToolbox__globalArgs`, JSON.stringify(globalArgsData))
              
              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).value = ``
              document.querySelector(`.settings-modal .main table.add-contents tbody td.value input`).value = ``

              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).focus()
              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).select()
              reloadGlobalArguments()
            }

            document.querySelectorAll(`.settings-modal .main table.add-contents .remove-row`).forEach(removeRow => {
              removeRow.addEventListener(`click`, function () {
                let globalArgsData = localStorage.getItem(`streamerbotToolbox__globalArgs`) || `{}`
                globalArgsData = JSON.parse(globalArgsData)
                globalArgsData = Object.entries(globalArgsData)
                
                let globalArgIndex = 0
                globalArgsData.forEach(globalArgData => {
                  if (globalArgData[0] === removeRow.parentNode.parentNode.querySelector(`input`).value) {
                    globalArgsData.splice(globalArgIndex, 1)
                  }
                  globalArgIndex = globalArgIndex + 1
                });
                
                globalArgsData = Object.fromEntries(globalArgsData)
                localStorage.setItem(`streamerbotToolbox__globalArgs`, JSON.stringify(globalArgsData))

                reloadGlobalArguments()
              })
            });
          }
        })
      }

      if (location.hash === `#Actions` && data.id === `GetActions`) {

        document.querySelector(`main`).classList.add(`col-2`)

        let eventTestDropdown = ``
        let eventArgsEntries = Object.entries(eventArgsMap)
        eventArgsEntries.forEach(eventArgEntry => {
          eventTestDropdown += `<option value="${eventArgEntry[0]}">[${eventArgEntry[1].category.toUpperCase()}] ${eventArgEntry[0]}</option>`
        });
        eventTestDropdown = `<select><option value="None">None</option>${eventTestDropdown}</select>`

        document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `
        <div class="events-handler">
          <h2>Emulate Events</h2>
          ${eventTestDropdown}
        </div>
        `)

        ////////////
        // NAVBAR //
        ////////////

        let uniqueGroups = []
        
        // Unique Groups Array
        data.actions.forEach(action => {
          if (action.group === "") {
          } else if (!uniqueGroups.includes(action.group)) {
            uniqueGroups.push(action.group)
          }
        })
        uniqueGroups = uniqueGroups.sort()
        uniqueGroups.unshift("None")
        uniqueGroups.unshift("All")
        
        // Groups Navbar
        uniqueGroups.forEach(group => {
          let actionCount = 0
          data.actions.forEach(action => {
            if (action.group === ``) action.group = `None`
            if (group === action.group || group === `All`) {
              actionCount++
            }
          })
          let action = `${actionCount} Actions`
          if (actionCount === 1) action = `${actionCount} Action`
          document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item"><button><p class="title">${group}</p><p class="description">${action}</p></button></li>`)
        })

        // Button Logic
        document.querySelectorAll(`ul.navbar-list button`).forEach(buttonHtml => {
          buttonHtml.addEventListener(`click`, function () {

            // Button Logic || Remove old active classes
            document.querySelectorAll(`nav.navbar ul.navbar-list .nav-active`).forEach(oldNavActiveHtml => {
              oldNavActiveHtml.classList.remove(`nav-active`)
            })

            // Button Logic || Add new active class
            buttonHtml.parentElement.classList.add(`nav-active`)

            // ---- //
            // MAIN //
            // ---- //

            // Add Main Contents

            document.querySelector(`main ul.main-list`).innerHTML = ``
            buttonHtmlText = buttonHtml.querySelector(`p.title`).innerText
            if (buttonHtmlText === "") buttonHtmlText = `None`
            let actionCount = 0
            data.actions.forEach(action => {
              if (action.group === buttonHtmlText || buttonHtmlText === `All`) {
                actionCount++
                document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`, `<li><p class="action-name">${action.name}</p><div class="button-group"><button title="Execute Action">Execute</button></div></li>`)
              }
            })
            if (buttonHtmlText === "") buttonHtmlText = "None"
            document.querySelector(`main ul.main-list`).insertAdjacentHTML(`afterbegin`, `<li class="list-title">${buttonHtmlText}, ${actionCount} Actions</li>`)
            if (buttonHtmlText === "None") buttonHtmlText = ""
            
            document.querySelectorAll(`main ul.main-list button`).forEach(buttonHtml => {
              buttonHtml.addEventListener(`click`, function () { 
                let broadcasterObj = {}

                if (broadcaster?.connected.includes(`twitch`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `Twitch`) {
                  broadcasterObj.user = broadcaster?.platforms?.twitch?.broadcastUser ?? `ik1497`
                  broadcasterObj.userName = broadcaster?.platforms?.twitch?.broadcastUserName ?? `ik1497`
                  broadcasterObj.userId = broadcaster?.platforms?.twitch?.broadcastUserId ?? `695682330`
                  broadcasterObj.isAffiliate = broadcaster?.platforms?.twitch?.broadcasterIsAffiliate ?? `false`
                  broadcasterObj.isPartner = broadcaster?.platforms?.twitch?.broadcasterIsPartner ?? `false`
                }

                if (broadcaster?.connected.includes(`youtube`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `YouTube`) {
                  broadcasterObj.userName = broadcaster?.platforms?.youtube?.broadcastUserName ?? `Ik1497 Tutorials`
                  broadcasterObj.userId = broadcaster?.platforms?.youtube?.broadcastUserId ?? `UCl3oatIf9tYopHaZHvnH3xw`
                  broadcasterObj.profileImage = broadcaster?.platforms?.youtube?.broadcastUserProfileImage ?? `https://yt3.ggpht.com/VpC8_9WcDEKcPSvnD6p1iGT_S2_XxdeZtL6tTL2axexj0SpG-c4Wx8i5lYNbJtvmzwCnzm9Bsg=s88-c-k-c0x00ffffff-no-rj`
                }

                let globalArguments = localStorage.getItem(`streamerbotToolbox__globalArgs`) || `{}`
                globalArguments = JSON.parse(globalArguments)
                globalArguments = Object.entries(globalArguments)

                if (broadcaster?.connected.includes(`twitch`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `Twitch`) {
                  globalArguments.push([`broadcastUser`, broadcasterObj.user])
                  globalArguments.push([`broadcastUserName`, broadcasterObj.userName])
                  globalArguments.push([`broadcastUserId`, broadcasterObj.userId])
                  globalArguments.push([`broadcastIsAffiliate`, broadcasterObj.isAffiliate])
                  globalArguments.push([`broadcastIsPartner`, broadcasterObj.isPartner])
                }
                
                if (broadcaster?.connected.includes(`youtube`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `YouTube`) {
                  globalArguments.push([`broadcastUserName`, broadcasterObj.userName])
                  globalArguments.push([`broadcastUserId`, broadcasterObj.userId])
                  globalArguments.push([`broadcastUserProfileImage`, broadcasterObj.profileImage])
                }

                let randomUserCount = localStorage.getItem(`streamerbotToolbox__randomUsers`)
                if (randomUserCount <= 0) randomUserCount = 0
                if (isNaN(randomUserCount)) randomUserCount = 0
                if (randomUserCount > 0 && presentViewers.viewers.length > 0) {
                  for (let presentViewerRunTime = 0; presentViewerRunTime < randomUserCount; presentViewerRunTime++) {                    
                    let randomUser = presentViewers.viewers[Math.floor(Math.random()*presentViewers.viewers.length)];
                    globalArguments.push([`randomUser${presentViewerRunTime}`, randomUser.display])
                    globalArguments.push([`randomUserName${presentViewerRunTime}`, randomUser.login])
                    globalArguments.push([`randomUserId${presentViewerRunTime}`, randomUser.id])  
                  }
                }

                globalArguments.push([`source`, `StreamerbotToolbox`])

                let selectedEventArgs = document.querySelector(`main .events-handler select`).value
                eventArgsEntries.forEach(eventArgsEntry => {
                  if (eventArgsEntry[0] === selectedEventArgs) {
                    let randomEventArgs__user = randomEventArgs.user[Math.floor(Math.random()*randomEventArgs.user.length)]

                    Object.entries(eventArgsEntry[1].arguments).forEach(arg => {
                      let randomEventArgs__message = randomEventArgs.message[Math.floor(Math.random()*randomEventArgs.message.length)]

                      if (arg[0] === `userId`)              arg[1] = randomEventArgs__user.userId
                      if (arg[0] === `userName`)            arg[1] = randomEventArgs__user.userName
                      if (arg[0] === `user`)                arg[1] = randomEventArgs__user.user
                      if (arg[0] === `userType`)            arg[1] = randomEventArgs__user.userType
                      if (arg[0] === `isSubscribed`)        arg[1] = randomEventArgs__user.isSubscribed
                      if (arg[0] === `isVip`)               arg[1] = randomEventArgs__user.isVip
                      if (arg[0] === `isModerator`)         arg[1] = randomEventArgs__user.isModerator
                      if (arg[0] === `userPreviousActive`)  arg[1] = randomEventArgs__user.userPreviousActive

                      if (arg[0] === `rawInput`)           arg[1] = randomEventArgs__message
                      if (arg[0] === `rawInputEscaped`)    arg[1] = encodeURI(randomEventArgs__message)
                      if (arg[0] === `rawInputUrlEncoded`) arg[1] = encodeURI(randomEventArgs__message)
                      if (arg[0] === `message`)            arg[1] = randomEventArgs__message
                      if (arg[0] === `messageStripped`)    arg[1] = randomEventArgs__message
                      if (arg[0] === `rawInput`) randomEventArgs__message.split(` `).forEach((input, index) => {
                        globalArguments.push([`input${index}`,           input])
                        globalArguments.push([`inputEscaped${index}`,    encodeURI(input)])
                        globalArguments.push([`inputUrlEncoded${index}`, encodeURI(input)])
                      });

                      if (arg[0] === `tagCount`) {
                        let randomEventArgs__tagCount = Math.floor(Math.random() * 5) + 1
                        let randomEventArgs__tagsDelimited = []
                        arg[1] = `${randomEventArgs__tagCount}`
                        globalArguments.push([`tags`, 'System.Collections.Generic.List`1[System.String]'])

                        for (let randomEventArgs__tagRunTime = 0; randomEventArgs__tagRunTime < randomEventArgs__tagCount; randomEventArgs__tagRunTime++) {
                          let randomEventArgs__tags = randomEventArgs.tags[Math.floor(Math.random()*randomEventArgs.tags.length)]
                          globalArguments.push([`tag${randomEventArgs__tagRunTime}`, randomEventArgs__tags])
                          randomEventArgs__tagsDelimited.push(randomEventArgs__tags)
                        }

                        globalArguments.push([`tagsDelimited`, randomEventArgs__tagsDelimited.join(`,`)])
                      }
                      
                      globalArguments.push(arg)
                    });
                  }
                });
                
                globalArguments = Object.fromEntries(globalArguments)
                console.log(`Adding`, globalArguments)
                
                ws.send(
                  JSON.stringify({
                    request: "DoAction",
                    action: {
                      name: buttonHtml.parentNode.parentNode.querySelector(`p.action-name`).innerText
                    },
                    args: globalArguments,
                    id: "DoAction",
                  })
                )
              })
            })
          })
        })
      }

      function GetAction(id) {
        console.log(`getting actions`, actions)
        actions.forEach(action => {
          if (action.id = id) {
            return action
          }
        });
      }


      if (location.hash === `#Action-History` && data.id === `ActionCompleted`) {
        document.querySelector(`main`).innerHTML = ``
      }

      if (location.hash === `#Action-History` && data?.event?.source === `Raw` && data?.event?.type === `Action`) {
        document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`afterbegin`, `<li class="navbar-list-item" data-id="${data.data.id}" data-action-state="pending"><button><p class="title">${data.data.name}</p></button></li>`)
        let listContents = ``
        let action = GetAction(data.data.id)
        console.log(action)
        let subActionCount = `${action.subaction_count} Sub Actions`
        if (action.subaction_count === 0) subActionCount = `${action.subaction_count} Sub Action`
        let arguments = Object.entries(data.data.arguments)
        arguments.forEach(argument => {
          listContents += `<li>${argument[0]}</li><li>${argument[1]}</li>`
        });
        document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `
        <ul data-id="${data.data.id}" class="main-list-wrapper" hidden>
          <div class="info">
            <h2>${data.data.name}</h2>
            <p>${data.data.actionId}</p>
            <p>${data.data.actionId}</p>
            <br>
          </div>
          <ul class="tags">
            <li title="Pending" class="tag-active"><button>Pending</button></li>
            <li title="Completed"><button>Completed</button></li>
          </ul>
          <ul class="action-state-wrapper">
            <ul class="main-list col-2" data-action-state="pending">
              ${listContents}
            </ul>
            <ul class="main-list col-2" data-action-state="completed" hidden></ul>
          </ul>
        </ul>
        `)

        document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Pending] button`).addEventListener(`click`, function () {
          document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Pending]`).classList.add(`tag-active`)
          document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Completed]`).classList.remove(`tag-active`)

          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=completed]`).setAttribute(`hidden`, ``)

          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=pending]`).setAttribute(`hidden`, ``)
          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=pending]`).removeAttribute(`hidden`)
        })
        
        document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Completed] button`).addEventListener(`click`, function () {
          document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Completed]`).classList.add(`tag-active`)
          document.querySelector(`main ul[data-id="${data.data.id}"] .tags li[title=Pending]`).classList.remove(`tag-active`)

          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=pending]`).setAttribute(`hidden`, ``)

          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=completed]`).setAttribute(`hidden`, ``)
          document.querySelector(`main ul[data-id="${data.data.id}"] .action-state-wrapper ul[data-action-state=completed]`).removeAttribute(`hidden`)
        })

        document.querySelector(`nav.navbar ul.navbar-list li button`).addEventListener(`click`, function () {
          let actionId = this.parentNode.getAttribute(`data-id`)
          this.parentNode.classList.add(`nav-active`)
          document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navActiveButton => {
            navActiveButton.classList.remove(`nav-active`)
          });
          this.parentNode.classList.add(`nav-active`)
          document.querySelectorAll(`main ul.main-list-wrapper`).forEach(mainList => {
            mainList.setAttribute(`hidden`, ``)
          });
          document.querySelector(`main ul.main-list-wrapper[data-id="${actionId}"]`).removeAttribute(`hidden`)
        })
      }

      if (location.hash === `#Action-History` && data?.event?.source === `Raw` && data?.event?.type === `ActionCompleted`) {
        document.querySelector(`nav.navbar ul.navbar-list li[data-id="${data.data.id}"]`).setAttribute(`data-state`, `completed`)  
        let listContents = ``
        let arguments = Object.entries(data.data.arguments)
        arguments.forEach(argument => {
          listContents += `<li>${argument[0]}</li><li>${argument[1]}</li>`
        });
        document.querySelector(`main ul[data-id="${data.data.id}"] ul.action-state-wrapper ul[data-action-state=completed]`).innerHTML = listContents

        let queuedAt = data.data.queuedAt
        let queuedAtDate = queuedAt.split(`T`)[0]
        let queuedAtTime = queuedAt.split(`T`)[1].split(`+`)[0]
        queuedAtTime = queuedAtTime.split(`:`)
        queuedAtTime = `${queuedAtTime[0]}:${queuedAtTime[1]}:${queuedAtTime[2].split(`.`)[0]}`
        let queuedAtTimezone = ``
        if (queuedAt.includes(`+`)) queuedAtTimezone = `UTC +${queuedAt.split(`+`)[1]}`
        if (queuedAt.split(`T`)[1].includes(`-`)) queuedAtTimezone = `UTC -${queuedAt.split(`T`)[1].split(`-`)[1]}`
        queuedAt = `${queuedAtDate}, ${queuedAtTime} (${queuedAtTimezone})`

        let startedAt = data.data.startedAt
        let startedAtDate = startedAt.split(`T`)[0]
        let startedAtTime = startedAt.split(`T`)[1].split(`+`)[0]
        startedAtTime = startedAtTime.split(`:`)
        startedAtTime = `${startedAtTime[0]}:${startedAtTime[1]}:${startedAtTime[2].split(`.`)[0]}`
        let startedAtTimezone = ``
        if (startedAt.includes(`+`)) startedAtTimezone = `UTC +${startedAt.split(`+`)[1]}`
        if (startedAt.split(`T`)[1].includes(`-`)) startedAtTimezone = `UTC -${startedAt.split(`T`)[1].split(`-`)[1]}`
        startedAt = `${startedAtDate}, ${startedAtTime} (${startedAtTimezone})`

        let completedAt = data.data.completedAt
        let completedAtDate = completedAt.split(`T`)[0]
        let completedAtTime = completedAt.split(`T`)[1].split(`+`)[0]
        completedAtTime = completedAtTime.split(`:`)
        completedAtTime = `${completedAtTime[0]}:${completedAtTime[1]}:${completedAtTime[2].split(`.`)[0]}`
        let completedAtTimezone = ``
        if (completedAt.includes(`+`)) completedAtTimezone = `UTC +${completedAt.split(`+`)[1]}`
        if (completedAt.split(`T`)[1].includes(`-`)) completedAtTimezone = `UTC -${completedAt.split(`T`)[1].split(`-`)[1]}`
        completedAt = `${completedAtDate}, ${completedAtTime} (${completedAtTimezone})`

        document.querySelector(`main ul[data-id="${data.data.id}"] .info`).insertAdjacentHTML(`beforeend`, `
        <table class="styled">
          <tr>
            <td style="text-align: right">Queued</td>
            <td style="text-align: left">${queuedAt}</td>
          </tr>
          <tr>
            <td style="text-align: right">Started</td>
            <td style="text-align: left">${startedAt}</td>
          </tr>
          <tr>
            <td style="text-align: right">Completed</td>
            <td style="text-align: left">${completedAt}</td>
          </tr>
          <tr>
            <td style="text-align: right">Duration</td>
            <td style="text-align: left">${Math.round(data.data.duration)}ms</td>
          </tr>
        </table>
        `)
      }

      if (location.hash === `#Action-History` && data?.event?.source === `Raw` && data?.event?.type === `SubAction`) {

      }
      
      if (location.hash === `#Present-Viewers` && data.id === `GetActiveViewers`) {
        data.viewers.forEach(viewer => {
          document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item" id="${viewer.id}"><button><p class="title">${viewer.display}</p></button></li>`)
        });

        document.querySelectorAll(`nav.navbar ul.navbar-list li`).forEach(navBarListItem => {
          navBarListItem.addEventListener(`click`, function () {
            navBarListItem.classList.add(`nav-active`)
          
            document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navBarActiveListItem => {
              navBarActiveListItem.classList.remove(`nav-active`)
            })

            navBarListItem.classList.add(`nav-active`)

            data.viewers.forEach(viewer => {
              if (viewer.id === navBarListItem.id) {
                let previousActive = viewer.previousActive
                let previousActiveDate = previousActive.split(`T`)[0]
                let previousActiveTime = previousActive.split(`T`)[1].split(`+`)[0]
                previousActiveTime = previousActiveTime.split(`:`)
                previousActiveTime = `${previousActiveTime[0]}:${previousActiveTime[1]}:${previousActiveTime[2].split(`.`)[0]}`
                let previousActiveTimezone = ``
                if (previousActive.includes(`+`)) previousActiveTimezone = `UTC +${previousActive.split(`+`)[1]}`
                if (previousActive.split(`T`)[1].includes(`-`)) previousActiveTimezone = `UTC -${previousActive.split(`T`)[1].split(`-`)[1]}`
                previousActive = `${previousActiveDate}, ${previousActiveTime} (${previousActiveTimezone})`
                document.querySelector(`main ul.main-list`).innerHTML = ``
                document.querySelector(`main ul.main-list`).classList.add(`col-2`)
                document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`,`
                <li>Display Name</li><li>${viewer.display}</li>
                <li>Login Name</li><li>${viewer.login}</li>
                <li>User Id</li><li>${viewer.id}</li>
                <li>Role</li><li>${viewer.role}</li>
                <li>Subscribed</li><li>${viewer.subscribed}</li>
                <li>Previous Active</li><li>${previousActive}</li>
                <li>Channel Points Used</li><li>${viewer.channelPointsUsed}</li>
                <li>Exempt</li><li>${viewer.exempt}</li>
                <li>Groups</li><li>${viewer.groups.toString().replaceAll(`,`, `, `)}</li>
                </tbody></table>
                `)
              }
            });
          })
        });
      }

      if (location.hash === `#Websocket-Events` && data.id === `GetEvents`) {
        let wsEvents = Object.entries(data.events)
        wsEvents.sort()
        wsEvents.forEach(wsEvent => {
          document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item"><button><p class="title">${wsEvent[0]}</p></button></li>`)
        });

        document.querySelectorAll(`nav.navbar ul.navbar-list li.navbar-list-item`).forEach(navBarListItem => {
          navBarListItem.querySelector(`button`).addEventListener(`click`, function () {
            navBarListItem.classList.add(`nav-active`)
            document.querySelectorAll(`nav.navbar ul.navbar-list li.navbar-list-item.nav-active`).forEach(navActiveListItem => {
              navActiveListItem.classList.remove(`nav-active`)
            });
            navBarListItem.classList.add(`nav-active`)

            document.querySelector(`main ul.main-list`).innerHTML = ``

            wsEvents.forEach(wsEvent => {
              wsEvent[1].sort()

              if (wsEvent[0] === navBarListItem.querySelector(`button p.title`).innerText) {
                document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`, `<li class="list-title">${wsEvent[0]}, ${wsEvent[1].length} Events</li>`)
                wsEvent[1].forEach(wsEventItem => {
                  document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`, `<li>${wsEventItem}</li>`)
                });
              }
            });
          })
        });
      }

      if (location.hash === `#Chat` && data.id === `GetActions`) {
        document.querySelector(`main ul.main-list`).setAttribute(`data-view`, `all`)
        document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `
        <li class="navbar-list-item nav-active" id="all"><button><p class="title">All</p></button></li>
        <li class="navbar-list-item" id="twitch"><button><p class="title">Twitch</p></button></li>
        <li class="navbar-list-item" id="youtube"><button><p class="title">YouTube</p></button></li>
        `)

        document.querySelector(`nav.navbar ul.navbar-list li#all`).addEventListener(`click`, function () {
          document.querySelectorAll(`main ul.main-list li`).forEach(listItem => {
            listItem.setAttribute(`hidden`, ``)
            listItem.removeAttribute(`hidden`)
          });

          this.classList.add(`nav-active`)
          document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navActiveListItem => {
            navActiveListItem.classList.remove(`nav-active`)
          });
          this.classList.add(`nav-active`)
          document.querySelector(`main ul.main-list`).setAttribute(`data-view`, `all`)
        })

        document.querySelector(`nav.navbar ul.navbar-list li#twitch`).addEventListener(`click`, function () {
          document.querySelectorAll(`main ul.main-list li`).forEach(listItem => {
            let eventSource = listItem.getAttribute(`data-source`) || ``
            if (eventSource != `Twitch`) {
              listItem.setAttribute(`hidden`, ``)
            } else {
              listItem.setAttribute(`hidden`, ``)
              listItem.removeAttribute(`hidden`)
            }
          });

          this.classList.add(`nav-active`)
          document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navActiveListItem => {
            navActiveListItem.classList.remove(`nav-active`)
          });
          this.classList.add(`nav-active`)
          document.querySelector(`main ul.main-list`).setAttribute(`data-view`, `twitch`)
        })
        
        document.querySelector(`nav.navbar ul.navbar-list li#youtube`).addEventListener(`click`, function () {
          document.querySelectorAll(`main ul.main-list li`).forEach(listItem => {
            let eventSource = listItem.getAttribute(`data-source`) || ``
            if (eventSource != `YouTube`) {
              listItem.setAttribute(`hidden`, ``)
            } else {
              listItem.setAttribute(`hidden`, ``)
              listItem.removeAttribute(`hidden`)
            }
          });

          this.classList.add(`nav-active`)
          document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navActiveListItem => {
            navActiveListItem.classList.remove(`nav-active`)
          });
          this.classList.add(`nav-active`)
          document.querySelector(`main ul.main-list`).setAttribute(`data-view`, `youtube`)
        })
      }
      
      if (location.hash === `#Chat` && data?.event?.source === `Twitch` || data?.event?.source === `YouTube` && data?.event?.type === `ChatMessage`|| data?.event?.type === `Message`) {
        let chatIcon = ``
        if (data.event.source === `Twitch`) chatIcon = `mdi mdi-twitch`
        if (data.event.source === `YouTube`) chatIcon = `mdi mdi-youtube`

        let hidden = ``
        let view = document.querySelector(`main ul.main-list`).getAttribute(`data-view`)
        
        if (view === `twitch` && data?.event?.source != `Twitch`) hidden = ` hidden`
        if (view === `youtube` && data?.event?.source != `YouTube`) hidden = ` hidden`

        document.querySelector(`main ul.main-list`).insertAdjacentHTML(`afterbegin`, `
        <li data-source="${data.event.source}" data-message-id="${data.data.msgId}"${hidden}>
          <div class="${chatIcon}" style="display: flex; gap: .5rem; align-items: center;">
            <p style="color: ${data.data.message.color};">${data.data.message.username}</p>
            <p>${data.data.message.message}</p>
          </div>
        </li>
        `)
      }
    })
  }
}

let twitchspeakerConnectionData = localStorage.getItem(`streamerbotToolbox__twitchspeaker`) || undefined

if (twitchspeakerConnectionData != undefined) {
  twitchspeakerConnectionData = JSON.parse(twitchspeakerConnectionData)
  document.body.setAttribute(`twitchspeaker-state`, `enabled`)
  connectTwitchSpeakerws()
}

async function connectTwitchSpeakerws() {
  if ("WebSocket" in window) {
    let wsServerUrl = `ws://${twitchspeakerConnectionData.host}:${twitchspeakerConnectionData.port}${twitchspeakerConnectionData.endpoint}`
    const ws = new WebSocket(wsServerUrl)
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to TwitchSpeaker...")

    ws.onclose = function () {
      setTimeout(connectTwitchSpeakerws, 10000)
      document.body.setAttribute(`twitchspeaker-state`, `disconnected`)
      document.querySelectorAll(`header .header-tags a[data-integration=twitchspeaker]`).forEach(headerTag => {
        headerTag.setAttribute(`hidden` , ``)
      });
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to TwitchSpeaker, reconnecting every 10s...")
    }

    ws.onopen = function () {
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to TwitchSpeaker")
      document.body.setAttribute(`twitchspeaker-state`, `connected`)
      document.querySelectorAll(`header .header-tags a[data-integration=twitchspeaker]`).forEach(headerTag => {
        headerTag.setAttribute(`hidden` , ``)
        headerTag.removeAttribute(`hidden`)
      });
      
      if (location.hash === `#TwitchSpeaker`) {
        document.querySelector(`nav.navbar`).parentNode.removeChild(document.querySelector(`nav.navbar`))
        document.querySelector(`main`).classList.add(`full`)

        let defaultSpeakValues = localStorage.getItem(`streamerbotToolbox__twitchspeaker`) || undefined
        let defaultSpeakVoiceAlias = ``
        let defaultSpeakMessage = ``
        if (defaultSpeakValues != undefined) {
          defaultSpeakValues = JSON.parse(defaultSpeakValues)
          
          if (defaultSpeakValues.defaultSpeakVoiceAlias != null) {
            defaultSpeakVoiceAlias = ` value="${defaultSpeakValues.defaultSpeakVoiceAlias}"`
          }
          
          if (defaultSpeakValues.defaultSpeakMessage != null) {
            defaultSpeakMessage = ` value="${defaultSpeakValues.defaultSpeakMessage}"`
          }

          if (defaultSpeakValues === undefined || defaultSpeakValues === null) defaultSpeakValues = ``
        } else {
          defaultSpeakVoiceAlias = ``
          defaultSpeakMessage = `This is a test message`
        }
        document.querySelector(`main`).innerHTML = `
        <ul class="tags">
          <li><button title="Enable">Enable</button></li>
          <li><button title="Disable">Disable</button></li>
          <li><button title="Pause">Pause</button></li>
          <li><button title="Resume">Resume</button></li>
          <li><button title="On">On</button></li>
          <li><button title="Off">Off</button></li>
          <li><button title="Stop">Stop</button></li>
          <li><button title="Clear">Clear</button></li>
          <li><button title="Disable Events">Disable Events</button></li>
          <li><button title="Enable Events">Enable Events</button></li>
          <li><button title="Speaking Mode: All">Speaking Mode: All</button></li>
          <li><button title="Speaking Mode: Command">Speaking Mode: Command</button></li>
        </ul>
        <div class="form-group styled">
          <label for="voice-alias">Voice Alias</label>
          <input type="text" name="voice-alias" id="voice-alias" placeholder="Voice Alias"${defaultSpeakVoiceAlias}>
        </div>
        <div class="form-group styled">
          <label for="message">Message</label>
          <input type="text" name="message" id="message" placeholder="Message"${defaultSpeakMessage}>
        </div>
        <div class="form-group styled">
          <input type="checkbox" name="bad-words-filter" id="bad-words-filter">
          <label for="bad-words-filter">Bad Words Filter</label>
        </div>
        <button class="styled speak">Speak!</button>`

        document.querySelector(`main button.speak`).addEventListener(`click`, function () {
          let voiceAlias = document.querySelector(`.form-group input#voice-alias`).value || ``
          let message = document.querySelector(`.form-group input#message`).value || `This is a test message`
          let badWordsFilter = document.querySelector(`.form-group input#bad-words-filter`).checked

          let twitchspeakerData = localStorage.getItem(`streamerbotToolbox__twitchspeaker`) || `{}`
          twitchspeakerData = JSON.parse(twitchspeakerData)
          twitchspeakerData = Object.entries(twitchspeakerData)
          twitchspeakerData.push([`defaultSpeakVoiceAlias`, voiceAlias])
          twitchspeakerData.push([`defaultSpeakMessage`, message])
          
          twitchspeakerData = Object.fromEntries(twitchspeakerData)
          localStorage.setItem(`streamerbotToolbox__twitchspeaker`, JSON.stringify(twitchspeakerData))

          ws.send(JSON.stringify({
              request: "Speak",
              voice: voiceAlias,
              message: message,
              badWordFilter: badWordsFilter,
              id: "Speak"
            }
          ))

        })

        document.querySelector(`main .tags li button[title="Enable"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Enable",
              id: "Enable"
            }
          ))

          sendNotification(`twitchspeaker`, `Enable`)
        })

        document.querySelector(`main .tags li button[title="Disable"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Disable",
              id: "Disable"
            }
          ))

          sendNotification(`twitchspeaker`, `Disable`)
        })

        document.querySelector(`main .tags li button[title="Pause"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Pause",
              id: "Pause"
            }
          ))

          sendNotification(`twitchspeaker`, `Pause`)
        })

        document.querySelector(`main .tags li button[title="Resume"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Resume",
              id: "Resume"
            }
          ))

          sendNotification(`twitchspeaker`, `Resume`)
        })

        document.querySelector(`main .tags li button[title="On"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "On",
              id: "On"
            }
          ))

          sendNotification(`twitchspeaker`, `On`)
        })
        
        document.querySelector(`main .tags li button[title="Off"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Off",
              id: "Off"
            }
          ))

          sendNotification(`twitchspeaker`, `Off`)
        })

        document.querySelector(`main .tags li button[title="Stop"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Stop",
              id: "Stop"
            }
          ))

          sendNotification(`twitchspeaker`, `Stop`)
        })

        document.querySelector(`main .tags li button[title="Clear"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Clear",
              id: "Clear"
            }
          ))

          sendNotification(`twitchspeaker`, `Clear`)
        })

        document.querySelector(`main .tags li button[title="Enable Events"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Events",
              state: "on",
              id: "Enable Events"
            }
          ))

          sendNotification(`twitchspeaker`, `Enable Events`)
        })

        document.querySelector(`main .tags li button[title="Disable Events"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Events",
              state: "off",
              id: "Disable Events"
            }
          ))

          sendNotification(`twitchspeaker`, `Disable Events`)
        })

        document.querySelector(`main .tags li button[title="Speaking Mode: All"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Mode",
              mode: "all",
              id: "Speaking Mode: All"
            }
          ))

          sendNotification(`twitchspeaker`, `Speaking Mode: All`)
        })

        document.querySelector(`main .tags li button[title="Speaking Mode: Command"]`).addEventListener(`click`, function () {
          ws.send(JSON.stringify({
              request: "Mode",
              mode: "command",
              id: "Speaking Mode: Command"
            }
          ))

          sendNotification(`twitchspeaker`, `Speaking Mode: Command`)
        })
      }
    }

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (!JSON.stringify(data).includes(`"status":"ok"`)) console.log(JSON.stringify(data))
    })
  }
}

// streamerbotIdeas()

async function streamerbotIdeas() {
  let ideasUrl = `https://ideas.streamer.bot`
  let ideasData = {}

  let streamerbotIdeasApiKey
  let streamerbotIdeasLocalData = localStorage.getItem(`streamerbotToolbox__streamerbotIdeas`)

  if (streamerbotIdeasLocalData === null) {
  } else if (streamerbotIdeasLocalData.apiKey === null) {
  } else {
    document.body.setAttribute(`streamerbotIdeas-state`, `enabled`)
    streamerbotIdeasApiKey = streamerbotIdeasLocalData.apiKey
  }

  // ideasData.posts = await fetch(`${ideasUrl}/api/v1/posts?limit=50&view=recent`)
  // ideasData.posts = await ideasData.posts.json()

  ideasData.tags = await fetch(`${ideasUrl}/api/v1/tags`)
  ideasData.tags = await ideasData.tags.json()

  console.log(ideasData)

}

function sendNotification(service, text) {
  let serviceName = service
  if (service === `twitchspeaker`) serviceName = `TwitchSpeaker`
  if (service === `streamer.bot`) serviceName = `Streamer.bot`
  console.log(`%c[${serviceName}]%c ${text}`, `color: #8c75fa;`, `color: white;`)
}
