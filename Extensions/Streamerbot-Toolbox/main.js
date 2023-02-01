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
    name: `Global Variables`,
    integration: `streamer.bot-action-package`
  },
  {
    name: `Commands`,
    integration: `streamer.bot-action-package`
  },
  {
    name: `TwitchSpeaker`,
    integration: `twitchspeaker`
  }
]


if (location.hash === ``) location.href = `#About`

let streamerbotToolbox__connection = localStorage.getItem(`streamerbotToolbox__connection`)
if (streamerbotToolbox__connection === undefined || streamerbotToolbox__connection === null || streamerbotToolbox__connection === ``) {
  streamerbotToolbox__connection = {
    host: `localhost`,
    port: `8080`,
    endpoint: `/`
  }
} else {
  streamerbotToolbox__connection = JSON.parse(streamerbotToolbox__connection)
  if (streamerbotToolbox__connection.host === undefined) streamerbotToolbox__connection.host = `localhost`
  if (streamerbotToolbox__connection.port === undefined) streamerbotToolbox__connection.port = `8080`
  if (streamerbotToolbox__connection.endpoint === undefined) streamerbotToolbox__connection.endpoint = `/`
}

if (localStorage.getItem(`streamerbotToolbox__connection`) === null) localStorage.setItem(`streamerbotToolbox__connection`, JSON.stringify(streamerbotToolbox__connection))

let wsServerUrl = `ws://${streamerbotToolbox__connection.host}:${streamerbotToolbox__connection.port}${streamerbotToolbox__connection.endpoint}`

let headerAside = `
<div class="form-area"><label>Url</label><input type="url" value="${streamerbotToolbox__connection.host}" class="url"></div>
<div class="form-area"><label>Port</label><input type="number" value="${streamerbotToolbox__connection.port}" max="9999" class="port"></div>
<div class="form-area"><label>Endpoint</label><input type="text" value="${streamerbotToolbox__connection.endpoint}" class="endpoint"></div>
<button class="connect-websocket">Connect</button>`
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

  document.querySelector(`header .header-tags`).insertAdjacentHTML(`beforeend`, `<li${headerTagActive}${hidden}><a href="#${headerTagHash}" title="${headerTag.name}" data-integration="${headerTag.integration}">${headerTag.name}</a></li$>`)
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


document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, function (e) {
  let DOM_streamerbotToolbox__connection = {}

  DOM_streamerbotToolbox__connection.host = document.querySelector(`header aside .form-area .url`).value
  DOM_streamerbotToolbox__connection.port = document.querySelector(`header aside .form-area .port`).value
  DOM_streamerbotToolbox__connection.endpoint = document.querySelector(`header aside .form-area .endpoint`).value

  localStorage.setItem(`streamerbotToolbox__connection`, JSON.stringify(DOM_streamerbotToolbox__connection))

  location.reload()
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

let streamerbotActionPackage__name  = `Streamer.bot Toolbox Partial - Websocket Handler`
let streamerbotActionPackage__version = `1.0.0`
let streamerbotActionPackage__group = `Streamer.bot Toolbox Partials (v${streamerbotActionPackage__version})`

connectws()

async function connectws() {
  let eventArgsMap = await fetch(`./eventArgsMap.json`)
  eventArgsMap = await eventArgsMap.json()

  let randomEventArgs = await fetch(`./random.json`)
  randomEventArgs = await randomEventArgs.json()

  if ("WebSocket" in window) {
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
      document.body.classList.add(`disconnected`)
    }
    
    ws.onopen = function () {
        ws.send(
          JSON.stringify({
            request: "GetInfo",
            id: "GetInfo",
          })
        )
        ws.send(
          JSON.stringify({
            request: "GetActions",
            id: "VerifyActions",
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
        instance = data.info
        let instanceOS = instance.os
        if (instance.os === `windows`) instanceOS = `<span class="mdi mdi-microsoft-windows"> Windows</span>`
        if (instance.os === `linux`) instanceOS = `<span class="mdi mdi-linux"> Linux</span>`
        if (instance.os === `macosx`) instanceOS = `<span class="mdi mdi-apple"> MacOS</span>`
        document.querySelector(`header aside`).innerHTML = `
        <p class="instance-info">Streamer.bot - ${data.info.name}
        <small>${instance.instanceId}<br>
        ${instanceOS} • ${instance.version}</small></p>`
        document.title = `${instance.name} (${instance.version}) • ${documentTitle}`
      }

      if (data?.id === `VerifyActions`) {
        let dataStreamerbotActionPackage = ``
        data.actions.forEach(action => {
          dataStreamerbotActionPackage = document.body.getAttribute(`data-streamerbot-action-package`)
          if (action.name === streamerbotActionPackage__name && action.group === streamerbotActionPackage__group) {
            console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Websocket Handler action found")
            document.querySelectorAll(`header .header-tags a[data-integration="streamer.bot-action-package"]`).forEach(headerTag => {
              headerTag.parentNode.removeAttribute(`hidden`)
            });

            ws.send(JSON.stringify({
              request: `Subscribe`,
              id: `WebsocketHandlerAction`,
              events: {
                general: [`Custom`]
              },
            }))

            document.body.setAttribute(`data-streamerbot-action-package`, `installed`)
          }


          if (dataStreamerbotActionPackage != `installed` && action.name === streamerbotActionPackage__name && action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``) != streamerbotActionPackage__version.replaceAll(`.`, ``) && !isNaN(action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``))) {
            document.body.setAttribute(`data-streamerbot-action-package`, `outdated`)
            document.body.setAttribute(`data-streamerbot-action-package-outdated`, action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``))
          } else if (dataStreamerbotActionPackage != `installed` && dataStreamerbotActionPackage != `outdated` && action.name === streamerbotActionPackage__name && action.group != streamerbotActionPackage__group) {
            document.body.setAttribute(`data-streamerbot-action-package`, `renamed`)
          } else if (dataStreamerbotActionPackage != `installed` && dataStreamerbotActionPackage != `outdated` && dataStreamerbotActionPackage != `renamed` && action.name != streamerbotActionPackage__name) {
            document.body.setAttribute(`data-streamerbot-action-package`, `absent`)
          }
        });
      } else if (location.hash === `#Actions` && data.id === `GetInfo`) {
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
              twitch: [`ChatMessage`, `ChatMessageDeleted`],
              youTube: [`Message`, `MessageDeleted`]
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

          let dataStreamerbotActionPackage = document.body.getAttribute(`data-streamerbot-action-package`)
          let errorMessage = ``

          if (dataStreamerbotActionPackage === `outdated`) {
            errorMessage = `
            <blockquote class="error">
              <p class="blockquote-text">Your Streamer.bot Action Package is outdated, please go to the settings and re-install the new version to properly use it again.</p>
            </blockquote>
            `
          } else if (dataStreamerbotActionPackage === `renamed`) {
            errorMessage = `
            <blockquote class="warning">
              <p class="blockquote-text">You've edited something with your Streamer.bot Action Package, please go to the settings and re-install it again.</p>
            </blockquote>
            `
          } else if (dataStreamerbotActionPackage === `absent`) {
            errorMessage = `
            <blockquote class="info">
              <p class="blockquote-text">You don't have the Streamer.bot Action Package installed, thus you don't have access to all the features of this website. Go to settings and install the Streamer.bot Action package.</p>
            </blockquote>
            `
          }

          document.body.querySelector(`main`).innerHTML = `
          ${errorMessage}
          <h1 style="padding-bottom: 3rem;">${welcomeMessage}</h1>
          <p>Streamer.bot Toolbox (v${version}) is made for making developing Streamer.bot actions easier;</p>
          <p>this tool is currently a very work in progress, feautures may come and go over time.</p>
          <br>
          <p>This tool requires your <code>Server/Clients</code> --> <code>Websocket Server</code> to be enabled.</p>
          <br>
          <p>Integrations:</p>
          <p>• Streamer.bot</p>
          <p>• Streamer.bot Action Package (contains global variables, chat features, and more!)</p>
          <p>• TwitchSpeaker</p>
          <br>
          <p><b>Open the settings in bottom right to enable these integrations or for more info</b></p>
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
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Settings • Integrations`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `All integrations that can be connected`
            
            document.querySelector(`.settings-modal .main`).innerHTML = `
            <ul class="integrations-list">
              <li class="mdi mdi-check" data-integration="streamer.bot"> Streamer.bot (${instance.version}) • ${wsServerUrl}</li>
            </ul>
            `

            // Streamer.bot Action Package

            if (document.body.getAttribute(`data-streamerbot-action-package`) === `absent`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-cloud-download" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (used for global variables, chat and more) <button id="more-info">Download & More Info</button></li>`)
            if (document.body.getAttribute(`data-streamerbot-action-package`) === `outdated`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-close-thick" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (outdated) <button id="more-info">Update to use it again</button></li>`)
            if (document.body.getAttribute(`data-streamerbot-action-package`) === `renamed`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-alert" data-integration="streamer.bot-action-package"> Streamer.bot Action Package, You've edited something that breaks it <button id="more-info">Please re-install it again</button></li>`)
            if (document.body.getAttribute(`data-streamerbot-action-package`) === `installed`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-check" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (v${streamerbotActionPackage__version}) • ${wsServerUrl}</li>`)

            if (document.body.getAttribute(`data-streamerbot-action-package`) != `installed`) {
              document.querySelector(`.settings-modal .main ul.integrations-list li[data-integration="streamer.bot-action-package"] button#more-info`).addEventListener(`click`, function () {
                document.body.insertAdjacentHTML(`afterbegin`, `
                <div class="settings-modal-alt small" data-settings-modal-alt="twitchspeaker-connection">
                  <button class="close-button mdi mdi-close" onclick="this.parentNode.remove()"></button>
                  <div class="main">
                    <h2>Streamer.bot Action Package</h3>
                    <br>
                    <p>The Streamer.bot Action Package is used for getting/setting global variables and sending chat messages to Twitch/YouTube.</p>
                    <br>
                    <p>To use this you simply need to import the code in Streamer.bot, and that's it. Note: when changing the action name or the group name, these features won't work anymore. Also when your Streamer.bot Action Package is outdated it also won't work anymore and thus you need to re-import it again.</p>
                    <br>
                    <button onclick="window.open('./action-package.sb')">Download</button>
                  </div>
                </div>
              `)
              })
            }

            // TwitchSpeaker
            
            let integrationsList__twitchspeaker = `<li class="mdi mdi-plus" data-integration="twitchspeaker"> TwitchSpeaker <button>Connect!</button></li>`

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
                  localStorage.setItem(`streamerbotToolbox__twitchspeaker`, JSON.stringify({
                      host: table.querySelector(`tbody tr td input#websocket-host`).value,
                      port: table.querySelector(`tbody tr td input#websocket-port`).value,
                      endpoint: table.querySelector(`tbody tr td input#websocket-endpoint`).value
                    })
                  )
                  location.reload()
                })
              })
          }
        
          function reloadBroadcaster() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Settings • Broadcaster `
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
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Settings • Random Users`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Random user variables`
            
            let prevRandomUsers = localStorage.getItem(`streamerbotToolbox__randomUsers`) || 0
            if (prevRandomUsers <= 0) prevRandomUsers = `0`
            if (isNaN(prevRandomUsers)) prevRandomUsers = `0`

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
        })
      }

      if (location.hash === `#Actions` && data.id === `GetActions`) {

        document.querySelector(`main`).classList.add(`col-2`)

        let eventTestDropdown = ``
        let eventArgsEntries = Object.entries(eventArgsMap)
        eventArgsEntries.forEach(eventArgEntry => {
          eventTestDropdown += `<option value="${eventArgEntry[0]}">[${eventArgEntry[1].category.toUpperCase()}] ${eventArgEntry[1].display}</option>`
        });
        eventTestDropdown = `
        <div class="form-group styled flex align-center">
          <label for="event-search">Search Event</label>
          <input id="event-search" type="search" placeholder="search...">
        </div>        
        <div class="form-group styled">
          <select><option value="None">None</option>${eventTestDropdown}</select>
        </div>`

        
        document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `
        <aside>
          <div class="card-grid">
            <div class="card events">
              <p class="card-title">Emulate Events</p>
              <hr>
              ${eventTestDropdown}
            </div>
            <div class="card arguments">
              <p class="card-title">Arguments</p>
              <hr>
              <table class="styled full"></table>
            </div>
          </div>
        </aside>
        `)

        document.querySelector(`main aside .card.events input[type="search"]`).addEventListener(`keydown`, () => {
          setTimeout(() => {
            let searchTerm = document.querySelector(`main aside .card.events input[type="search"]`).value.toLowerCase()
            document.querySelectorAll(`main aside .card.events select option`).forEach(option => {
              if (option.innerHTML.toLowerCase().includes(searchTerm) || option.value.toLowerCase().includes(searchTerm) || searchTerm === ``) {
                if (option.value != `None`) {
                  option.setAttribute(`hidden`, ``)
                  option.removeAttribute(`hidden`)
                }
              } else {
                if (option.value != `None`) {
                  option.setAttribute(`hidden`, ``)
                }
              }
            });
          }, 50);
        })
            
        
        reloadArgumentsTable()
        
        function reloadArgumentsTable() {
          let argumentsTable = document.querySelector(`main aside .card.arguments table`)
          let argumentsData = Object.entries(JSON.parse(localStorage.getItem(`streamerbotToolbox__arguments`) || `{}`) ?? {}) ?? []

          if (argumentsData.length === 0) {
            argumentsTable.innerHTML = `
            <tbody>
              <tr>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
              </tr>
            </tbody>`

          } else {
            argumentsTable.innerHTML = `<tbody></tbody>`

            argumentsData.forEach(arg => {
              argumentsTable.querySelector(`tbody`).insertAdjacentHTML(`beforeend`, `
              <tr>
                <td contenteditable="true">${arg[0]}</td>
                <td contenteditable="true">${arg[1]}</td>
              </tr>
              `)
            });
          }
          updateArgumentsRows()
        }
        
        function updateArgumentsRows() {
          setTimeout(() => {
            let argumentsTable = document.querySelector(`main aside .card.arguments table`)
            argumentsTable.querySelectorAll(`tr:not(:first-child)`).forEach(tableRow => {
              let tableCellFirst = tableRow.querySelector(`td:first-child`).innerHTML
              let tableCellLast = tableRow.querySelector(`td:last-child`).innerHTML
              if (tableCellFirst === `` && tableCellLast === ``) {
                tableRow.remove()
              }
            });
  
            let lastRow = argumentsTable.querySelector(`table tr:last-child`)
            if (
              lastRow.querySelector(`td:first-child`).innerHTML != `` &&
              lastRow.querySelector(`td:last-child`).innerHTML != ``
            ) {
              argumentsTable.querySelector(`tbody`).insertAdjacentHTML(`beforeend`, `
              <tr>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
              </tr>
              `)
            }
  
            argumentsTable.querySelectorAll(`td`).forEach(tableCell => {
              tableCell.addEventListener(`keydown`, updateArgumentsRows)
              tableCell.addEventListener(`keydown`, saveArgumentsTable)
            });
          }, 50);
        }

        function saveArgumentsTable() {
          setTimeout(() => {
            let argumentsTable = document.querySelector(`main aside .card.arguments table`)
            let argumentsData = []
            argumentsTable.querySelectorAll(`tr`).forEach(tableRow => {
              if (
                tableRow.querySelector(`td:first-child`).innerHTML != `` &&
                tableRow.querySelector(`td:last-child`).innerHTML != ``
              ) {
                argumentsData.push([
                  tableRow.querySelector(`td:first-child`).innerHTML,
                  tableRow.querySelector(`td:last-child`).innerHTML
                ])
              }
            });
  
            localStorage.setItem(`streamerbotToolbox__arguments`, JSON.stringify(Object.fromEntries(argumentsData)))
          }, 50);
        }

        
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

                let arguments = Object.entries(JSON.parse(localStorage.getItem(`streamerbotToolbox__arguments`) || `{}`) ?? {}) ?? []

                if (broadcaster?.connected.includes(`twitch`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `Twitch`) {
                  arguments.push([`broadcastUser`, broadcasterObj.user])
                  arguments.push([`broadcastUserName`, broadcasterObj.userName])
                  arguments.push([`broadcastUserId`, broadcasterObj.userId])
                  arguments.push([`broadcastIsAffiliate`, broadcasterObj.isAffiliate])
                  arguments.push([`broadcastIsPartner`, broadcasterObj.isPartner])
                }
                
                if (broadcaster?.connected.includes(`youtube`) && localStorage.getItem(`streamerbotToolbox__broadcastService`) === `YouTube`) {
                  arguments.push([`broadcastUserName`, broadcasterObj.userName])
                  arguments.push([`broadcastUserId`, broadcasterObj.userId])
                  arguments.push([`broadcastUserProfileImage`, broadcasterObj.profileImage])
                }

                let randomUserCount = localStorage.getItem(`streamerbotToolbox__randomUsers`)
                if (randomUserCount <= 0) randomUserCount = 0
                if (isNaN(randomUserCount)) randomUserCount = 0
                if (randomUserCount > 0 && presentViewers.viewers.length > 0) {
                  for (let presentViewerRunTime = 0; presentViewerRunTime < randomUserCount; presentViewerRunTime++) {                    
                    let randomUser = presentViewers.viewers[Math.floor(Math.random()*presentViewers.viewers.length)];
                    arguments.push([`randomUser${presentViewerRunTime}`, randomUser.display])
                    arguments.push([`randomUserName${presentViewerRunTime}`, randomUser.login])
                    arguments.push([`randomUserId${presentViewerRunTime}`, randomUser.id])  
                  }
                }

                arguments.push([`source`, `StreamerbotToolbox`])

                let selectedEventArgs = document.querySelector(`main aside .card.events select`).value
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
                        arguments.push([`input${index}`,           input])
                        arguments.push([`inputEscaped${index}`,    encodeURI(input)])
                        arguments.push([`inputUrlEncoded${index}`, encodeURI(input)])
                      });

                      if (arg[0] === `tagCount`) {
                        let randomEventArgs__tagCount = Math.floor(Math.random() * 5) + 1
                        let randomEventArgs__tagsDelimited = []
                        arg[1] = `${randomEventArgs__tagCount}`
                        arguments.push([`tags`, 'System.Collections.Generic.List`1[System.String]'])

                        for (let randomEventArgs__tagRunTime = 0; randomEventArgs__tagRunTime < randomEventArgs__tagCount; randomEventArgs__tagRunTime++) {
                          let randomEventArgs__tags = randomEventArgs.tags[Math.floor(Math.random()*randomEventArgs.tags.length)]
                          arguments.push([`tag${randomEventArgs__tagRunTime}`, randomEventArgs__tags])
                          randomEventArgs__tagsDelimited.push(randomEventArgs__tags)
                        }

                        arguments.push([`tagsDelimited`, randomEventArgs__tagsDelimited.join(`,`)])
                      }
                      
                      arguments.push(arg)
                    });
                  }
                });
                
                arguments = Object.fromEntries(arguments)
                console.log(`Adding`, arguments)
                
                ws.send(
                  JSON.stringify({
                    request: "DoAction",
                    action: {
                      name: buttonHtml.parentNode.parentNode.querySelector(`p.action-name`).innerText
                    },
                    args: arguments,
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

      if (location.hash === `#Chat` && data.id === `GetInfo`) {
        document.querySelector(`main ul.main-list`).setAttribute(`data-view`, `all`)
        document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `
        <li class="navbar-list-item nav-active" id="all"><button><p class="title">All</p></button></li>
        <li class="navbar-list-item" id="twitch"><button><p class="title">Twitch</p></button></li>
        <li class="navbar-list-item" id="youtube"><button><p class="title">YouTube</p></button></li>
        `)

        document.querySelector(`main ul.main-list`).innerHTML = `
        <div class="send-message">
          <div class="form-group styled no-margin">
            <button class="clear-chat no-border-radius no-margin" title="Clear Chat">Clear Chat</button>
            <select class="no-border-radius no-margin fit-content">
              <option value="Twitch">Twitch</option>
              <option value="TwitchBot">Twitch (BOT)</option>
              <option value="YouTube">YouTube</option>
              <option value="All">All</option>
            </select>
            <input type="text" placeholder="Send message to chat!" class="no-margin no-border-radius">
            <button class="submit no-border-radius no-margin">Send</button>
          </div>
        </div>`

        
        document.querySelector(`ul.main-list .send-message button.clear-chat`).addEventListener(`click`, function () {
          ws.send(
            JSON.stringify({
              request: `DoAction`,
              action: {
                name: streamerbotActionPackage__name
              },
              args: {
                wsRequest: `TwitchClearChatMessages`
              },
              id: `DoAction`
            })
          )

          document.querySelectorAll(`ul.main-list li`).forEach(listItem => {
            listItem.remove()
          });
        })

        document.querySelector(`ul.main-list .send-message button.submit`).addEventListener(`click`, SendChatMessage)
        document.querySelector(`ul.main-list .send-message input`).addEventListener(`keypress`, function (keypress) {
          if (keypress.key === `Enter`) SendChatMessage()
        })
        
        function SendChatMessage() {
          let package__chatMessage = document.querySelector(`ul.main-list .send-message input`).value
          let package__chatService = document.querySelector(`ul.main-list .send-message select`).value
          document.querySelector(`ul.main-list .send-message input`).value = ``
          document.querySelector(`ul.main-list .send-message input`).focus()
          document.querySelector(`ul.main-list .send-message input`).select()

          console.log(`[${package__chatService}] ${package__chatMessage}`)

          let package__args = {}

          if (package__chatService === `All`) {
            ws.send(
              JSON.stringify({
                request: `DoAction`,
                action: {
                  name: streamerbotActionPackage__name
                },
                args: {
                  wsRequest: `TwitchSendBroadcasterMessage`,
                  wsData: package__chatMessage
                },
                id: `DoAction`
              })
            )
            ws.send(
              JSON.stringify({
                request: `DoAction`,
                action: {
                  name: streamerbotActionPackage__name
                },
                args: {
                  wsRequest: `YouTubeSendMessage`,
                  wsData: package__chatMessage
                },
                id: `DoAction`
              })
            )
          } else if (package__chatService === `Twitch`) {
            package__args = {
              wsRequest: `TwitchSendBroadcasterMessage`,
              wsData: package__chatMessage
            }
          } else if (package__chatService === `TwitchBot`) {
            package__args = {
              wsRequest: `TwitchSendBotMessage`,
              wsData: package__chatMessage
            }
          } else if (package__chatService === `YouTube`) {
            package__args = {
              wsRequest: `YouTubeSendMessage`,
              wsData: package__chatMessage
            }
          }

          if (package__chatService != `All`) {
            ws.send(
              JSON.stringify({
                request: `DoAction`,
                action: {
                  name: streamerbotActionPackage__name
                },
                args: package__args,
                id: `DoAction`
              })
            )
          }
        }

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
      
      if (location.hash === `#Chat` && data?.event?.source === `Twitch` && data?.event?.type === `ChatMessage`) {
        TwitchChatMessageEvent()
        async function TwitchChatMessageEvent() {  
          let hidden = ` hidden`
          let view = document.querySelector(`main ul.main-list`).getAttribute(`data-view`)
          
          if (view === `twitch` || view === `all`) hidden = ``

          let profileImageUrl = await fetch(`https://decapi.me/twitch/avatar/${data.data.message.username}`)
          profileImageUrl = await profileImageUrl.text()
  
          document.querySelector(`main ul.main-list`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="${data.event.source}" data-message-id="${data.data.message.msgId}"${hidden}>
          <div style="display: flex; gap: .5rem; align-items: center;">
            <button class="delete-message mdi mdi-trash-can"></button>
              <div class="profile-image mdi mdi-twitch" style="display: flex; align-items: center;">
                <img src="${profileImageUrl}" alt="" style="width: 1rem; height: 1rem; border-radius: 100vmax;">
              </div>
              <p style="color: ${data.data.message.color};">${data.data.message.displayName}</p>
              <p>${data.data.message.message}</p>
            </div>
          </li>
          `)
        }

          let listItem = document.querySelector(`main ul.main-list li`)
          console.log(listItem)
          listItem.querySelector(`.delete-message`).addEventListener(`click`, function () {
            ws.send(
              JSON.stringify({
                request: `DoAction`,
                action: {
                  name: streamerbotActionPackage__name
                },
                args: {
                  wsRequest: `TwitchDeleteMessage`,
                  wsData: listItem.getAttribute(`data-message-id`)
                },
                id: `DoAction`
              })
            )
          })
      }

      if (location.hash === `#Chat` && data?.event?.source === `Twitch` && data?.event?.type === `ChatMessagasdsdae`) {
        TwitchChatMessageEvent()
        async function TwitchChatMessageEvent() {  
          let hidden = ` hidden`
          let view = document.querySelector(`main ul.main-list`).getAttribute(`data-view`)
          
          if (view === `twitch` || view === `all`) hidden = ``

          let profileImageUrl = await fetch(`https://decapi.me/twitch/avatar/${data.data.message.username}`)
          profileImageUrl = await profileImageUrl.text()
  
          document.querySelector(`main ul.main-list`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="${data.event.source}" data-message-id="${data.data.msgId}"${hidden}>
            <div style="display: flex; gap: .5rem; align-items: center;">
              <div class="profile-image mdi mdi-twitch" style="display: flex; align-items: center;">
                <img src="${profileImageUrl}" alt="" style="width: 1rem; height: 1rem;">
              </div>
              <p style="color: ${data.data.message.color};">${data.data.message.displayName}</p>
              <p>${data.data.message.message}</p>
            </div>
          </li>
          `)
        }
      }

      if (location.hash === `#Global-Variables` && data?.id === `WebsocketHandlerAction`) {
        document.querySelector(`nav.navbar`).remove()
        document.querySelector(`main`).classList.add(`full`)

        document.querySelector(`main`).innerHTML = `
        <div class="card-grid">
          <div class="card">
            <p class="card-title">Get Global Variable</p>
            <hr>
            <div class="form-group styled">
              <label for="get-global-variable--variable-name">Variable Name</label>
              <input type="text" name="voice-alias" id="get-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"getvariable": ""}`).getvariable ?? ``}">
            </div>
            <div class="form-group styled">
              <button class="styled" id="get-global-variable--submit">Run</button>
            </div>
            <pre class="styled" id="get-global-variable--output">Output: <span class="output"></span></pre>
          </div>

          <!--  -->
          <!--  -->

          <div class="card">
            <p class="card-title">Set Global Variable</p>
            <hr>
            <div class="form-group styled">
              <label for="set-global-variable--variable-name">Variable Name</label>
              <input type="text" id="set-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"setvariable": ""}`).setvariable ?? ``}">
            </div>
            <div class="form-group styled">
              <label for="set-global-variable--value">Value</label>
              <input type="text" id="set-global-variable--value" placeholder="Value" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"setvalue": ""}`).setvalue ?? ``}">
            </div>
            <div class="form-group styled">
              <button class="styled" id="set-global-variable--submit">Run</button>
            </div>
          </div>

          <!--  -->
          <!--  -->

          <div class="card">
            <p class="card-title">Unset Global Variable</p>
            <hr>
            <div class="form-group styled">
              <label for="unset-global-variable--variable-name">Variable Name</label>
              <input type="text" id="unset-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"unsetvariable": ""}`).unsetvariable ?? ``}">
            </div>
            <div class="form-group styled">
              <button class="styled" id="unset-global-variable--submit">Run</button>
            </div>
          </div>
        </div>
        `

        document.getElementById(`get-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariable = document.getElementById(`get-global-variable--variable-name`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          console.log(streamerbotToolbox__globalVariables)
          streamerbotToolbox__globalVariables.getvariable = wsDataGlobalVariable
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))
          
          ws.send(
            JSON.stringify({
              request: `DoAction`,
              action: {
                name: streamerbotActionPackage__name
              },
              args: {
                wsRequest: `GetGlobalVariable`,
                wsData: wsDataGlobalVariable
              },
              id: `DoAction`
            })
          )
        })

        document.getElementById(`set-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`set-global-variable--variable-name`).value
          let wsDataGlobalVariableValue = document.getElementById(`set-global-variable--value`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          streamerbotToolbox__globalVariables.setvariable = wsDataGlobalVariableName
          streamerbotToolbox__globalVariables.setvalue = wsDataGlobalVariableValue
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))

          ws.send(
            JSON.stringify({
              request: `DoAction`,
              action: {
                name: streamerbotActionPackage__name
              },
              args: {
                wsRequest: `SetGlobalVariable`,
                wsDataName: wsDataGlobalVariableName,
                wsDataValue: wsDataGlobalVariableValue
              },
              id: `DoAction`
            })
          )
        })

        document.getElementById(`unset-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`unset-global-variable--variable-name`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          streamerbotToolbox__globalVariables.unsetvariable = wsDataGlobalVariableName
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))

          ws.send(
            JSON.stringify({
              request: `DoAction`,
              action: {
                name: streamerbotActionPackage__name
              },
              args: {
                wsRequest: `UnsetGlobalVariable`,
                wsData: wsDataGlobalVariableName
              },
              id: `DoAction`
            })
          )
        })
      }

      if (location.hash === `#Global-Variables` && data?.event?.source === `None` && data?.event?.type === `Custom`) {
        if (data.data.wsRequest === `GetGlobalVariable`) {
          if (data.data.wsData === ``) data.data.wsData = `Global Variable Doesn't Exist or it doesn't have a value`
          document.querySelector(`#get-global-variable--output .output`).innerHTML = data.data.wsData
        }
      }

      if (location.hash === `#Commands` && data?.id === `WebsocketHandlerAction`) {
        ws.send(
          JSON.stringify({
            request: `DoAction`,
            action: {
              name: streamerbotActionPackage__name
            },
            args: {
              wsRequest: `GetCommandsFromFile`
            },
            id: `DoAction`
          })
        )
      }

      if (location.hash === `#Commands` && data?.event?.source === `None` && data?.event?.type === `Custom`) {
        if (data.data.wsRequest === `GetCommandsFromFile`) {
          if (data.data.wsData != ``) {
            GetCommandsData = JSON.parse(decodeURI(data.data.wsData.replaceAll(`\n`, ``).replaceAll(`\r`, ``)))
            console.log(GetCommandsData)
            let commands = GetCommandsData.commands
            let commandGroups = []

            commands.forEach(command => {
              if (!Object.keys(Object.fromEntries(commandGroups)).includes(command.group) && command.group != null && command.group != ``) {
                commandGroups.push([command.group, 0])
              }
            });
            
            commandGroups.sort(function (a, b) {
              return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
            });

            commandGroups.unshift([`None`, 0])
            commandGroups.unshift([`All`, 0])

            commands.forEach(command => {
              commandGroups.forEach(commandGroup => {
                if (command.group === commandGroup[0]) {
                  commandGroup[1] = commandGroup[1] + 1
                } else if (command.group === `` && commandGroup[0] === `None`) {
                  commandGroup[1] = commandGroup[1] + 1
                }
                
                if (commandGroup[0] === `All`) {
                  commandGroup[1] = commandGroup[1] + 1
                }
              });
            });
            
            commandGroups.forEach(command => {     
              let commandsText = `${command[1]} Commands`
              if (command[1] === 1) commandsText = `${command[1]} Command`    
              document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `
              <li class="navbar-list-item" data-command-name="${command[0]}" data-command-count="${command[1]}">
                <button>
                  <p class="title">${command[0]}</p>
                  <p class="description">${commandsText}</p>
                </button>
              </li>
              `)
            });

            document.querySelectorAll(`nav.navbar ul.navbar-list li`).forEach(listItem => {
              listItem.querySelector(`button`).addEventListener(`click`, function () {
                listItem.classList.add(`nav-active`)
                
                document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(listItem => {
                  listItem.classList.remove(`nav-active`)
                });

                listItem.classList.add(`nav-active`)

                let selectCommandOptions = ``
                commands.forEach(command => {
                  if (listItem.getAttribute(`data-command-name`) === `All`) {
                    selectCommandOptions += `<option value="${command.id}">${command.command}</option>`
                  } else if (listItem.getAttribute(`data-command-name`) === `None` && command.group === ``) {
                    selectCommandOptions += `<option value="${command.id}">${command.command}</option>`
                  } else if (command.group === listItem.getAttribute(`data-command-name`)) {
                    selectCommandOptions += `<option value="${command.id}">${command.command}</option>`
                  }
                });

                document.querySelector(`main`).innerHTML = `
                <div class="command-information">
                  <h2>${listItem.getAttribute(`data-command-name`)}</h2>
                  <hr>
                  <div class="form-group styled">
                    <label for="command-id">Command</label>
                    <select>
                    ${selectCommandOptions}
                    </select>
                  </div>
                  <div class="form-group styled">
                    <label for="user-name">User Name (used in user cooldown requests)</label>
                    <input type="text" id="user-name" placeholder="User Name (used in user cooldown requests)" value="">
                  </div>
                </div>
                <br>
                <div class="card-grid">
                  <div class="card enabled-state">
                    <p class="card-title">Enabled State</p>
                    <hr>
                    <div class="form-group styled flex">
                      <button id="enable">Enable</button>
                      <button id="disable">Disable</button>
                    </div>
                  </div>

                  <!--  -->
                  <!--  -->

                  <div class="card global-cooldown">
                    <p class="card-title">Global Cooldown (in seconds)</p>
                    <hr>
                    <div class="form-group styled flex">
                      <button id="reset">Reset</button>
                      <button id="remove">Remove</button>
                    </div>
                    <div class="form-group styled flex">
                      <input type="number" id="global-cooldown" placeholder="Global Cooldown" value="">
                      <button id="add">Add</button>
                      <button id="update">Update</button>
                    </div>
                  </div>

                  <!--  -->
                  <!--  -->

                  <div class="card user-cooldown">
                    <p class="card-title">User Cooldown (in seconds)</p>
                    <hr>
                    <div class="form-group styled flex">
                      <button id="reset">Reset</button>
                      <button id="remove">Remove</button>
                      <button id="reset-all">Reset All</button>
                      <button id="remove-all">Remove All</button>
                    </div>
                    <div class="form-group styled flex">
                      <input type="number" id="user-cooldown" placeholder="User Cooldown" value="">
                      <button id="add">Add</button>
                      <button id="add-to-all">Add to all</button>
                      <button id="update">Update</button>
                    </div>
                  </div>

                </div>
                `

                /// ///////////// ///
                /// Enabled State ///
                /// ///////////// ///

                document.querySelector(`main .card-grid .card.enabled-state .form-group #enable`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `EnableCommandById`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.enabled-state .form-group #disable`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `DisableCommandById`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                /// /////////////// ///
                /// Global Cooldown ///
                /// /////////////// ///

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #reset`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandResetGlobalCooldown`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #remove`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandRemoveGlobalCooldown`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #add`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandAddGlobalCooldown`,
                        wsDataId: commandId,
                        wsDataDuration: wsDataDuration
                      },
                      id: `DoAction`
                    })
                  )
                })
                
                document.querySelector(`main .card-grid .card.global-cooldown .form-group #update`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandSetGlobalCooldown`,
                        wsDataId: commandId,
                        wsDataDuration: wsDataDuration
                      },
                      id: `DoAction`
                    })
                  )
                })

                /// ///////////// ///
                /// User Cooldown ///
                /// ///////////// ///

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #reset`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataUserId = document.querySelector(`main .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandResetUserCooldown`,
                        wsDataId: commandId,
                        wsDataUserId: wsDataUserId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #remove`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataUserId = document.querySelector(`main .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandRemoveUserCooldown`,
                        wsDataId: commandId,
                        wsDataUserId: wsDataUserId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #reset-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandResetAllUserCooldowns`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #remove-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandRemoveAllUserCooldowns`,
                        wsData: commandId
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #add`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value
                  let wsDataUserId = document.querySelector(`main .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandAddUserCooldown`,
                        wsDataId: commandId,
                        wsDataUserId: wsDataUserId,
                        wsDataDuration: wsDataDuration
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #add-to-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandAddAllUserCooldowns`,
                        wsDataId: commandId,
                        wsDataDuration: wsDataDuration
                      },
                      id: `DoAction`
                    })
                  )
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #update`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value

                  ws.send(
                    JSON.stringify({
                      request: `DoAction`,
                      action: {
                        name: streamerbotActionPackage__name
                      },
                      args: {
                        wsRequest: `CommandSetUserCooldown`,
                        wsDataId: commandId,
                        wsDataDuration: wsDataDuration
                      },
                      id: `DoAction`
                    })
                  )
                })
              })
            });
          }
        }
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
        headerTag.parentNode.setAttribute(`hidden` , ``)
      });
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to TwitchSpeaker, reconnecting every 10s...")
    }

    ws.onopen = function () {
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to TwitchSpeaker")
      document.body.setAttribute(`twitchspeaker-state`, `connected`)
      document.querySelectorAll(`header .header-tags a[data-integration=twitchspeaker]`).forEach(headerTag => {
        headerTag.parentNode.setAttribute(`hidden` , ``)
        headerTag.parentNode.removeAttribute(`hidden`)
      });
      
      if (location.hash === `#TwitchSpeaker`) {
        document.querySelector(`nav.navbar`).remove()
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
        <div class="form-group styled">
        <button class="styled speak">Speak!</button>
        </div>
        `

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
          sendNotification(`twitchspeaker`, `TTS with the voice alias: "${voiceAlias}", and the text: "${message}"`)

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

function sendNotification(service, text) {
  if (service === `twitchspeaker`) service = `TwitchSpeaker`
  if (service === `streamer.bot`) service = `Streamer.bot`
  console.log(`%c[${service}]%c ${text}`, `color: #8c75fa;`, `color: white;`)
}
