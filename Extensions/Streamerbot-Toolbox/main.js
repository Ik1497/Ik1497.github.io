let version = `1.0.0-pre`
let title = `Streamer.bot Toolbox v${version}`
let documentTitle = `${title} | Streamer.bot Actions`
document.title = documentTitle

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

let headerLinksMap = [
  {
    name: `Dashboard`,
    integration: `streamer.bot`,
    icon: `mdi mdi-view-dashboard-variant`
  },
  {
    name: `Actions`,
    integration: `streamer.bot`,
    icon: `mdi mdi-lightning-bolt`
  },
  {
    name: `Present Viewers`,
    integration: `streamer.bot`,
    icon: `mdi mdi-account-multiple`
  },
  {
    name: `Websocket Events`,
    integration: `streamer.bot`,
    icon: `mdi mdi-creation`
  },
  {
    name: `Global Variables`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-earth`
  },
  {
    name: `Commands`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-comment-alert`
  },
  {
    name: `OBS Studio`,
    integration: `streamer.bot-action-package`
  },
  {
    name: `TwitchSpeaker`,
    integration: `twitchspeaker`
  }
]


if (location.hash === ``) location.href = `#Dashboard`

let headerAside = `
<div class="form-area"><label>Url</label><input type="url" value="${streamerbotToolbox__connection.host}" class="url"></div>
<div class="form-area"><label>Port</label><input type="number" value="${streamerbotToolbox__connection.port}" max="9999" class="port"></div>
<div class="form-area"><label>Endpoint</label><input type="text" value="${streamerbotToolbox__connection.endpoint}" class="endpoint"></div>
<button class="connect-websocket">Connect</button>`
let headerHtml = `<header><a href="/"><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon"><div class="name-description"><p class="name">${title}</p><p class="description">by Ik1497</p></div></div></a><aside>${headerAside}</aside></header>`
document.querySelector("body").insertAdjacentHTML(`afterbegin`,`
${headerHtml}
<nav class="navbar">
  <input type="search" placeholder="Search...">
  <ul class="navbar-list"></ul>
</nav>
<main>
  <ul class="main-list"></ul>
</main>
`)

document.querySelector(`header`).insertAdjacentHTML(`beforeend`, `
<ul class="header-links buttons-row"></ul>
`)

headerLinksMap.forEach(headerLink => {
  let hidden = ``
  let headerLinkActive = ``

  let headerLinkHash = headerLink.name
    .replaceAll(` `, `-`)
    .replaceAll(`.`, ``)
  
  let href =` href="#${headerLinkHash}"`
  if (location.hash === `#${headerLinkHash}`) {
    headerLinkActive = ` class="button-active"`
    href = ``
  }

  if (headerLink.integration != `streamer.bot`) hidden = ` hidden`

  document.querySelector(`header .header-links`).insertAdjacentHTML(`beforeend`, `
  <li${headerLinkActive}${hidden}>
    <a ${href}title="${headerLink.name}" data-integration="${headerLink.integration}" class="${headerLink.icon || `mdi mdi-chevron-right`}">
      <p class="button-row-title">${headerLink.name}</p>
    </a>
  </li$>
  `)
});

let state__404 = true

headerLinksMap.forEach(headerLink => {
  let headerLinkHash = headerLink.name
    .replaceAll(` `, `-`)
    .replaceAll(`.`, ``)
  
  if (headerLinkHash === location.hash.replace(`#`, ``)) {
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
            document.querySelectorAll(`header .header-links a[data-integration="streamer.bot-action-package"]`).forEach(headerLink => {
              headerLink.parentNode.removeAttribute(`hidden`)
            });

            ws.send(JSON.stringify({
              request: `Subscribe`,
              id: `WebsocketHandlerAction`,
              events: {
                general: [`Custom`]
              },
            }))

            let obsConnection = JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`)) || {connection: 0}
            obsConnection = obsConnection.connection

            SB__StreamerbotActionPackageRequest(`ObsIsConnected`, obsConnection)

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
      } else if (location.hash === `#Dashboard` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: "GetBroadcaster",
            id: "GetBroadcaster",
          })
        )
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
        ws.send(
          JSON.stringify({
            request: `Subscribe`,
            events: {
              raw: [`Action`, `ActionCompleted`]
            },
            id: `ActionHistory`,
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
      }

      if (data.id === `GetBroadcaster`) broadcaster = data
      if (data.id === `GetActiveViewers`) presentViewers = data

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
          <li><button data-page="obs-studio">OBS Studio</button></li>
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
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `obs-studio`) reloadObsStudio()
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
            if (document.body.getAttribute(`data-streamerbot-action-package`) === `renamed`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-alert" data-integration="streamer.bot-action-package"> Streamer.bot Action Package, You have broken something <button id="more-info">Please re-install it again</button></li>`)
            if (document.body.getAttribute(`data-streamerbot-action-package`) === `installed`) document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-check" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (v${streamerbotActionPackage__version}) • ${wsServerUrl}</li>`)

            if (document.body.getAttribute(`data-streamerbot-action-package`) != `installed`) {
              document.querySelector(`.settings-modal .main ul.integrations-list li[data-integration="streamer.bot-action-package"] button#more-info`).addEventListener(`click`, function () {
                document.body.insertAdjacentHTML(`afterbegin`, `
                <div class="settings-modal-alt small" data-settings-modal-alt="twitchspeaker-connection">
                  <button class="close-button mdi mdi-close" onclick="this.parentNode.remove()"></button>
                  <div class="main">
                    <h2>Streamer.bot Action Package</h3>
                    <br>
                    <p>The Streamer.bot Action Package is used for getting/setting global variables, sending chat messages to Twitch/YouTube, and command features.</p>
                    <p>When this action is imported it will show more tabs and it will even show more features on certain tabs.</p>
                    <br>
                    <p>To use this you simply need to import the code in Streamer.bot, and that's it. Note: when changing the action name or the group name, this will break. When your Streamer.bot Action Package is outdated it won't work anymore and you need to import the new version.</p>
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

              createModal(`
                <table><tbody>
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
              </tbody></table>
              `, `TwitchSpeaker Settings`, undefined, `small`, {})
                    
              document.querySelector(`.settings-modal-alt .main table tbody tr td button.connect-button`).addEventListener(`click`, function () {
                let table = document.querySelector(`.settings-modal-alt .main table`)
                localStorage.setItem(`streamerbotToolbox__twitchspeaker`, JSON.stringify({
                    host: table.querySelector(`tbody tr td input#websocket-host`).value,
                    port: table.querySelector(`tbody tr td input#websocket-port`).value,
                    endpoint: table.querySelector(`tbody tr td input#websocket-endpoint`).value
                  })
                )

                location.reload()
              })
            })

            // HTTPS Connection

            // let integrationsList__httpsConnection = `<li class="mdi mdi-plus" data-integration="https-connection"> HTTPS Connection <button>Connect!</button></li>`

            // if (document.body.getAttribute(`https-connection-state`) === null) {
            // } else if (document.body.getAttribute(`https-connection-state`) === `connected`) {
            //   let integrationsList__httpsConnection_wsUrl = localStorage.getItem(`streamerbotToolbox__httpsConnection`)
            //   integrationsList__httpsConnection_wsUrl = JSON.parse(integrationsList__httpsConnection_wsUrl)
            //   integrationsList__httpsConnection_wsUrl = `ws://${integrationsList__httpsConnection_wsUrl.host}:${integrationsList__httpsConnection_wsUrl.port}`
            //   integrationsList__httpsConnection = `<li class="mdi mdi-check" data-integration="https-connection"> HTTPS Connection (Connected) • ${integrationsList__httpsConnection_wsUrl} <button class="mdi mdi-cog"></button></p>`
            // } else if (document.body.getAttribute(`httpsConnection-state`) === `disconnected`) {
            //   integrationsList__httpsConnection = `<li class="mdi mdi-reload" data-integration="https-connection"> HTTPS Connection <button>Reconnect!</button></p>`
            // }

            // document.querySelector(`.settings-modal .main ul.integrations-list`).insertAdjacentHTML(`beforeend`, integrationsList__httpsConnection)
            
            // document.querySelector(`.settings-modal .main ul.integrations-list li[data-integration="https-connection"] button`).addEventListener(`click`, function () {
            //   let httpsConnectionDefaultValues = localStorage.getItem(`streamerbotToolbox__httpsConnection`)
            //   if (httpsConnectionDefaultValues === null) {
            //     httpsConnectionDefaultValues = {}
            //     httpsConnectionDefaultValues.host     = `localhost`
            //     httpsConnectionDefaultValues.port     = `7474`
            //   } else {
            //     httpsConnectionDefaultValues = JSON.parse(httpsConnectionDefaultValues)
            //   }

            //   createModal(`
            //     <blockquote class="success">
            //     Coming soon!
            //     </blockquote>
            //     <table><tbody>
            //     <tr>
            //       <td style="text-align: right; padding-right: .25rem;"><label for="websocket-url">Host</label></td>
            //       <td style="text-align: left;"><input type="url" name="websocket-host" id="websocket-host" value="${httpsConnectionDefaultValues.host}" placeholder="${httpsConnectionDefaultValues.host}"></td>
            //     </tr>
            //     <tr>
            //       <td style="text-align: right; padding-right: .25rem;"><label for="websocket-url">Port</label></td>
            //       <td style="text-align: left;"><input type="url" name="websocket-port" id="websocket-port" value="${httpsConnectionDefaultValues.port}" placeholder="${httpsConnectionDefaultValues.port}"></td>
            //     </tr>
            //     <tr>
            //       <td></td>
            //       <td style="text-align: right;"><button class="connect-button">Connect!</button></td>
            //     </tr>
            //   </tbody></table>
            //   `, `HTTPS Connection Settings`, undefined, `small`, {})
                    
            //   document.querySelector(`.settings-modal-alt .main table tbody tr td button.connect-button`).addEventListener(`click`, function () {
            //     let table = document.querySelector(`.settings-modal-alt .main table`)
            //     localStorage.setItem(`streamerbotToolbox__httpsConnection`, JSON.stringify({
            //         host: table.querySelector(`tbody tr td input#websocket-host`).value,
            //         port: table.querySelector(`tbody tr td input#websocket-port`).value
            //       })
            //     )
            //     location.reload()
            //   })
            // })
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
            
            document.querySelector(`.settings-modal .main`).innerHTML = `
            <p>Choose Between YouTube or Twitch</p>
              <small>When the service is disconnected no broadcaster variables will be emitted</small>
            <div class="form-group styled">
              <select>${options}</select>
            </div>`

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

            document.querySelector(`.settings-modal .main`).innerHTML = `
            <div class="form-group styled">
              <label>Random Users</label>
              <input type="number" value="${prevRandomUsers}">
            </div>
            `            
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

          function reloadObsStudio() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Settings • OBS Studio`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Settings for OBS Studio`

            document.querySelector(`.settings-modal .main`).innerHTML = `
            <div class="form-group styled">
              <p>OBS Studio is fully managed with Streamer.bot in combination with the Streamer.bot Action Package</p>
              <br>
              <label>Connection</label>
              <input type="number" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`) ?? `{"navSwitchScenes": true}`).connection || 0}">
            </div>
            `
            
            document.querySelector(`.settings-modal .main input`).addEventListener(`keydown`, function () {
              setTimeout(() => {
                let streamerbotToolbox__obsStudio = localStorage.getItem(`streamerbotToolbox__obsStudio`) || `{}`
                streamerbotToolbox__obsStudio = JSON.parse(streamerbotToolbox__obsStudio) || {}
                streamerbotToolbox__obsStudio.connection = document.querySelector(`.settings-modal .main input`).value
                if (streamerbotToolbox__obsStudio.connection <= 0) streamerbotToolbox__obsStudio.connection = 0
                localStorage.setItem(`streamerbotToolbox__obsStudio`, JSON.stringify(streamerbotToolbox__obsStudio))
              }, 50);
            })
          }
        })
      }

      if (location.hash === `#Dashboard` && data.id === `GetBroadcaster`) {

        document.body.querySelector(`main`).innerHTML = `
        <div class="card" style="height: calc(100% - 8rem); max-height: calc(100vh - 8rem);" data-view="all">
          <div class="card-header">
            <p class="card-title">Chat</p>
            <p class="card-title-end"><div class="form-group styled no-margin"><button class="outlined" id="settings">Settings</button></div></p>
          </div>
          <hr>
          <ul class="chat-messages" style="overflow: auto;height: calc(100vh - 20rem);max-height: calc(100vh - 20rem);width: 100%;display: flex;flex-direction: column;gap: .25rem;"></ul>
          <div class="send-message">
          <div class="form-group styled no-margin">
            <select class="no-border-radius no-margin fit-content service">
              <option value="Twitch">Twitch</option>
              <option value="TwitchBot">Twitch (BOT)</option>
              <option value="YouTube">YouTube</option>
              <option value="Both">Both</option>
            </select>
            <select class="no-border-radius no-margin fit-content modifier">
              <option value="none">No modifier</option>
              <option value="action">/me</option>
              <option value="shoutout">/shoutout</option>
              <option value="mod">/mod</option>
              <option value="unmod">/unmod</option>
              <option value="vip">/vip</option>
              <option value="unvip">/unvip</option>
              <option value="clear">/clear</option>
              <option value="emoteonly">/emoteonly</option>
              <option value="emoteonlyoff">/emoteonlyoff</option>
              <option value="followers">/followers</option>
              <option value="followersoff">/followersoff</option>
              <option value="subscribers">/subscribers</option>
              <option value="subscribersoff">/subscribersoff</option>
              <option value="slow">/slow</option>
              <option value="slowoff">/slowoff</option>
            </select>
            <input type="text" placeholder="Send message to chat" class="no-margin no-border-radius">
            <button class="submit no-border-radius no-margin">Send</button>
          </div>
        </div>
        </div>
        `

        DashboardAsyncPage()
        async function DashboardAsyncPage() {

          document.body.removeChild(document.querySelector(`nav.navbar`))
          document.querySelector(`main`).classList.add(`full`)
          document.querySelector(`main`).classList.add(`grid`)
          document.querySelector(`main`).classList.add(`auto-col`)
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

          document.body.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `
          <div class="main">
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
            <p>Features:</p>
            <p>• Action Management with Custom Arguments, Event Emulatation and Action History</p>
            <p>• Present Viewers List</p>
            <p>• View chat and send messages to chat</p>
            <p>• View all websocket events</p>
            <p>• Add/Update/Remove Global Arguments</p>
            <p>• Change command settings</p>
            <p>• TwitchSpeaker Settings Management</p>
            <br>
            <p><b>Open the settings in bottom right to enable these integrations or for more info</b></p>
          </div>
          `)
        }

        document.querySelector(`main .card .card-header button#settings`).addEventListener(`click`, function () {
          createModal(`
          <blockquote class="success">Coming Soon!</blockquote>
          `,`Chat Settings`, undefined, `small`, {})
        })
        
        document.querySelector(`.card .send-message select.modifier`).onchange = (e) => {
          document.querySelector(`.card .send-message input`).value = ``

          selectPlaceholderMap = {
            none: `Send message to chat`,
            action: `Send message with /me to chat`,
            shoutout: `Fill in the user that you want to shoutout (Required)`,
            mod: `Fill in the user that you want to mod (Requirer)`,
            unmod: `Fill in the user that you want to unmod (required)`,
            vip: `Fill in the user that you want to vip (Requirer)`,
            unvip: `Fill in the user that you want to unvip (required)`,
            clear: null,
            emoteonly: null,
            emoteonlyoff: null,
            followers: `Fill in the duration of the followers only (optional)`,
            followersoff: null,
            subscribers: null,
            subscribersoff: null,
            slow: `Fill in the duration of the slow mode (optional)`,
            slowoff: null
          }

          selectPlaceholderMap = Object.entries(selectPlaceholderMap)

          selectPlaceholderMap.forEach(selectPlaholder => {
            if (selectPlaholder[0] === e.srcElement.value) {
              if (selectPlaholder[1] != null) {
                document.querySelector(`.card .send-message input`).placeholder = selectPlaholder[1]
                document.querySelector(`.card .send-message input`).disabled = false
              } else {
                document.querySelector(`.card .send-message input`).placeholder = `This field is disabled because with this modifier there are no options`
                document.querySelector(`.card .send-message input`).disabled = true
              }
            }
          });
        }

        document.querySelector(`.card .send-message button.submit`).addEventListener(`click`, SendChatMessage)
        document.querySelector(`.card .send-message input`).addEventListener(`keypress`, function (keypress) {
          if (keypress.key === `Enter`) SendChatMessage()
        })

        function SendChatMessage() {
          let package__chatMessage = document.querySelector(`.card .send-message input`).value
          let package__chatService = document.querySelector(`.card .send-message select.service`).value
          let package__chatModifier = document.querySelector(`.card .send-message select.modifier`).value
          document.querySelector(`.card .send-message input`).value = ``
          document.querySelector(`.card .send-message input`).focus()
          document.querySelector(`.card .send-message input`).select()
  
          console.log(`[${package__chatService}] ${package__chatMessage}`)
  
          if (package__chatModifier === `none`) {
            if (package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterMessage`, package__chatMessage)
              SB__StreamerbotActionPackageRequest(`YouTubeSendMessage`, package__chatMessage)
            } else if (package__chatService === `Twitch`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterMessage`, package__chatMessage)
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotMessage`, package__chatMessage)
            } else if (package__chatService === `YouTube`) {
              SB__StreamerbotActionPackageRequest(`YouTubeSendMessage`, package__chatMessage)
            }
          } else if (package__chatModifier === `action`) {
            if (package__chatService === `Twitch`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAction`, package__chatMessage)
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAction`, package__chatMessage)
            }
          } else if (package__chatModifier === `clear`) {
            SB__StreamerbotActionPackageRequest(`TwitchClearChatMessages`)

            document.querySelector(`main .card ul.chat-messages`).innerHTML = ``
            SendChatNotification(`Chat cleared`)
          }
        }
        
        function SendChatNotification(message) {
          document.querySelector(`.card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="twitch">
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <p style="color: var(--color-link);">${message}</p>
          </div>
          </li>`)
        }
      }
      
      if (location.hash === `#Dashboard` && data?.event?.source === `Twitch` && data?.event?.type === `ChatMessage`) {
        TwitchChatMessageEvent()
        async function TwitchChatMessageEvent() {  
          let hidden = ` hidden`
          let view = document.querySelector(`.card`).getAttribute(`data-view`)
          
          if (view === `twitch` || view === `all`) hidden = ``

          let profileImageUrl = await fetch(`https://decapi.me/twitch/avatar/${data.data.message.username}`)
          profileImageUrl = await profileImageUrl.text()

          let italics = ``
          if (data.data.message.isMe === true) italics = `font-style: italic`
  
          document.querySelector(`.card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="${data.event.source}" data-message-id="${data.data.message.msgId}">
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <div>
                <button class="delete-message mdi mdi-trash-can"></button>
              </div>
              <p style="min-width: 4.5rem; text-align: center; color: var(--text-500);">${formatStreamerbotTimestamp(data.timeStamp)}</p>
              <div class="profile-image mdi mdi-twitch" style="display: flex; align-items: center;">
                <img src="${profileImageUrl}" alt="" style="width: 1rem; height: 1rem; border-radius: 100vmax;">
              </div>
              <p style="color: ${data.data.message.color};">${data.data.message.displayName}</p>
              <p style="${italics}">${data.data.message.message}</p>
            </div>
          </li>
          `)
        }
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
              <div class="card-header">
                <p class="card-title">Emulate Events</p>
              </div>
              <hr>
              ${eventTestDropdown}
            </div>
            <div class="card arguments">
              <div class="card-header">
                <p class="card-title">Arguments</p>
              </div>
              <hr>
              <table class="styled full"></table>
            </div>
            <div class="card action-history">
              <div class="card-header">
                <p class="card-title">Action History</p>
              </div>
              <hr>
              <ul class="styled"></ul>
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
                
                SB__RunAction(buttonHtml.parentNode.parentNode.querySelector(`p.action-name`).innerText, arguments)
              })
            })
          })
        })
      }

      if (location.hash === `#Actions` && data?.event?.source === `Raw` && data?.event?.type === `Action`) {
        if (data.data.name != `Streamer.bot Toolbox Partial - Websocket Handler`) {
          let actionHistoryQueued__List = document.querySelector(`main aside .card.action-history ul`)
  
          let actionHistoryQueued__ListItem = document.createElement(`li`)
          actionHistoryQueued__ListItem.setAttribute(`data-action-running-id`, data.data.id)
          actionHistoryQueued__ListItem.setAttribute(`data-action-id`, data.data.actionId)
          actionHistoryQueued__ListItem.setAttribute(`data-action-queued-data`, JSON.stringify(data))
          actionHistoryQueued__ListItem.setAttribute(`data-action-state`, `queued`)
  
          let actionHistoryQueued__Title = document.createElement(`p`)
          actionHistoryQueued__Title.classList.add(`title`)
          actionHistoryQueued__Title.innerHTML = data.data.name
  
          let actionHistoryQueued__Button = document.createElement(`button`)
          
          actionHistoryQueued__Button.append(actionHistoryQueued__Title)
          actionHistoryQueued__ListItem.append(actionHistoryQueued__Button)
          actionHistoryQueued__List.prepend(actionHistoryQueued__ListItem)
  
          
          actionHistoryQueued__Button.addEventListener(`click`, () => {
            let actionHistoryQueued__table = ``
            let actionHistoryQueued__arguments = actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)
            actionHistoryQueued__arguments = JSON.parse(actionHistoryQueued__arguments).data.arguments ?? {}
  
            Object.entries(actionHistoryQueued__arguments).forEach(argument => {
              actionHistoryQueued__table += `
              <tr>
                <td style="text-align: right;">${argument[0]}</td>
                <td style="text-align: left;">${argument[1]}</td>
              </tr>
              `
            });
    
            actionHistoryQueued__table = `
            <table class="styled" hidden id="queued">
              <thead>
                <th style="text-align: right;">Argument</th>
                <th style="text-align: left;">Value</th>
              </thead>
              <tbody>
                ${actionHistoryQueued__table}
              </tbody>
            </table>
            `
  
            if (actionHistoryQueued__ListItem.getAttribute(`data-action-state`) === `completed`) {
              actionHistoryQueued__arguments = actionHistoryQueued__ListItem.getAttribute(`data-action-completed-data`)
              actionHistoryQueued__arguments = JSON.parse(actionHistoryQueued__arguments).data.arguments ?? {}
      
              actionHistoryQueued__table += `
              <table class="styled" hidden id="completed">
                <thead>
                  <th style="text-align: right;">Argument</th>
                  <th style="text-align: left;">Value</th>
                </thead>
                <tbody>
              `
    
              Object.entries(actionHistoryQueued__arguments).forEach(argument => {
                actionHistoryQueued__table += `
                <tr>
                  <td style="text-align: right;">${argument[0]}</td>
                  <td style="text-align: left;">${argument[1]}</td>
                </tr>
                `
              });
  
              actionHistoryQueued__table += `
                </tbody>
              </table>
              `
            }
  
            createModal(`
            <h3>Arguments</h3>
            <br>
            ${actionHistoryQueued__table}
            <div class="form-group styled re-run">
              <button id="re-run">Re-run</button>
            </div>
            `, `${data.data.name}<small>• ${formatStreamerbotTimestamp(data.data.arguments.actionQueuedAt)}</small>`, data.data.actionId, `medium`, {})
  
            if (actionHistoryQueued__ListItem.getAttribute(`data-action-state`) === `completed`) {
              let actionHistoryCompletedDialog__List = document.createElement(`ul`)
              actionHistoryCompletedDialog__List.className = `buttons-row`
  
              let actionHistoryCompletedDialog__QueuedListItem = document.createElement(`li`)
              
              let actionHistoryCompletedDialog__CompletedListItem = document.createElement(`li`)
              
              let actionHistoryCompletedDialog__QueuedButton = document.createElement(`button`)
              actionHistoryCompletedDialog__QueuedButton.innerHTML = `Queued`
              actionHistoryCompletedDialog__QueuedButton.className = `mdi mdi-clock-fast`
              
              let actionHistoryCompletedDialog__CompletedButton = document.createElement(`button`)
              actionHistoryCompletedDialog__CompletedButton.innerHTML = `Completed`
              actionHistoryCompletedDialog__CompletedButton.className = `mdi mdi-check-bold`
  
              actionHistoryCompletedDialog__QueuedListItem.append(actionHistoryCompletedDialog__QueuedButton)
              actionHistoryCompletedDialog__CompletedListItem.append(actionHistoryCompletedDialog__CompletedButton)
              actionHistoryCompletedDialog__CompletedListItem.className = `button-active`
  
              actionHistoryCompletedDialog__List.append(actionHistoryCompletedDialog__QueuedListItem)
              actionHistoryCompletedDialog__List.append(actionHistoryCompletedDialog__CompletedListItem)
              actionHistoryCompletedDialog__List.style.paddingBottom = `1rem`
  
              actionHistoryCompletedDialog__QueuedButton.addEventListener(`click`, () => {
                actionHistoryCompletedDialog__QueuedListItem.classList.add(`button-active`)
  
                actionHistoryCompletedDialog__CompletedListItem.classList.add(`button-active`)
                actionHistoryCompletedDialog__CompletedListItem.classList.remove(`button-active`)
                reloadButtonStates()
              })
  
              actionHistoryCompletedDialog__CompletedButton.addEventListener(`click`, () => {
                actionHistoryCompletedDialog__CompletedListItem.classList.add(`button-active`)
  
                actionHistoryCompletedDialog__QueuedListItem.classList.add(`button-active`)
                actionHistoryCompletedDialog__QueuedListItem.classList.remove(`button-active`)
                reloadButtonStates()
              })
  
              reloadButtonStates()
  
              function reloadButtonStates() {
                if (actionHistoryCompletedDialog__CompletedListItem.classList.contains(`button-active`)) {
                  document.querySelector(`.settings-modal-alt .main table#completed`).setAttribute(`hidden`, ``)
                  document.querySelector(`.settings-modal-alt .main table#completed`).removeAttribute(`hidden`)
                  
                  document.querySelector(`.settings-modal-alt .main table#queued`).setAttribute(`hidden`, ``)
  
                } else if (actionHistoryCompletedDialog__QueuedListItem.classList.contains(`button-active`)) {
                  document.querySelector(`.settings-modal-alt .main table#queued`).setAttribute(`hidden`, ``)
                  document.querySelector(`.settings-modal-alt .main table#queued`).removeAttribute(`hidden`)
                  
                  document.querySelector(`.settings-modal-alt .main table#completed`).setAttribute(`hidden`, ``)
  
                }
              }
  
              document.querySelector(`.settings-modal-alt .main`).prepend(actionHistoryCompletedDialog__List)
            }
  
            document.querySelector(`.settings-modal-alt .main .form-group.re-run button#re-run`).addEventListener(`click`, () => {
              let arguments = []
              document.querySelectorAll(`.settings-modal-alt .main table:not([hidden]) tbody tr`).forEach(tableRow => {
                arguments.push([
                  tableRow.querySelector(`td:first-child`).innerHTML,
                  tableRow.querySelector(`td:last-child`).innerHTML
                ])
              });
              arguments = Object.fromEntries(arguments)
              ws.send(
                JSON.stringify({
                  request: "DoAction",
                  action: {
                    id: data.data.actionId
                  },
                  args: arguments,
                  id: "DoAction",
                })
              )
            })
          })
        }
      }

      if (location.hash === `#Actions` && data?.event?.source === `Raw` && data?.event?.type === `ActionCompleted`) {
        if (data.data.name != `Streamer.bot Toolbox Partial - Websocket Handler`) {
          let actionHistoryCompleted__ListItem = document.querySelector(`main aside .card-grid .card.action-history ul li[data-action-running-id="${data.data.id}"]`)
          actionHistoryCompleted__ListItem.setAttribute(`data-action-completed-data`, JSON.stringify(data))
          actionHistoryCompleted__ListItem.setAttribute(`data-action-state`, `completed`)
        }
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
                document.querySelector(`main ul.main-list`).innerHTML = ``
                document.querySelector(`main ul.main-list`).classList.add(`col-2`)
                document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`,`
                <li>Display Name</li><li>${viewer.display}</li>
                <li>Login Name</li><li>${viewer.login}</li>
                <li>User Id</li><li>${viewer.id}</li>
                <li>Role</li><li>${viewer.role}</li>
                <li>Subscribed</li><li>${viewer.subscribed}</li>
                <li>Previous Active</li><li>${formatStreamerbotTimestamp(viewer.previousActive)}</li>
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

      if (location.hash === `#Global-Variables` && data?.id === `WebsocketHandlerAction`) {
        document.querySelector(`nav.navbar`).remove()
        document.querySelector(`main`).classList.add(`full`)

        document.querySelector(`main`).innerHTML = `
        <div class="card-grid">
          <div class="card">
            <div class="card-header">                
              <p class="card-title">Get Global Variable</p>
            </div>
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
            <div class="card-header">
              <p class="card-title">Set Global Variable</p>
            </div>
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
            <div class="card-header">
              <p class="card-title">Unset Global Variable</p>
            </div>
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
          let wsDataGlobalVariableName = document.getElementById(`get-global-variable--variable-name`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          console.log(streamerbotToolbox__globalVariables)
          streamerbotToolbox__globalVariables.getvariable = wsDataGlobalVariableName
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))
          
          SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
        })

        document.getElementById(`set-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`set-global-variable--variable-name`).value
          let wsDataGlobalVariableValue = document.getElementById(`set-global-variable--value`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          streamerbotToolbox__globalVariables.setvariable = wsDataGlobalVariableName
          streamerbotToolbox__globalVariables.setvalue = wsDataGlobalVariableValue
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))

          SB__StreamerbotActionPackageRequest(`SetGlobalVariable`, {
            wsDataName: wsDataGlobalVariableName,
            wsDataValue: wsDataGlobalVariableValue
          })
        })

        document.getElementById(`unset-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`unset-global-variable--variable-name`).value

          let streamerbotToolbox__globalVariables = JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{}`)
          streamerbotToolbox__globalVariables.unsetvariable = wsDataGlobalVariableName
          localStorage.setItem(`streamerbotToolbox__globalVariables`, JSON.stringify(streamerbotToolbox__globalVariables))

          SB__StreamerbotActionPackageRequest(`UnsetGlobalVariable`, wsDataGlobalVariableName)
        })
      }

      if (location.hash === `#Global-Variables` && data?.event?.source === `None` && data?.event?.type === `Custom`) {
        if (data.data.wsRequest === `GetGlobalVariable`) {
          if (data.data.wsData === ``) data.data.wsData = `Global Variable Doesn't Exist or it doesn't have a value`
          document.querySelector(`#get-global-variable--output .output`).innerHTML = data.data.wsData
        }
      }

      if (location.hash === `#Commands` && data?.id === `WebsocketHandlerAction`) {
        SB__StreamerbotActionPackageRequest(`GetCommandsFromFile`)
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
                    <div class="card-header">
                      <p class="card-title">Enabled State</p>
                    </div>
                    <hr>
                    <div class="form-group styled flex">
                      <button id="enable">Enable</button>
                      <button id="disable">Disable</button>
                    </div>
                  </div>

                  <!--  -->
                  <!--  -->

                  <div class="card global-cooldown">
                    <div class="card-header">
                      <p class="card-title">Global Cooldown (in seconds)</p>
                    </div>
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
                    <div class="card-header">
                      <p class="card-title">User Cooldown (in seconds)</p>
                    </div>
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

                  SB__StreamerbotActionPackageRequest(`EnableCommandById`, commandId)
                })

                document.querySelector(`main .card-grid .card.enabled-state .form-group #disable`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`DisableCommandById`, commandId)
                })


                /// /////////////// ///
                /// Global Cooldown ///
                /// /////////////// ///

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #reset`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandResetGlobalCooldown`, commandId)
                })

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #remove`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandRemoveGlobalCooldown`, commandId)
                })

                document.querySelector(`main .card-grid .card.global-cooldown .form-group #add`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandAddGlobalCooldown`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })
                
                document.querySelector(`main .card-grid .card.global-cooldown .form-group #update`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandSetGlobalCooldown`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
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

                  SB__StreamerbotActionPackageRequest(`CommandResetUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId
                  })
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #remove`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataUserId = document.querySelector(`main .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  SB__StreamerbotActionPackageRequest(`CommandRemoveUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId
                  })
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #reset-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandResetAllUserCooldowns`, commandId)
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #remove-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandRemoveAllUserCooldowns`, commandId)
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #add`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value
                  let wsDataUserId = document.querySelector(`main .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  SB__StreamerbotActionPackageRequest(`CommandAddUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId,
                    wsDataDuration: wsDataDuration
                  })
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #add-to-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandAddAllUserCooldowns`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #update`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .card-grid .card.user-cooldown .form-group #user-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandSetUserCooldown`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })
              })
            });
          }
        }
      }

      if (location.hash === `#OBS-Studio` && data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsRequest === `ObsIsConnected`) {
        if (data.data.wsData === true) {
          let obsConnection = JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`)) || {connection: 0}
          obsConnection = obsConnection.connection
          document.body.setAttribute(`obs-connection-state`, `connected`)

          SB__StreamerbotActionPackageOBSRequest(`GetSceneList`, {}, obsConnection)

        } else {
          document.body.setAttribute(`obs-connection-state`, `disconnected`)
        }
      }
      
      if (location.hash === `#OBS-Studio` && data?.event?.source === `None` && data?.event?.type === `Custom`) {
        obsData = data.data.wsData
        obsData = JSON.parse(obsData)
        if (data.data.requestType != undefined) console.log(`[OBS Websocket] Request ${data.data.requestType}:`, obsData)

        let obsConnection = JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`)) || {connection: 0}
        obsConnection = obsConnection.connection

        console.log(`Connected to OBS`)

        switch (data?.data?.requestType) {
          case `GetSceneList`:
            let scenes = []
            obsData.scenes.forEach(scene => {
              scenes.unshift(scene.sceneName)
            });

            scenes.forEach(scene => {
              document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `
              <li class="navbar-list-item">
                <button>
                  <p class="title">${scene}</p>
                </button>
              </li>
              `)  
            });

            document.querySelector(`main`).classList.add(`col-2`)
            document.querySelector(`main`).innerHTML = `
            <div class="main">
            
            </div>
            <aside>
              <div class="card-grid">
                <div class="card settings">
                  <div class="card-header">
                    <p class="card-title">Settings</p>
                    </div>
                    <hr>
                    <div class="form-group" title="This switches scenes when clicking on items in the navbar.">
                      <input type="checkbox" name="nav-switch-scenes" id="nav-switch-scenes"${JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`) ?? `{"navSwitchScenes": true}`).navSwitchScenes ? `checked` : ``}>
                      <label for="nav-switch-scenes">Navbar Switch Scenes</label>
                    </div>
                    <div class="form-group styled">
                      <button id="scene-preview">Open preview image from current Scene</button>
                    </div>
                </div>
              </div>
            </aside>
            `

            document.querySelector(`.card-grid .card.settings .form-group #nav-switch-scenes`).onchange = () => {
              let streamerbotToolbox__obsStudio = localStorage.getItem(`streamerbotToolbox__obsStudio`) || `{}`
              streamerbotToolbox__obsStudio = JSON.parse(streamerbotToolbox__obsStudio) || {}
              streamerbotToolbox__obsStudio.navSwitchScenes = document.querySelector(`.card-grid .card.settings .form-group #nav-switch-scenes`).checked
              localStorage.setItem(`streamerbotToolbox__obsStudio`, JSON.stringify(streamerbotToolbox__obsStudio))
            }

            document.querySelector(`.card-grid .card.settings .form-group #scene-preview`).onclick = () => {
              SB__StreamerbotActionPackageOBSRequest(`GetCurrentProgramScene`, {}, obsConnection)
            }


            document.querySelectorAll(`nav.navbar ul.navbar-list li`).forEach(listItem => {
              listItem.querySelector(`button`).addEventListener(`click`, () => {
                listItem.classList.add(`nav-active`)
                
                document.querySelectorAll(`.nav-active`).forEach(navActiveListItem => {
                  navActiveListItem.classList.remove(`nav-active`)
                });

                listItem.classList.add(`nav-active`)

                document.querySelector(`main .main`).innerHTML = `
                <div class="card-grid">
                  <div class="card sources">
                    <div class="card-header">
                      <p class="card-title">Sources</p>
                    </div>
                    <hr>
                    <ul class="styled" data-scene="${listItem.querySelector(`p.title`).innerText}"></ul>
                  </div>
                </div>
                `

                SB__StreamerbotActionPackageOBSRequest(`GetSceneItemList`, {sceneName: listItem.querySelector(`p.title`).innerText}, obsConnection)

                if (JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`) ?? `{"navSwitchScenes": true}`).navSwitchScenes) {      
                  SB__StreamerbotActionPackageOBSRequest(`SetCurrentProgramScene`, {sceneName: listItem.querySelector(`p.title`).innerText}, obsConnection)
                }
              })
            });

            break
          case `GetSceneItemList`:
            let sceneItems = []
            obsData.sceneItems.forEach(sceneItem => {
              sceneItems.unshift(sceneItem)
            });
            sceneItems.forEach(sceneItem => {
              document.querySelector(`main .main .card-grid .card.sources ul`).insertAdjacentHTML(`beforeend`, `
              <li data-source-information="${JSON.stringify(sceneItem).replaceAll(`"`, `'`)}">
                <button>${sceneItem.sourceName}</button>
                <div class="dropdown-section">
                  <button class="prepend mdi mdi-cog"></button>
                  <ul class="dropdown-list">
                    <li id="inspect-source-properties"><button><i class="mdi mdi-flip-to-back"></i> <span style="text-align: end;">Inspect Source Properties</span></button></li>
                    <li id="transform-settings"><button><i class="mdi mdi-flip-to-back"></i> <span style="text-align: end;">Transform Settings</span></button></li>
                  </ul>
                </div>
              </li>
              `)
            });

            document.querySelectorAll(`main .main .card-grid .card.sources > ul > li`).forEach(listItem => {
              let sourceData = listItem.getAttribute(`data-source-information`)
              sourceData = sourceData.replaceAll(`'`, `"`)
              sourceData = JSON.parse(sourceData)
              listItem.querySelector(`button`).addEventListener(`click`, inspectSourcePropertiesModal)
              listItem.querySelector(`.dropdown-section .dropdown-list li#inspect-source-properties button`).addEventListener(`click`, inspectSourcePropertiesModal)
              
              function inspectSourcePropertiesModal() {
                createModal(`
                <table class="styled">
                  <tr>
                    <td>Input Kind</td>
                    <td>${sourceData.isGroup === true ? `group` : sourceData.inputKind === null ? `unknown` : sourceData.inputKind}</td>
                  </tr>
                  <tr>
                    <td>Source Type</td>
                    <td>${sourceData.sourceType}</td>
                  </tr>
                  <tr>
                    <td>Blend Mode</td>
                    <td>${sourceData.sceneItemBlendMode}</td>
                  </tr>
                  <tr>
                    <td>Scene Item Id</td>
                    <td>${sourceData.sceneItemId}</td>
                  </tr>
                  <tr>
                    <td>Additional Information</td>
                    <td>
                      <ul class="buttons-row list-items">
                        <li
                          class="no-pointer mdi mdi-${sourceData.sceneItemLocked ? `lock-remove` : `lock-open-check`}"
                          title="${sourceData.sceneItemLocked ? `The source is locked` : `The source is unlocked`}"
                          >${sourceData.sceneItemLocked ? `Locked` : `Unlocked`}</li>
                          <li
                          class="no-pointer mdi mdi-${sourceData.sceneItemEnabled ? `eye` : `eye-off`}"
                          title="${sourceData.sceneItemEnabled ? `The source is visible` : `The source is hidden`}"
                          >${sourceData.sceneItemEnabled ? `Visible` : `Hidden`}</li>
                      </ul>
                    </td>
                  </tr>
                </table>
                `, `${sourceData.sourceName}`, `Inspect Source Properties`, `small`)
              }

              listItem.querySelector(`.dropdown-section .dropdown-list li#transform-settings button`).addEventListener(`click`, () => {
                createModal(`
                <table class="styled">
                  <div class="form-group styled">
                    <button id="update">Update Transform Settings</button>
                  </div>
                  <tr>
                    <td>Alignment</td>
                    <td>
                    <select class="no-style" id="alignment">
                      <option value="5"${5 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Top Left</option>
                      <option value="4"${4 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Top Center</option>
                      <option value="6"${6 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Top Right</option>
                      <option value="1"${1 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Center Left</option>
                      <option value="0"${0 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Center</option>
                      <option value="2"${2 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Center Right</option>
                      <option value="9"${9 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Bottom Left</option>
                      <option value="8"${8 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Bottom Center</option>
                      <option value="10"${10 === sourceData.sceneItemTransform.alignment ? ` selected` : ``}>Bottom Right</option>
                    </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Bounds Alignment</td>
                    <td contenteditable="true" id="bounds-alignment">${sourceData.sceneItemTransform.boundsAlignment}</td>
                  </tr>
                  <tr>
                    <td>Bounds Width</td>
                    <td contenteditable="true" id="bounds-width">${sourceData.sceneItemTransform.boundsWidth}</td>
                  </tr>
                  <tr>
                    <td>Bounds Height</td>
                    <td contenteditable="true" id="bounds-height">${sourceData.sceneItemTransform.boundsHeight}</td>
                  </tr>
                  <tr>
                    <td>Bounds Type</td>
                    <td>
                      <select class="no-style" id="bounds-type">
                        <option${`OBS_BOUNDS_NONE` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_NONE">No bounds</option$>
                        <option${`OBS_BOUNDS_STRETCH` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_STRETCH">Stretch to Bounds</option$>
                        <option${`OBS_BOUNDS_SCALE_INNER` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_SCALE_INNER">Scale to inner bounds</option$>
                        <option${`OBS_BOUNDS_SCALE_OUTER` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_SCALE_OUTER">Scale to outer bounds</option$>
                        <option${`OBS_BOUNDS_SCALE_TO_WIDTH` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_SCALE_TO_WIDTH">Scale to width of bounds</option$>
                        <option${`OBS_BOUNDS_SCALE_TO_HEIGHT` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_SCALE_TO_HEIGHT">Scale to height of bounds</option$>
                        <option${`OBS_BOUNDS_MAX_ONLY` === sourceData.sceneItemTransform.boundsType ? ` selected` : ``} value="OBS_BOUNDS_MAX_ONLY">Maximum size only</option$>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Crop Top</td>
                    <td contenteditable="true" id="crop-top">${sourceData.sceneItemTransform.cropRight}</td>
                  </tr>
                  <tr>
                    <td>Crop Right</td>
                    <td contenteditable="true" id="crop-right">${sourceData.sceneItemTransform.cropLeft}</td>
                  </tr>
                  <tr>
                    <td>Crop Bottom</td>
                    <td contenteditable="true" id="crop-bottom">${sourceData.sceneItemTransform.cropBottom}</td>
                  </tr>
                  <tr>
                    <td>Crop Left</td>
                    <td contenteditable="true" id="crop-left">${sourceData.sceneItemTransform.cropLeft}</td>
                  </tr>
                  <tr>
                    <td>Width</td>
                    <td contenteditable="true" id="width">${sourceData.sceneItemTransform.width}</td>
                  </tr>
                  <tr>
                    <td>Height</td>
                    <td contenteditable="true" id="height">${sourceData.sceneItemTransform.height}</td>
                  </tr>
                  <tr>
                    <td>Position X</td>
                    <td contenteditable="true" id="position-x">${sourceData.sceneItemTransform.positionX}</td>
                  </tr>
                  <tr>
                    <td>Position Y</td>
                    <td contenteditable="true" id="position-y">${sourceData.sceneItemTransform.positionY}</td>
                  </tr>
                  <tr>
                    <td>Rotation</td>
                    <td contenteditable="true" id="rotation">${sourceData.sceneItemTransform.rotation}</td>
                  </tr>
                  <tr>
                    <td>Scale X</td>
                    <td contenteditable="true" id="scale-x">${sourceData.sceneItemTransform.scaleX}</td>
                  </tr>
                  <tr>
                    <td>Scale Y</td>
                    <td contenteditable="true" id="scale-y">${sourceData.sceneItemTransform.scaleY}</td>
                  </tr>
                  <tr>
                    <td>Source Height</td>
                    <td contenteditable="true" id="source-height">${sourceData.sceneItemTransform.sourceHeight}</td>
                  </tr>
                  <tr>
                    <td>Source Width</td>
                    <td contenteditable="true" id="source-width">${sourceData.sceneItemTransform.sourceWidth}</td>
                  </tr>
                  </table>
                `, `${sourceData.sourceName}`, `Edit Transform Settings`, `medium`, {})

                document.querySelector(`.settings-modal-alt .main .form-group button#update`).addEventListener(`click`, () => {
                  SB__StreamerbotActionPackageOBSRequest(`SetSceneItemTransform`, {
                    sceneName: document.querySelector(`main .main .card-grid .card.sources > ul`).getAttribute(`data-scene`),
                    sceneItemId: sourceData.sceneItemId,
                    sceneItemTransform: {
                      alignment: +document.querySelector(`.settings-modal-alt .main table #alignment`).value || 5,
                      boundsAlignment: +document.querySelector(`.settings-modal-alt .main table #bounds-alignment`).value || 0,
                      boundsWidth: +document.querySelector(`.settings-modal-alt .main table #bounds-width`).value || 1,
                      boundsHeight: +document.querySelector(`.settings-modal-alt .main table #bounds-height`).value || 1,
                      boundsType: document.querySelector(`.settings-modal-alt .main table #bounds-type`).value || "OBS_BOUNDS_NONE",
                      cropTop: +document.querySelector(`.settings-modal-alt .main table #crop-top`).value || 0,
                      cropRight: +document.querySelector(`.settings-modal-alt .main table #crop-right`).value || 0,
                      cropBottom: +document.querySelector(`.settings-modal-alt .main table #crop-bottom`).value || 0,
                      cropLeft: +document.querySelector(`.settings-modal-alt .main table #crop-left`).value || 0,
                      width: +document.querySelector(`.settings-modal-alt .main table #width`).value || null,
                      height: +document.querySelector(`.settings-modal-alt .main table #height`).value || null,
                      positionX: +document.querySelector(`.settings-modal-alt .main table #position-x`).value || 0,
                      positionY: +document.querySelector(`.settings-modal-alt .main table #position-y`).value || 0,
                      rotation: +document.querySelector(`.settings-modal-alt .main table #rotation`).value || 0,
                      scaleX: +document.querySelector(`.settings-modal-alt .main table #scale-x`).value || null,
                      scaleY: +document.querySelector(`.settings-modal-alt .main table #scale-y`).value || null,
                      sourceHeight: +document.querySelector(`.settings-modal-alt .main table #source-height`).value || 0,
                      sourceWidth: +document.querySelector(`.settings-modal-alt .main table #source-width`).value || 0
                    }
                  }, obsConnection)
                })

              })
            });
            break
          case `GetSourceScreenshot`:
            createModal(`<img src="${obsData.imageData}" alt="Preview image from current Scene">`, `Preview image from current Scene`, undefined, `medium`, {})
            break
          case `GetCurrentProgramScene`:
            SB__StreamerbotActionPackageOBSRequest(`GetSourceScreenshot`, {
              sourceName: obsData.currentProgramSceneName,
              imageFormat: `jpg`,
              imageCompressionQuality: 100
            })
            break
          default:
            break
        }
      }

      function SB__RunAction(name, args = {}, id = "DoAction") {
        let jsonBody = {
          request: `DoAction`,
          action: {
            name: name
          },
          id: id
        }

        if (args != {}) jsonBody.args = args

        ws.send(JSON.stringify(jsonBody))

        console.log(`%c[Streamer.bot Requests]%c Running action "${name}" with the args ${JSON.stringify(args)} and a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
      }
      
      function SB__RunActionById(actionId, args = {}, id = `DoAction`) {
        let jsonBody = {
          request: `DoAction`,
          action: {
            id: actionId
          },
          id: id
        }
        
        if (args != {}) jsonBody.args = args
        
        ws.send(JSON.stringify(jsonBody))

        console.log(`%c[Streamer.bot Requests]%c Running action "${actionId}" with the args ${JSON.stringify(args)} and a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
      }
    })

    function SB__StreamerbotActionPackageRequest(wsRequest, wsData = undefined, id = "StreamerbotActionPackage") {
      let args = {
        wsRequest: wsRequest
      }

      if (typeof wsData === `object`) {
        args = Object.entries(args)

        Object.entries(wsData).forEach(wsDataEntry => {
          args.push([wsDataEntry[0], wsDataEntry[1]])
        });

        args = Object.fromEntries(args)

      } else if (typeof wsData != `object` && wsData != undefined) {
        args.wsData = wsData
      }

      let jsonBody = {
        request: `DoAction`,
        action: {
          name: streamerbotActionPackage__name
        },
        args: args,
        id: id
      }

      if (args != {}) jsonBody.args = args
      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Action Package Requests]%c Running method "${wsRequest}" with the data ${JSON.stringify(wsData)} and a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__StreamerbotActionPackageOBSRequest(obsRequest, obsRequestData = {}, obsConnection = 0, id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `DoAction`,
        action: {
          name: streamerbotActionPackage__name
        },
        args: {
          wsRequest: `ObsSendRaw`,
          wsDataConnection: obsConnection,
          wsDataRequestType: obsRequest,
          wsDataRequestData: JSON.stringify(obsRequestData)
        },
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Action Package Requests]%c Running OBS Request "${obsRequest}" with the data ${JSON.stringify(obsRequestData)} on the connection "${obsConnection}" and a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }
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
      document.querySelectorAll(`header .header-links a[data-integration=twitchspeaker]`).forEach(headerLink => {
        headerLink.parentNode.setAttribute(`hidden` , ``)
      });
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to TwitchSpeaker, reconnecting every 10s...")
    }

    ws.onopen = function () {
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to TwitchSpeaker")
      document.body.setAttribute(`twitchspeaker-state`, `connected`)
      document.querySelectorAll(`header .header-links a[data-integration=twitchspeaker]`).forEach(headerLink => {
        headerLink.parentNode.setAttribute(`hidden` , ``)
        headerLink.parentNode.removeAttribute(`hidden`)
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

// let httpsConnectionData = localStorage.getItem(`streamerbotToolbox__httpsConnection`) || undefined
// let httpsConnectionUrl

// if (httpsConnectionData != undefined) {
//   httpsConnectionData = JSON.parse(httpsConnectionData)
//   httpsConnectionUrl = `http://${httpsConnectionData.host}:${httpsConnectionData.port}`

//   document.body.setAttribute(`https-connection-state`, `enabled`)

//   connectHttpsConnection()
// }


// async function connectHttpsConnection() {
//   let actions = await fetch(`${httpsConnectionUrl}/GetActions`, {mode: `no-cors`})
//   actions = (await actions).text()
//   console.log(actions)
// }

function sendNotification(service, text) {
  if (service === `twitchspeaker`) service = `TwitchSpeaker`
  if (service === `streamer.bot`) service = `Streamer.bot`
  console.log(`%c[${service}]%c ${text}`, `color: #8c75fa;`, `color: white;`)
}

function formatStreamerbotTimestamp(timestamp) {
  timestamp = timestamp.split(`T`)
  if (timestamp[1].includes(`+`)) {
    timestamp.push(`+` + timestamp[1].split(`+`)[1])
    timestamp[1] = timestamp[1].split(`+`)[0]
  } else if (timestamp[1].includes(`-`)) {
    timestamp.push(`-` + timestamp[1].split(`-`)[1])
    timestamp[1] = timestamp[1].split(`-`)[0]
  }

  timestamp[1] = timestamp[1].split(`:`)
  timestamp[1][2] = timestamp[1][2].split(`.`)[0]
  timestamp[1] = timestamp[1].join(`:`)

  timestamp = `${timestamp[1]}`

  return timestamp
}

function createModal(modalHtml = ``, modalTitle = title, modalSubtitle = undefined, scale = `small`, settings = {}) {
  if (document.body.getAttribute(`modal-state`) != `opened` && document.body.getAttribute(`modal-state`) != `opening`) {
    if (modalSubtitle != undefined || modalSubtitle != null) {
      modalSubtitle = `<p class="subtitle">${modalSubtitle}</p>`
    } else {
      modalSubtitle = ``
    }

    let attributes = ``

    if (settings.reload === true) {
      attributes = `data-reload `
    }
  
    document.body.insertAdjacentHTML(`afterbegin`, `
    <div class="settings-modal-alt-wrapper">
      <div class="settings-modal-alt ${scale}"${attributes}>
        <div class="header">
          <div>
            <h2 class="title">${modalTitle}</h2>
            ${modalSubtitle}
          </div>
          <button 
            class="close-button mdi mdi-close-thick" 
            onclick="document.body.setAttribute('data-modal-state', 'closing'); if (document.querySelector('.settings-modal-alt-wrapper').getAttribute('data-reload') === '') { location.reload; }; setTimeout(() => { document.body.setAttribute('data-modal-state', 'closed'); document.querySelector('.settings-modal-alt-wrapper').remove(); }, 500);"
          >Close</button>
        </div>
        <div class="main">
          ${modalHtml}
        </div>
      </div>
    </div>
    `)

    document.body.setAttribute(`data-modal-state`, `opening`)
    setTimeout(() => {
      document.body.setAttribute(`data-modal-state`, `opened`)
    }, 500);
  }
}

document.addEventListener(`mousedown`, (e) => {
  if (e.target.tagName === `BODY`) {
    if (document.body.getAttribute(`data-modal-state`) === `opened`) {
      document.body.setAttribute(`data-modal-state`, `closing`)
      if (document.querySelector(`.settings-modal-alt-wrapper`).getAttribute(`data-reload`) === ``) {
        location.reload()
      }
      setTimeout(() => {
        document.body.setAttribute(`data-modal-state`, `closed`)
        document.querySelector(`.settings-modal-alt-wrapper`).remove()
      }, 500);
    }
  }
})
