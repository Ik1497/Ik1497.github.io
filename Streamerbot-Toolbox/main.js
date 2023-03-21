let version = `1.0.0-pre`
let title = `Streamer.bot Toolbox v${version}`
let documentTitle = `${title} | Streamer.bot Actions`
document.title = documentTitle

let streamerbotActionPackage__version = version
let streamerbotActionPackage__name  = `Streamer.bot Toolbox Partial - Websocket Handler`
let streamerbotActionPackage__group = `Streamer.bot Toolbox Partials (v${streamerbotActionPackage__version})`

let streamerbotToolbox__connection = loadDataFromStorage(`streamerbotToolbox__connection`)
if (streamerbotToolbox__connection === {}) {
  streamerbotToolbox__connection.host = `localhost`
  streamerbotToolbox__connection.port = `8080`
  streamerbotToolbox__connection.endpoint = `/`

  saveKeyToStorage(`streamerbotToolbox__connection`, streamerbotToolbox__connection)
}

let wsServerUrl = `ws://${streamerbotToolbox__connection.host}:${streamerbotToolbox__connection.port}${streamerbotToolbox__connection.endpoint}`

let headerLinksMap = [
  {
    name: `Dashboard`,
    integration: `streamer.bot`,
    icon: `mdi mdi-view-dashboard-variant`,
    navbarHidden: true
  },
  {
    name: `Actions`,
    integration: `streamer.bot`,
    icon: `mdi mdi-lightning-bolt`
  },
  {
    name: `Websocket Events`,
    integration: `streamer.bot`,
    icon: `mdi mdi-creation`
  },
  {
    name: `Global Variables`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-earth`,
    navbarHidden: true
  },
  {
    name: `Commands`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-comment-alert`
  },
  {
    name: `OBS Studio`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-antenna`
  },
  {
    name: `Log Viewer`,
    integration: `streamer.bot-action-package`,
    icon: `mdi mdi-file-document`,
    navbarHidden: true
  },
  {
    name: `Speaker.bot`,
    integration: `speakerbot`,
    icon: `mdi mdi-microphone`,
    navbarHidden: true
  }
]

document.querySelector("body").insertAdjacentHTML(`afterbegin`,`
<nav class="navbar">
  <input type="search" placeholder="Search...">
</nav>
<main>
</main>
`)


if (location.hash === ``) location.href = `#${urlSafe(`Dashboard`)}`

let state__404 = true

headerLinksMap.forEach(headerLink => {
  let headerLinkHash = urlSafe(headerLink.name)
  
  if (headerLinkHash === location.hash.replace(`#`, ``)) {
    state__404 = false
  }

  if (!headerLink.navbarHidden) {
    document.querySelector("nav.navbar").insertAdjacentHTML(`beforeend`,`
    <ul class="navbar-list" data-page="${urlSafe(headerLink.name)}"${location.hash === `#${urlSafe(headerLink.name)}` ? `` : `hidden`}></ul>
    `)
  }

  document.querySelector("main").insertAdjacentHTML(`beforeend`,`
  <div class="main nested" data-page="${urlSafe(headerLink.name)}"${location.hash === `#${urlSafe(headerLink.name)}` ? `` : `hidden`}></div>
  `)
});

if (state__404 === true) document.body.classList.add(`not_found`)

let headerAside = `
<div class="form-area"><label>Url</label><input type="url" value="${streamerbotToolbox__connection.host}" class="url"></div>
<div class="form-area"><label>Port</label><input type="number" value="${streamerbotToolbox__connection.port}" max="9999" class="port"></div>
<div class="form-area"><label>Endpoint</label><input type="text" value="${streamerbotToolbox__connection.endpoint}" class="endpoint"></div>
<button class="connect-websocket">Connect</button>`
let headerHtml = `<header><a href=""><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon"><div class="name-description"><p class="name">${title}</p><p class="description">by Ik1497</p></div></div></a><aside>${headerAside}</aside></header>`

document.body.insertAdjacentHTML(`afterbegin`, headerHtml)

document.querySelector(`header`).insertAdjacentHTML(`beforeend`, `
<ul class="header-links buttons-row"></ul>
`)

updateHeaderLinks()

function updateHeaderLinks() {
  document.querySelector(`header .header-links`).innerHTML = ``

  headerLinksMap.forEach(headerLink => {
    let hidden = ``
    let headerLinkActive = ``

    let headerLinkHash = urlSafe(headerLink.name)
    
    let href =` href="#${headerLinkHash}"`
    if (location.hash === `#${headerLinkHash}`) {
      headerLinkActive = ` class="button-active"`
      href = ``
    }

    if (headerLink.integration != `streamer.bot`) hidden = ` hidden`
    if (headerLink.integration === `streamer.bot-action-package` && document.body.getAttribute(`data-streamerbot-action-package`) === `installed`) hidden = ``
    if (headerLink.integration === `speakerbot` && document.body.getAttribute(`speakerbot-state`) === `connected`) hidden = ``

    document.querySelector(`header .header-links`).insertAdjacentHTML(`beforeend`, `
    <li${headerLinkActive}${hidden}>
      <a ${href}title="${headerLink.name}" data-integration="${headerLink.integration}" class="${headerLink.icon || `mdi mdi-chevron-right`}">
        <p class="button-row-title">${headerLink.name}</p>
      </a>
    </li$>
    `)
  });
}

let navbarTogglerButton = document.createElement(`button`)
navbarTogglerButton.className = `navbar-toggler footer-icon mdi mdi-menu`
navbarTogglerButton.addEventListener(`click`, () => {
  if (document.querySelector(`nav.navbar`).getAttribute(`data-visible`) === "") {
    document.querySelector(`nav.navbar`).removeAttribute(`data-visible`)
  } else {
    document.querySelector(`nav.navbar`).setAttribute(`data-visible`, ``)
  }
})

document.body.append(navbarTogglerButton)

document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, function (e) {
  saveKeyToStorage(`streamerbotToolbox__connection`, {
    host: document.querySelector(`header aside .form-area .url`).value,
    port: document.querySelector(`header aside .form-area .port`).value,
    endpoint: document.querySelector(`header aside .form-area .endpoint`).value
  })

  location.reload()
})

document.querySelector(`nav.navbar > input[type=search]`).addEventListener(`keydown`, function () {
  setTimeout(() => {    
    let currentSearchTerm = document.querySelector(`nav.navbar > input[type=search]`).value.toLowerCase()
    
    document.querySelectorAll(`nav.navbar ul.navbar-list li`).forEach(listItem => {
      let valueTitle = listItem.querySelector(`button p.title`)?.innerText.toLowerCase() ?? ``
      let valueDescription = listItem.querySelector(`button p.description`)?.innerText.toLowerCase() ?? ``

      if (valueTitle.includes(currentSearchTerm) || valueDescription.includes(currentSearchTerm)) {
        listItem.removeAttribute(`hidden`)
        listItem.setAttribute(`aria-hidden`, `false`)
      } else {
        listItem.setAttribute(`hidden`, ``)
        listItem.setAttribute(`aria-hidden`, `true`)
      }
    });
  }, 50);
})

window.addEventListener('hashchange', () => {
  updateHeaderLinks()

  document.querySelectorAll(`nav.navbar ul.navbar-list`).forEach(navbarList => {
    navbarList.setAttribute(`hidden`, ``)
  });

  document.querySelectorAll(`main .main`).forEach(main => {
    main.setAttribute(`hidden`, ``)
  });
  
  headerLinksMap.forEach(headerLink => {
    if (location.hash === `#${urlSafe(headerLink.name)}`) {
      if (!headerLink.navbarHidden) {
        document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(headerLink.name)}"]`).removeAttribute(`hidden`)
      }
      document.querySelector(`main .main[data-page="${urlSafe(headerLink.name)}"]`).removeAttribute(`hidden`)
    }
  });
});

connectws()

async function connectws() {
  document.querySelectorAll(`main .main`).forEach(main => {
    main.innerHTML = ``
  });

  document.querySelectorAll(`nav.navbar nav.navbar-list`).forEach(navbar => {
    navbar.innerHTML = ``
  });

  // let eventArgsMap = await fetch(`./eventArgsMap.json`)
  // eventArgsMap = await eventArgsMap.json()

  // let randomEventArgs = await fetch(`./random.json`)
  // randomEventArgs = await randomEventArgs.json()

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
      SB__GetInfo(`GetInfo`)
      SB__GetActions(`VerifyActions`)
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
        <p class="instance-info">Streamer.bot${data.info.name != `Streamer.bot` ? ` -  ${data.info.name}` : ``}
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
            SB__Subscribe({
              general: [`Custom`]
            }, `WebsocketHandlerAction`)

            let obsConnection = loadDataFromStorage(`streamerbotToolbox__obsStudio`)
            if (obsConnection === {}) obsConnection.connection = 0
            obsConnection = obsConnection.connection

            SB__StreamerbotActionPackageRequest(`ObsIsConnected`, obsConnection)

            document.body.setAttribute(`data-streamerbot-action-package`, `installed`)
          }


          if (dataStreamerbotActionPackage != `installed` && action.name === streamerbotActionPackage__name && action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``) != streamerbotActionPackage__version.replaceAll(`.`, ``) && !isNaN(action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``))) {
            document.body.setAttribute(`data-streamerbot-action-package`, `outdated`)
            document.body.setAttribute(`data-streamerbot-action-package-outdated`, action.group.replace(`Streamer.bot Toolbox Partials (v`, ``).replace(`)`, ``).replaceAll(`.`, ``))
          } else if (dataStreamerbotActionPackage != `installed` && dataStreamerbotActionPackage != `outdated` && action.name === streamerbotActionPackage__name && action.group != streamerbotActionPackage__group) {
            document.body.setAttribute(`data-streamerbot-action-package`, `renamed`)
          } else if (dataStreamerbotActionPackage != `installed` && dataStreamerbotActionPackage != `outdated` && dataStreamerbotActionPackage != `renamed` && action.name === streamerbotActionPackage__name && action.enabled === false) {
            document.body.setAttribute(`data-streamerbot-action-package`, `disabled`)
          }  else if (dataStreamerbotActionPackage != `installed` && dataStreamerbotActionPackage != `outdated` && dataStreamerbotActionPackage != `renamed` && dataStreamerbotActionPackage != `disabled` && action.name != streamerbotActionPackage__name) {
            document.body.setAttribute(`data-streamerbot-action-package`, `absent`)
          }
        });
      } else if (data.id === `GetInfo`) {
        SB__GetEvents(`GetEvents`)
        SB__GetActions(`GetActions`)
        SB__GetBroadcaster(`GetBroadcaster`)
        SB__GetActiveViewers(`GetActiveViewers`)
      }

      if (data?.id === `GetEvents`) {
        let eventSubscriptionAll = data.events
        SB__Subscribe(eventSubscriptionAll, `EventSubscriptionAll`)
      }

      if (data.id === `GetBroadcaster`) broadcaster = data
      if (data.id === `GetActiveViewers`) presentViewers = data

      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsSource === `StreamerbotTool`) {
        if (data?.data?.wsError === `403`) {
          createSnackbar(`Unauthorized: please fill in the correct password to use the Streamer.bot Action Package`)
          document.body.setAttribute(`data-streamerbot-action-package`, `unauthorized`)
        } else if (data?.data?.wsError === `404`) {
          createSnackbar(`Request Not Found`)
        }
      }

      if (data.id === `GetInfo`) {

        ///////////////////
        // Setting Modal //
        ///////////////////
        document.body.insertAdjacentHTML(`afterbegin`, `
        <button title="[CTRL + i] Open Settings" class="open-settings-modal footer-icon mdi mdi-cog"></button>
        `)

        document.querySelector(`.open-settings-modal`).addEventListener(`click`, () => {
          const Modal__Settings = createModal(`
          <div class="i-tabset full alt-background">
            <div data-tab="Integrations">
              <ul class="integrations-list"></ul>
            </div>

            <div data-tab="OBS Studio">
              <p>OBS Studio is fully managed with Streamer.bot in combination with the Streamer.bot Action Package</p>
              <br>
              <div class="form-group styled">
                <label>Connection</label>
                <input type="number" value="0">
              </div>
            </div>
          </div>
          `, `Settings`, undefined, `fullscreen`)

          reloadTabSets()

          /* ------------ */
          /* Integrations */
          /* ------------ */

          // Streamer.bot

          let streamerbotSettings__ListItem = document.createElement(`li`)
          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).prepend(streamerbotSettings__ListItem)
          streamerbotSettings__ListItem.className = `mdi mdi-check`
          streamerbotSettings__ListItem.dataset.integration = `streamer.bot`
          streamerbotSettings__ListItem.innerHTML = ` Streamer.bot (${instance.version}) • ${wsServerUrl} `

          let streamerbotSettings__ListItem__Button = document.createElement(`button`)
          streamerbotSettings__ListItem.append(streamerbotSettings__ListItem__Button)
          streamerbotSettings__ListItem__Button.className = `mdi mdi-cog`

          streamerbotSettings__ListItem__Button.addEventListener(`click`, () => {
            let Modal__streamerbotSettings = createModal(`
            <div class="form-group styled">
              <label for="streamerbot-settings-input--host">Host</label>
              <input type="text" id="streamerbot-settings-input--host">
            </div>

            <div class="form-group styled">
              <label for="streamerbot-settings-input--port">Port</label>
              <input type="text" id="streamerbot-settings-input--port">
            </div>

            <div class="form-group styled">
              <label for="streamerbot-settings-input--endpoint">Endpoint</label>
              <input type="text" id="streamerbot-settings-input--endpoint">
            </div>
            `, `Streamer.bot Settings`, undefined, `medium`, {
              footerButtons: [
                {
                  name: `Cancel`,
                  id: `cancel`,
                  type: `plain`
                },
                {
                  name: `Save`,
                  id: `save`,
                  type: `theme`
                }
              ]
            })

            Modal__streamerbotSettings.onFooterButtonPress = (id) => {
              console.log(Modal__streamerbotSettings)
              console.log(Modal__streamerbotSettings.main)
              console.log(Modal__streamerbotSettings.main.querySelector(`#streamerbot-settings-input--host`))
              console.log(Modal__streamerbotSettings.main.querySelector(`#streamerbot-settings-input--host`).value)
              if (id === `save`) {
                saveKeyToStorage(`streamerbotToolbox__connection`, {
                  host: Modal__streamerbotSettings.main.querySelector(`#streamerbot-settings-input--host`).value,
                  port: Modal__streamerbotSettings.main.querySelector(`#streamerbot-settings-input--port`).value,
                  endpoint: Modal__streamerbotSettings.main.querySelector(`#streamerbot-settings-input--endpoint`).value
                })

                location.reload()
              }
            }
          })

          // Streamer.bot Action Package

          if (document.body.getAttribute(`data-streamerbot-action-package`) === `absent`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-cloud-download" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (used for global variables, chat and more) <button id="more-info">Download, More Info, and Authentication</button></li>`)
          if (document.body.getAttribute(`data-streamerbot-action-package`) === `outdated`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-close-thick" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (outdated) <button id="more-info">Update to use it again</button></li>`)
          if (document.body.getAttribute(`data-streamerbot-action-package`) === `renamed`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-alert" data-integration="streamer.bot-action-package"> Streamer.bot Action Package, you have broken something <button id="more-info">Please re-install it again</button></li>`)
          if (document.body.getAttribute(`data-streamerbot-action-package`) === `unauthorized`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-close-thick" data-integration="streamer.bot-action-package"> Streamer.bot Action Package, you're unauthorized please provide a working password <button id="more-info">Authorize</button></li>`)
          if (document.body.getAttribute(`data-streamerbot-action-package`) === `disabled`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-close-thick" data-integration="streamer.bot-action-package"> Streamer.bot Action Package, the action is currently disabled enable the action again <button id="more-info" class="mdi mdi-cog"></button></li>`)
          if (document.body.getAttribute(`data-streamerbot-action-package`) === `installed`) Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-check" data-integration="streamer.bot-action-package"> Streamer.bot Action Package (v${streamerbotActionPackage__version}) • ${wsServerUrl} <button id="more-info" class="mdi mdi-cog"></button></li>`)

          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list li[data-integration="streamer.bot-action-package"] button#more-info`).addEventListener(`click`, function () {
            const streamerbotToolbox__StreamerbotActionPackage = loadDataFromStorage(`streamerbotToolbox__StreamerbotActionPackage`)
            const Modal__streamerbotActionPackageModal = createModal(`
            <div class="form-group styled">
              <label for="password">Password</label>
              <div class="flex">
                <input type="password" name="password" id="password" value="${streamerbotToolbox__StreamerbotActionPackage.password === undefined ? `` : streamerbotToolbox__StreamerbotActionPackage.password}" placeholder="Password">
                <button class="mdi mdi-eye" id="show-password"></button>
              </div>
            </div>
            <br>
            <hr>
            <br>
            <p>The Streamer.bot Action Package is used for getting/setting/unsetting global variables, managing Twitch/YouTube chat, command features and more.</p>
            <br>
            <p>When this action is imported it will show more tabs and it will even show more features on certain tabs.</p>
            <br>
            <p>To use this you simply need to import the code in Streamer.bot, make a password and sync it in the password field above.</p>
            <br>
            <div class="form-group styled">
              <button onclick="window.open('./action-package.sb')">Download</button>
            </div>
            `, `Streamer.bot Action Package`, undefined, `medium`, {})

            Modal__streamerbotActionPackageModal.main.querySelector(`.form-group input#password`).addEventListener(`keydown`, () => {
              setTimeout(() => {
                let streamerbotToolbox__StreamerbotActionPackage = JSON.parse(localStorage.getItem(`streamerbotToolbox__StreamerbotActionPackage`) || `{}`) ?? {}
                streamerbotToolbox__StreamerbotActionPackage.password = Modal__streamerbotActionPackageModal.main.querySelector(`.form-group input#password`).value
                localStorage.setItem(`streamerbotToolbox__StreamerbotActionPackage`, JSON.stringify(streamerbotToolbox__StreamerbotActionPackage))
              }, 50);
            })

            Modal__streamerbotActionPackageModal.main.querySelector(`#show-password`).addEventListener(`click`, () => {
              if (Modal__streamerbotActionPackageModal.main.querySelector(`#password`).type === `password`) {
                Modal__streamerbotActionPackageModal.main.querySelector(`#password`).type = `text`
              } else {
                Modal__streamerbotActionPackageModal.main.querySelector(`#password`).type = `password`
              }
            })
          })

          // OBS Studio

          if (document.body.getAttribute(`data-streamerbot-action-package`) === `installed`) {
            Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-check" data-integration="obs-studio"> OBS Studio (Connected) • Connection: ${JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`) ?? `{"connection": 0}`).connection || 0}</li>`)
          } else {
            Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, `<li class="mdi mdi-close-thick" data-integration="obs-studio"> OBS Studio (Disconnected)</li>`)
          }

          // Speaker.bot
          
          let integrationsList__speakerbot = `<li class="mdi mdi-plus" data-integration="speakerbot"> Speaker.bot <button>Connect!</button></li>`

          if (document.body.getAttribute(`speakerbot-state`) === null) {
          } else if (document.body.getAttribute(`speakerbot-state`) === `connected`) {
            let integrationsList__speakerbot_wsUrl = localStorage.getItem(`streamerbotToolbox__speakerbot`) || {}
            integrationsList__speakerbot_wsUrl = `ws://${JSON.parse(integrationsList__speakerbot_wsUrl).host}:${JSON.parse(integrationsList__speakerbot_wsUrl).port}${JSON.parse(integrationsList__speakerbot_wsUrl).endpoint}`
            integrationsList__speakerbot = `<li class="mdi mdi-check" data-integration="speakerbot"> Speaker.bot (Connected) • ${integrationsList__speakerbot_wsUrl} <button class="mdi mdi-cog"></button></p>`
          } else if (document.body.getAttribute(`speakerbot-state`) === `disconnected`) {
            integrationsList__speakerbot = `<li class="mdi mdi-reload" data-integration="speakerbot"> Speaker.bot <button>Reconnect!</button></p>`
          }

          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list`).insertAdjacentHTML(`beforeend`, integrationsList__speakerbot)
          
          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="Integrations"] ul.integrations-list li[data-integration="speakerbot"] button`).addEventListener(`click`, function () {
            let speakerbotDefaultValues = loadDataFromStorage(`streamerbotToolbox__speakerbot`)
            if (speakerbotDefaultValues === {}) {
              speakerbotDefaultValues.host = `localhost`
              speakerbotDefaultValues.port = `7580`
              speakerbotDefaultValues.endpoint = `/`
            }

            const speakerBotModal__Settings = createModal(`
            <div class="form-group styled">
              <label for="websocket-url">Host</label>
              <input type="url" name="websocket-host" id="websocket-host" value="${speakerbotDefaultValues.host}" placeholder="${speakerbotDefaultValues.host}" class="no-margin">
            </div>

            <div class="form-group styled">
              <label for="websocket-url">Port</label>
              <input type="number" name="websocket-port" id="websocket-port" value="${speakerbotDefaultValues.port}" placeholder="${speakerbotDefaultValues.port}" class="no-margin">
            </div>

            <div class="form-group styled">
              <label for="websocket-url">Endpoint</label>
              <input type="text" name="websocket-endpoint" id="websocket-endpoint" value="${speakerbotDefaultValues.endpoint}" placeholder="${speakerbotDefaultValues.endpoint}" class="no-margin">
            </div>
            `, `Speaker.bot Settings`, undefined, `medium`, {
              footerButtons: [
                {
                  name: `Cancel`,
                  id: `cancel`,
                  type: `plain`,
                  closeModal: true
                },
                {
                  name: `Connect`,
                  id: `connect`,
                  type: `theme`
                }
              ]
            })

            speakerBotModal__Settings.onFooterButtonPress = (id) => {
              if (id === `connect`) {
                saveKeyToStorage(`streamerbotToolbox__speakerbot`, {
                  host: speakerBotModal__Settings.main.querySelector(`.form-group input#websocket-host`).value,
                  port: speakerBotModal__Settings.main.querySelector(`.form-group input#websocket-port`).value,
                  endpoint: speakerBotModal__Settings.main.querySelector(`.form-group input#websocket-endpoint`).value
                })

                location.reload()
              }
            }
          })

          /* ---------- */
          /* OBS Studio */
          /* ---------- */

          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="OBS Studio"] input`).addEventListener(`keydown`, updateObsStudioSettings)
          Modal__Settings.main.querySelector(`.i-tabset div[data-tab="OBS Studio"] input`).addEventListener(`wheel`, updateObsStudioSettings)

          function updateObsStudioSettings() {
            let obsStudioSettings = JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`)) || {connection: 0}
            let obsStudioConnection = Modal__Settings.main.querySelector(`.i-tabset div[data-tab="OBS Studio"] input`).value

            if (obsStudioConnection < 1) {
              obsStudioConnection = 0
            }

            obsStudioSettings.connection = obsStudioConnection

            setTimeout(() => {
              localStorage.setItem(`streamerbotToolbox__obsStudio`, JSON.stringify(obsStudioSettings))
            })
          }

        })
      }

      /***
      *****************************
      *****************************
      *****************************
      ********* Dashboard *********
      *****************************
      *****************************
      *****************************
      ***/


      if (data.id === `GetBroadcaster`) {
        document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).innerHTML = `
        <aside>
          <div class="card-grid" style="grid-template-columns: auto max-content;${new URLSearchParams(window.location.search).get("popout") != null ? ` height: 100%;` : ``}">

            <div class="card" style="height: calc(100% - ${new URLSearchParams(window.location.search).get("popout") != null ? `3` : `8`}rem); max-height: calc(100vh - ${new URLSearchParams(window.location.search).get("popout") != null ? `3` : `8`}rem);" data-view="all">
              <div class="card-header">
                <p class="card-title">Chat</p>
                <div class="form-group styled no-margin no-padding dense card-header-append">
                  <button class="outlined no-margin no-padding dense" id="open-popout-chat-window">Popout</button>
                </div>
              </div>
              <hr>
              <ul class="chat-messages" style="overflow: auto; height: calc(100vh - 20rem); max-height: 100%; width: 100%; display: flex; flex-direction: column; gap: .25rem;"></ul>
              <div class="send-message">
                <div class="form-group styled no-margin">
                  <select class="no-border-radius no-margin fit-content service">
                    <option value="Twitch">Twitch</option>
                    <option value="TwitchBot">Twitch (BOT)</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Both">YouTube & Twitch</option>
                  </select>
                  <select class="no-border-radius no-margin fit-content modifier">
                    <option value="none">No modifier</option>
                    <option value="action">/me</option>
                    <option value="clear">/clear</option>
                    <option value="slow">/slow</option>
                    <option value="slowoff">/slowoff</option>
                    <option value="emoteonly">/emoteonly</option>
                    <option value="emoteonlyoff">/emoteonlyoff</option>
                    <option value="followers">/followers</option>
                    <option value="followersoff">/followersoff</option>
                    <option value="subscribers">/subscribers</option>
                    <option value="subscribersoff">/subscribersoff</option>
                    <option value="vip">/vip</option>
                    <option value="unvip">/unvip</option>
                    <option value="mod">/mod</option>
                    <option value="unmod">/unmod</option>
                    <option value="announce">/announce</option>
                    <option value="announceblue">/announceblue</option>
                    <option value="announcegreen">/announcegreen</option>
                    <option value="announceorange">/announceorange</option>
                    <option value="announcepurple">/announcepurple</option>
                  </select>
                  <input type="text" placeholder="Send message to chat" class="no-margin no-border-radius">
                  <button class="submit no-border-radius no-margin">Send</button>
                </div>
              </div>
            </div>

            <div class="card" style="height: fit-content; max-height: calc(100vh - 15rem); width: 15rem; max-width: 15rem;${new URLSearchParams(window.location.search).get("popout") != null ? ` display: none;` : ``}">
              <div class="card-header">
                <p class="card-title">Present Viewers</p>
              </div>
              <hr>
              <ul class="present-viewers styled">
                <div class="form-group styled no-margin">
                  <input type="search" placeholder="Search...">
                </div>
              </ul>
            </div>

          </div>
        </aside>
        `

        DashboardAsyncPage()
        async function DashboardAsyncPage() {
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).classList.add(`full`)
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).classList.add(`grid`)
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).classList.add(`auto-col`)
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

          if (new URLSearchParams(window.location.search).get("popout") === null) {
            document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).insertAdjacentHTML(`afterbegin`, `
            <div class="main-contents">
              <blockquote class="error streamerbot-action-package--outdated">
                <p class="blockquote-text">Your Streamer.bot Action Package is outdated, please go to the settings and re-install the new version to properly use it again.</p>
              </blockquote>
              <blockquote class="error streamerbot-action-package--disabled">
                <p class="blockquote-text">Your Streamer.bot Action Package action is currently disabled, enable the action again so you can use all the features again.</p>
              </blockquote>
              <blockquote class="error streamerbot-action-package--unauthorized">
                <p class="blockquote-text">You're unauthorized, please fill in the correct password to continue using the Streamer.bot Action Package.</p>
              </blockquote>
              <blockquote class="warning streamerbot-action-package--renamed">
                <p class="blockquote-text">You've edited something with your Streamer.bot Action Package, please go to the settings and re-install it again.</p>
              </blockquote>
              <blockquote class="info streamerbot-action-package--absent">
                <p class="blockquote-text">You don't have the Streamer.bot Action Package installed, thus you don't have access to all the features of this website. Go to settings and install the Streamer.bot Action package.</p>
              </blockquote>
              <h1 style="padding-bottom: 3rem;">${welcomeMessage}</h1>
              <p>Streamer.bot Toolbox (v${version}) is made for making developing Streamer.bot actions easier;</p>
              <p>this tool is currently a very work in progress, features may come and go over time.</p>
              <br>
              <p>This tool requires your <code>Server/Clients</code> --> <code>Websocket Server</code> to be enabled.</p>
              <br>
              <p>Integrations:</p>
              <p>• Streamer.bot</p>
              <p>• Streamer.bot Action Package</p>
              <p>• Speaker.bot</p>
              <br>
              <p>Features:</p>
              <p>• Present Viewers List</p>
              <p>• View chat and send messages to chat with modifiers like /me and /announce</p>
              <p>• View all websocket events with a websocket event history</p>
              <p>• Add/Update/Remove Global Arguments</p>
              <p>• Change command settings</p>
              <p>• OBS Studio Management</p>
              <p>• Log viewer (WIP)</p>
              <p>• Speaker.bot Management</p>
              <br>
              <p><b>Open the settings in bottom right to enable these integrations and for more info</b></p>
            </div>
            `)
          }
        }

        if (new URLSearchParams(window.location.search).get("popout") != null) {
          document.querySelector(`header`).style.display = `none`
          document.querySelector(`nav.navbar`).style.display = `none`
          document.querySelectorAll(`main .main:not([data-page="${urlSafe(`Dashboard`)}"]), .footer-icon`).forEach(main => {
            main.style.display = `none`
          });
          document.querySelector(`main`).style.margin = `0`
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).style.margin = `0`
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"]`).style.padding = `0`
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] aside`).style.minHeight = `100vh`
          document.getElementById(`open-popout-chat-window`).parentNode.style.display = `none`
          document.title = `Popout Chat | ${document.title}`
        }

        document.getElementById(`open-popout-chat-window`).onclick = () => {
          window.open(`?popout#Dashboard`, undefined, `toolbar=yes,titlebar=yes,status=yes`)
        }

        document.querySelector(`.card .send-message select.service`).onwheel = (e) => {
          setTimeout(() => {
            selectChatServiceUpdate(e)
          }, 50);
        }

        document.querySelector(`.card .send-message select.service`).onchange = (e) => {
          selectChatServiceUpdate(e)
        }

        function selectChatServiceUpdate() {
          if (document.querySelector(`.card .send-message select.service`).value === `YouTube`) {
            document.querySelector(`.card .send-message select.modifier`).disabled = true
            document.querySelector(`.card .send-message select.modifier`).value = `none`

            document.querySelector(`.card .send-message input`).placeholder = `Send message to chat`
            document.querySelector(`.card .send-message input`).disabled = false
          } else {
            document.querySelector(`.card .send-message select.modifier`).disabled = false
          }
        }
        
        document.querySelector(`.card .send-message select.modifier`).onchange = (e) => {
          selectModifierUpdate(e)
        }
        document.querySelector(`.card .send-message select.modifier`).onwheel = (e) => {
          setTimeout(() => {
            selectModifierUpdate(e)
          }, 50);
        }

        function selectModifierUpdate(e) {
          document.querySelector(`.card .send-message input`).value = ``

          selectPlaceholderMap = {
            none: `Send message to chat`,
            action: `Send message with /me to chat`,
            shoutout: `Fill in the user's login name that you want to shoutout (Required)`,
            mod: `Fill in the user that you want to mod (Required)`,
            unmod: `Fill in the user that you want to unmod (Required)`,
            vip: `Fill in the user that you want to vip (Required)`,
            unvip: `Fill in the user that you want to unvip (Required)`,
            clear: null,
            emoteonly: null,
            emoteonlyoff: null,
            followers: `Fill in the duration of the followers only (Optional)`,
            followersoff: null,
            subscribers: null,
            subscribersoff: null,
            slow: `Fill in the duration of the slow mode between messages (Optional)`,
            slowoff: null,
            announce: `Send an announcement to chat`,
            announceblue: `Send a blue announcement to chat`,
            announcegreen: `Send a green announcement to chat`,
            announceorange: `Send a orange announcement to chat`,
            announcepurple: `Send a purple announcement to chat`
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
  
          console.log(`[${package__chatService} - ${package__chatModifier}] ${package__chatMessage}`)

          if (package__chatService === `Both`) {
            SB__StreamerbotActionPackageRequest(`YouTubeSendMessage`, package__chatMessage)
          }
          
          if (package__chatModifier === `none`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterMessage`, package__chatMessage)
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotMessage`, package__chatMessage)
            } else if (package__chatService === `YouTube`) {
              SB__StreamerbotActionPackageRequest(`YouTubeSendMessage`, package__chatMessage)
            }

          } else if (package__chatModifier === `action`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAction`, package__chatMessage)
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAction`, package__chatMessage)
            }

          } else if (package__chatModifier === `announce`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAnnouncement`, {wsDataMessage: package__chatMessage})
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAnnouncement`, {wsDataMessage: package__chatMessage})
            }

          } else if (package__chatModifier === `announceblue`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `blue`})
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `blue`})
            }

          } else if (package__chatModifier === `announcegreen`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `green`})
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `green`})
            }

          } else if (package__chatModifier === `announceorange`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `orange`})
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `orange`})
            }

          } else if (package__chatModifier === `announcepurple`) {
            if (package__chatService === `Twitch` || package__chatService === `Both`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBroadcasterAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `purple`})
            } else if (package__chatService === `TwitchBot`) {
              SB__StreamerbotActionPackageRequest(`TwitchSendBotAnnouncement`, {wsDataMessage: package__chatMessage, wsDataColor: `purple`})
            }

          } else if (package__chatModifier === `clear`) {
            SB__StreamerbotActionPackageRequest(`TwitchClearChatMessages`)
            document.querySelector(`main .card ul.chat-messages`).innerHTML = ``
            SendChatNotification(`Chat cleared`)

          } else if (package__chatModifier === `slow`) {
            SB__StreamerbotActionPackageRequest(`TwitchSlowMode`, {wsDataEnabled: true, wsDataDuration: package__chatMessage || 30})
            SendChatNotification(`Enabling slow mode for ${ package__chatMessage || 30}s`)

          } else if (package__chatModifier === `slowoff`) {
            SB__StreamerbotActionPackageRequest(`TwitchSlowMode`, {wsDataEnabled: false, wsDataDuration: 0})
            SendChatNotification(`Disabling slow mode`)

          } else if (package__chatModifier === `emoteonly`) {
            SB__StreamerbotActionPackageRequest(`TwitchEmoteOnly`, true)
            SendChatNotification(`Enabling emote only mode`)

          } else if (package__chatModifier === `emoteonlyoff`) {
            SB__StreamerbotActionPackageRequest(`TwitchEmoteOnly`, false)
            SendChatNotification(`Disabling emote only mode`)

          } else if (package__chatModifier === `followers`) {
            SB__StreamerbotActionPackageRequest(`TwitchFollowMode`, {wsDataEnabled: true, wsDataDuration: package__chatMessage || 0})
            SendChatNotification(`Enabling followers only mode${package__chatMessage ? ` for ${package__chatMessage} minutes` : ``}`)

          } else if (package__chatModifier === `followersoff`) {
            SB__StreamerbotActionPackageRequest(`TwitchFollowMode`, {wsDataEnabled: false, wsDataDuration: 0})
            SendChatNotification(`Disabling followers only mode`)

          } else if (package__chatModifier === `subscribers`) {
            SB__StreamerbotActionPackageRequest(`TwitchSubscriberOnly`, true)
            SendChatNotification(`Enabling subscribers only mode`)

          } else if (package__chatModifier === `subscribersoff`) {
            SB__StreamerbotActionPackageRequest(`TwitchSubscriberOnly`, false)
            SendChatNotification(`Disabling subscribers only mode`)

          } 
          
          else if (package__chatModifier === `shoutout`) {
            SB__StreamerbotActionPackageRequest(`TwitchSendShoutout`, package__chatMessage)
            SendChatNotification(`Attempting to shoutout ${package__chatMessage}`)

          } else if (package__chatModifier === `vip`) {
            SB__StreamerbotActionPackageRequest(`TwitchAddVip`, package__chatMessage)

          } else if (package__chatModifier === `unvip`) {
            SB__StreamerbotActionPackageRequest(`TwitchRemoveVip`, package__chatMessage)

          } else if (package__chatModifier === `mod`) {
            SB__StreamerbotActionPackageRequest(`TwitchAddModerator`, package__chatMessage)

          } else if (package__chatModifier === `unmod`) {
            SB__StreamerbotActionPackageRequest(`TwitchRemoveModerator`, package__chatMessage)

          }
        }
        
      }
      
      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsSource === `StreamerbotTool`) {
        if (data.data.wsRequest === `TwitchAddVip`) {
          if (data.data.wsData.result === true) SendChatNotification(`Added vip ${data.data.wsData.user}`)
          if (data.data.wsData.result === false) SendChatNotification(`Failed to add vip ${data.data.wsData.user}`)
        } else if (data.data.wsRequest === `TwitchRemoveVip`) {
          SendChatNotification(`Removed vip`)
        } else if (data.data.wsRequest === `TwitchAddModerator`) {
          SendChatNotification(`Added vip`)
        }
      }

      function SendChatNotification(message) {
        document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
        <li data-source="twitch">
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <p style="color: var(--color-link);">${message}</p>
        </div>
        </li>`)
      }

      if (data?.id === `GetActiveViewers`) {
        let viewers = []

        data.viewers.forEach(viewer => {
          if (viewer.role === `Broadcaster`) {
            viewers.push(viewer)
          }
        });

        data.viewers.forEach(viewer => {
          if (viewer.role === `Moderator`) {
            viewers.push(viewer)
          }
        });

        data.viewers.forEach(viewer => {
          if (viewer.role != `Broadcaster` && viewer.role != `Moderator` && viewer.role != `Viewer`) {
            viewers.push(viewer)
          }
        });

        data.viewers.forEach(viewer => {
          if (viewer.role === `Viewer`) {
            viewers.push(viewer)
          }
        });

        viewers.forEach(viewer => {
          viewer.type = ``
          if (!isNaN(viewer.id)) {
            viewer.type = `Twitch`
          } else {
            viewer.type = `YouTube`
          }

          let viewerListItem = document.createElement(`li`)

          let viewerListItem__button = document.createElement(`button`)
          viewerListItem.append(viewerListItem__button)

          viewerListItem__button__title = document.createElement(`p`)
          viewerListItem__button__title.className = `title`
          viewerListItem__button__title.innerText = viewer.display
          viewerListItem__button.append(viewerListItem__button__title)
          
          viewerListItem__button__description = document.createElement(`p`)
          viewerListItem__button__description.className = `description ${viewer.type === `YouTube` ? `mdi mdi-youtube` : `mdi mdi-twitch`}`
          viewerListItem__button__description.innerText = ` ${viewer.role}`
          viewerListItem__button.append(viewerListItem__button__description)

          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.present-viewers`).append(viewerListItem)

          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.present-viewers input[type="search"]`).addEventListener(`keydown`, () => {
            setTimeout(() => {
              let value = document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.present-viewers input[type="search"]`).value.toLowerCase()
              document.querySelectorAll(`main .main[data-page="${urlSafe(`Dashboard`)}"] ul.present-viewers li`).forEach(listItem => {
                if (listItem.querySelector(`button p.title`).innerText.toLowerCase().includes(value) || listItem.querySelector(`button p.description`).innerText.toLowerCase().includes(value)) {
                  listItem.setAttribute(`hidden`, ``)
                  listItem.removeAttribute(`hidden`)
                } else {
                  listItem.setAttribute(`hidden`, ``)
                }
              });
            }, 50);
          })

          let groups = `<ul class="buttons-row list-items tonal">`
          viewer.groups.forEach(group => {
            groups += `<li>${group}</li>`
          });
          groups += `</ul>`

          viewerListItem__button.addEventListener(`click`, () => {
            let userSettingsHtml = ``

            createModal(`
            <ul class="buttons-row list-items tonal">
              <li class="${viewer.type === `YouTube` ? `mdi mdi-youtube` : `mdi mdi-twitch`}">${viewer.type}</li>
              ${viewer.subscribed ? `<li class="mdi mdi-account-star">Subscribed</li>` : ``}
              <li>${viewer.role}</li>
              ${viewer.exempt ? `<li>Timeout Exempt</li>` : ``}
            </ul>
            <br>
            <table class="styled">
              <tbody>
                <tr>
                  <td style="text-align: right;">Display Name</td>
                  <td style="text-align: left;">${viewer.display}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">Login Name</td>
                  <td style="text-align: left;">${viewer.login}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">User Id</td>
                  <td style="text-align: left;">${viewer.id}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">Previous Active</td>
                  <td style="text-align: left;">${SB__FormatTimestamp(viewer.previousActive, `medium`)}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">Channel Points Used</td>
                  <td style="text-align: left;">${viewer.channelPointsUsed}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">Groups</td>
                  <td style="text-align: left;">${groups}</td>
                </tr>
              </tbody>
            </table>
            ${userSettingsHtml}
            `, viewer.display, `Inspect user`, `small`, {})
          })
        });
      }
      
      if (data?.event?.source === `Twitch` && data?.event?.type === `ChatMessage`) {
        TwitchChatMessageEvent()
        async function TwitchChatMessageEvent() {  
          let profileImageUrl = await fetch(`https://decapi.me/twitch/avatar/${data.data.message.username}`)
          profileImageUrl = await profileImageUrl.text()

          let italics = ``
          if (data.data.message.isMe === true) italics = `font-style: italic`
  
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="${data.event.source}" data-message-id="${data.data.message.msgId}">
            <div style="display: flex; align-items: center; gap: 0.25rem; max-width: 600px;">
              <p style="min-width: 4.5rem; text-align: center; color: var(--text-500);">${SB__FormatTimestamp(data.timeStamp, `small`)}</p>
              <div class="profile-image mdi mdi-twitch" style="display: flex; align-items: center;">
                <img src="${profileImageUrl}" alt="" style="width: 1rem; height: 1rem; border-radius: 100vmax;">
              </div>
              <p style="color: ${data.data.message.color}; margin-left: 0.25rem;">${data.data.message.displayName}</p>
              <p style="${italics}">${data.data.message.message}</p>
            </div>
          </li>
          `)
        }
      }

      if (data?.event?.source === `Twitch` && data?.event?.type === `ChatMessageDeleted`) {
        let messageDOM = document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.chat-messages li[data-message-id="${data.data.targetMessageId}"]`)
        if (messageDOM != null) {
          messageDOM.remove()
        }
      }

      if (data?.event?.source === `Twitch` && data?.event?.type === `Announcement`) {
        TwitchChatMessageEvent()
        async function TwitchChatMessageEvent() {  
          let profileImageUrl = await fetch(`https://decapi.me/twitch/avatar/${data.data.userName}`)
          profileImageUrl = await profileImageUrl.text()

          let announcementColorBottom = `#416b81`
          let announcementColorTop = `#9bc6dd`
          if (data.data.announcementColor === `PRIMARY`) announcementColorBottom = `#416b81`
          if (data.data.announcementColor === `PRIMARY`) announcementColorTop = `#9bc6dd`
          if (data.data.announcementColor === `BLUE`) announcementColorBottom = `#327581`
          if (data.data.announcementColor === `BLUE`) announcementColorTop = `#00dbff`
          if (data.data.announcementColor === `GREEN`) announcementColorBottom = `#27765c`
          if (data.data.announcementColor === `GREEN`) announcementColorTop = `#3ff1b6`
          if (data.data.announcementColor === `ORANGE`) announcementColorBottom = `#ffd600`
          if (data.data.announcementColor === `ORANGE`) announcementColorTop = `#d3c683`
          if (data.data.announcementColor === `PURPLE`) announcementColorBottom = `#5cbbf3`
          if (data.data.announcementColor === `PURPLE`) announcementColorTop = `#dc90ff`
  
          document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
          <li data-source="${data.event.source}" data-message-id="${data.data.msgId}" style="background: var(--background-mute); padding-inline: 5px; padding-block: .6rem; border-left: 5px solid; border-right: 5px solid; border-image: linear-gradient(0deg, ${announcementColorBottom}, ${announcementColorTop}) 1 round;">
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <p class="mdi mdi-bullhorn-outline">Announcement</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <p style="min-width: 4.5rem; text-align: center; color: var(--text-500);">${SB__FormatTimestamp(data.timeStamp, `small`)}</p>
              <div class="profile-image mdi mdi-twitch" style="display: flex; align-items: center;">
                <img src="${profileImageUrl}" alt="" style="width: 1rem; height: 1rem; border-radius: 100vmax;">
              </div>
              <p style="color: ${data.data.color};">${data.data.displayName}</p>
              <p>${data.data.message}</p>
            </div>
          </li>
          `)
        }
      }

      if (data?.event?.source === `Twitch` && data?.event?.type === `ChatCleared`) {
        document.querySelector(`main .card ul.chat-messages`).innerHTML = ``
        SendChatNotification(`Chat cleared`)
      }

      if (data?.event?.source === `YouTube` && data?.event?.type === `Message`) {
        document.querySelector(`main .main[data-page="${urlSafe(`Dashboard`)}"] .card ul.chat-messages`).insertAdjacentHTML(`afterbegin`, `
        <li data-source="${data.event.source}" data-message-id="${data.data.eventId}">
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <p style="min-width: 4.5rem; text-align: center; color: var(--text-500);">${SB__FormatTimestamp(data.data.publishedAt, `small`)}</p>
            <div class="profile-image mdi mdi-youtube" style="display: flex; align-items: center;">
              <img src="${data.data.user.profileImageUrl}" alt="" style="width: 1rem; height: 1rem; border-radius: 100vmax;">
            </div>
            <p style="color: red;">${data.data.user.name}</p>
            <p>${data.data.message}</p>
          </div>
        </li>
        `)
      }

      /***
      ***************************
      ***************************
      ***************************
      ********* Actions *********
      ***************************
      ***************************
      ***************************
      ***/
     
      if (document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] > .card-grid`) === null) {
        document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"]`).classList.add(`col-2`)
        document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"]`).insertAdjacentHTML(`beforeend`, `
        <div class="card-grid"></div>
        <aside>
          <div class="card-grid">
            <div class="card arguments">
              <div class="card-header">
                <p class="card-title">Arguments</p>
                <div class="form-group styled no-margin card-header-append" id="clear-arguments">
                  <button class="primary dense mdi mdi-trash-can-outline">Clear</button>
                </div>
              </div>
              <hr>
              <table class="styled full"></table>
            </div>
            <div class="card action-history">
              <div class="card-header">
                <p class="card-title">Action History</p>
                <div class="form-group styled no-margin card-header-append" id="toggle-exclusion" title="This excludes actions that you've set to exclude from action history inside of Streamer.bot">
                  <button class="primary dense" data-button-state="${localStorage.getItem(`streamerbotToolbox__actionHistory`) === `false` ? `offline` : `online`}">${localStorage.getItem(`streamerbotToolbox__actionHistory`) === `false` ? `Exclude` : `Excluding`}</button>
                </div>
              </div>
              <hr>
              <div class="form-group styled no-margin">
                <input type="search" placeholder="Search...">
              </div>
              <ul class="styled" data-exclusion="${localStorage.getItem(`streamerbotToolbox__actionHistory`) || `false`}">
              </ul>
            </div>
          </div>
        </aside>
        `)
  
        // Action History
  
        let toggleActionHistoryExclusionButton = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history .card-header .card-header-append button`)
        let toggleActionHistoryExclusionUlStyled = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history ul.styled`)
  
        toggleActionHistoryExclusionButton.addEventListener(`click`, () => {
          if (toggleActionHistoryExclusionButton.getAttribute(`data-button-state`) === `offline`) {
            toggleActionHistoryExclusionButton.setAttribute(`data-button-state`, `online`)
            toggleActionHistoryExclusionButton.innerHTML = `Excluding`
            localStorage.setItem(`streamerbotToolbox__actionHistory`, `true`)
            toggleActionHistoryExclusionUlStyled.setAttribute(`data-exclusion`, `true`)
          } else {
            toggleActionHistoryExclusionButton.setAttribute(`data-button-state`, `offline`)
            toggleActionHistoryExclusionButton.innerHTML = `Exclude`
            localStorage.setItem(`streamerbotToolbox__actionHistory`, `false`)
            toggleActionHistoryExclusionUlStyled.setAttribute(`data-exclusion`, `false`)
          }
        })
  
        document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history input[type="search"]`).addEventListener(`keydown`, updateActionHistorySearch)
  
        updateActionHistorySearch()
  
        function updateActionHistorySearch() {
          setTimeout(() => {
            let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history input[type="search"]`).value.toLowerCase()
            document.querySelectorAll(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history ul.styled li`).forEach(listItem => {
              let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
              if (listItemTitle.includes(searchTerm)) {
                listItem.setAttribute(`hidden`, ``)
                listItem.removeAttribute(`hidden`)
              } else {
                listItem.setAttribute(`hidden`, ``)
              }
            });
          });
        }
  
        // End Action History
  
        // Arguments
  
        reloadArgumentsTable()
  
        document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.arguments .card-header .card-header-append button`).addEventListener(`click`, () => {
          const Modal__ClearArguments = createModal(`
          <p><span class="marked-box error">${Object.keys(loadDataFromStorage(`streamerbotToolbox__arguments`)).length}</span> <span class="marked-box default">${Object.keys(loadDataFromStorage(`streamerbotToolbox__arguments`)).length === 1 ? `Argument` : `Arguments`}</span></p>
          <br>
          <p>You're currently trying to remove all your arguments. These arguments are currently saved locally, so next time you open this website it will still exist. If you clear these, these will be permantly be removed.</p>
          `, `Are you sure?`, null, `submit`, {
            submitTitle: `Clear`,
            props: {
              "--i-modal-theme": `#fa2d2d`,
              "--i-modal-theme-alt": `#ff5b5b`
            },
            overlayProps: {
              "--i-overlay-color-hsl": `0 100% 40%`,
              "--i-overlay-color-opacity": `0.5`
            }
          })

          Modal__ClearArguments.onSubmit = () => {
            clearArgumentsTable()
          }
        })
  
        function reloadArgumentsTable() {
          let argumentsTable = document.querySelector(`main aside .card.arguments table`)
          let argumentsData = Object.entries(loadDataFromStorage(`streamerbotToolbox__arguments`))
  
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
            let argumentsTable = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.arguments table`)
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
            let argumentsTable = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.arguments table`)
            let argumentsData = []
            argumentsTable.querySelectorAll(`tr`).forEach(tableRow => {
              if (
                tableRow.querySelector(`td:first-child`).innerText != `` &&
                tableRow.querySelector(`td:last-child`).innerText != ``
              ) {
                argumentsData.push([
                  tableRow.querySelector(`td:first-child`).innerText.replaceAll(`<br>`, ``),
                  tableRow.querySelector(`td:last-child`).innerText.replaceAll(`<br>`, ``)
                ])
              }
            });
  
            localStorage.setItem(`streamerbotToolbox__arguments`, JSON.stringify(Object.fromEntries(argumentsData)))
          }, 50);
        }
  
        function clearArgumentsTable() {
          let argumentsTable = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.arguments table`)
          localStorage.setItem(`streamerbotToolbox__arguments`, JSON.stringify({}))
  
          argumentsTable.innerHTML = `
          <tbody>
            <tr>
              <td contenteditable="true"></td>
              <td contenteditable="true"></td>
            </tr>
          </tbody>`
  
          reloadArgumentsTable()
        }
  
        // End Arguments
      }

      if (data?.id === `GetActions`) {
        document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Actions`)}"]`).innerHTML = ``
        document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] > .card-grid`).innerHTML = ``

        let uniqueGroups = []
        
        data.actions.forEach(action => {
          if (!uniqueGroups.includes(action.group) && action.group != "") {
            uniqueGroups.push(action.group)
          }
        })

        uniqueGroups = uniqueGroups.sort()
        uniqueGroups.unshift("None")
        uniqueGroups.unshift("View All")
        
        uniqueGroups.forEach(group => {
          let actionCount = 0
          data.actions.forEach(action => {
            if (action.group === ``) action.group = `None`
            if (group === action.group || group === `View All`) {
              actionCount++
            }
          })

          let navbar__listItem = document.createElement(`li`)
          navbar__listItem.className = `navbar-list-item`
          document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Actions`)}"]`).append(navbar__listItem)
          
          let navbar__listItem__button = document.createElement(`button`)
          navbar__listItem.append(navbar__listItem__button)
          
          let navbar__listItem__button__title = document.createElement(`p`)
          navbar__listItem__button__title.className = `title`
          navbar__listItem__button__title.innerText = group
          navbar__listItem__button.append(navbar__listItem__button__title)
          
          let navbar__listItem__button__description = document.createElement(`p`)
          navbar__listItem__button__description.className = `description`
          navbar__listItem__button__description.innerText = `${actionCount} ${actionCount === 1 ? `Action` : `Actions`}`
          navbar__listItem__button.append(navbar__listItem__button__description)
          
          navbar__listItem__button.addEventListener(`click`, function () {
            document.querySelectorAll(`main .main[data-page="${urlSafe(`Actions`)}"] > .card-grid`).forEach(cardGrid => {
              cardGrid.remove()
            });

            navbar__listItem.classList.add(`nav-active`)

            document.querySelectorAll(`nav.navbar ul.navbar-list .nav-active`).forEach(listItem => {
              listItem.classList.remove(`nav-active`)
            })

            navbar__listItem.classList.add(`nav-active`)

            if (group === "") group = `None`
            document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"]`).insertAdjacentHTML(`afterbegin`, `
            <div class="card-grid">
              <div class="card">
                <div class="card-header">
                  <p class="card-title">${group}, ${actionCount} ${actionCount === 1 ? `Action` : `Actions`}</p>
                </div>
                <hr>
                <ul class="styled"></ul>
              </div>
            </div>
            `)

            let usedActionGroups = []
            if (group === `View All`) {
              uniqueGroups.forEach(uniqueGroup => {             
                data.actions.forEach(action => {
                  if (!usedActionGroups.includes(action.group) && uniqueGroup === action.group && uniqueGroup != `View All`) {
                    usedActionGroups.push(action.group)
                    document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] > .card-grid .card ul.styled`).insertAdjacentHTML(`beforeend`, `
                    <li class=title>
                      <button disabled>
                        <p class="title">${action.group}</p>
                      </button>
                    </li>
                    `)

                    data.actions.forEach(action => {
                      if (uniqueGroup === action.group) {
                        addActionToUi(action)
                      }
                    })

                  }
                })
              });
            } else {
              data.actions.forEach(action => addActionToUi(action))
            }

            function addActionToUi(action) {
              if (action.group === group || group === `View All`) {
                let listItem = document.createElement(`li`)
                document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] > .card-grid .card ul.styled`).append(listItem)

                let listItem__button = document.createElement(`button`)

                let listItem__button__title = document.createElement(`p`)
                listItem__button__title.innerText = action.name
                listItem__button__title.className = `title`

                listItem__button.append(listItem__button__title)
                listItem.append(listItem__button)

                listItem__appendDiv = document.createElement(`div`)
                listItem__appendDiv.classList.add(`append`)
                listItem__appendDiv.classList.add(`form-group`)
                listItem__appendDiv.classList.add(`styled`)
                listItem__appendDiv.classList.add(`no-margin`)
                listItem.append(listItem__appendDiv)
                
                let listItem__appendDiv__button = document.createElement(`button`)
                listItem__appendDiv__button.classList.add(`primary`)
                listItem__appendDiv__button.classList.add(`dense`)
                listItem__appendDiv__button.title = `Execute Action`
                listItem__appendDiv__button.innerText = `Execute`
                if (!action.enabled) listItem__appendDiv__button.setAttribute(`disabled`, ``)
                if (!action.enabled) listItem__appendDiv__button.title = `Disabled Action`
                listItem__appendDiv.append(listItem__appendDiv__button)
                listItem__appendDiv__button.addEventListener(`click`, RunActionFromActionsPage)
                
                let listItem__appendDiv__button__args = document.createElement(`button`)
                listItem__appendDiv__button__args.classList.add(`primary`)
                listItem__appendDiv__button__args.classList.add(`dense`)
                listItem__appendDiv__button__args.title = `Execute Action with Arguments`
                listItem__appendDiv__button__args.innerText = `+ Args`
                if (!action.enabled) listItem__appendDiv__button__args.setAttribute(`disabled`, ``)
                if (!action.enabled) listItem__appendDiv__button__args.title = `Disabled Action`
                listItem__appendDiv.append(listItem__appendDiv__button__args)
                listItem__appendDiv__button__args.addEventListener(`click`, RunActionFromActionsPageWithArguments)

                listItem__button.addEventListener(`click`, function () {
                  const Modal__InspectAction = createModal(`
                  <ul class="buttons-row list-items tonal">
                    <li>${action.subaction_count} ${action.subaction_count === 1 ? `Sub-Action` : `Sub-Actions`}</li>
                    <li>${action.enabled ? `Enabled` : `Disabled`}</li>
                  </ul>
                  <br>
                  <table class="styled">
                    <tr>
                      <td style="text-align: right;">Name</td>
                      <td style="text-align: left;">${action.name}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right;">Id</td>
                      <td style="text-align: left;">${action.id}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right;">Group</td>
                      <td style="text-align: left;">${action.group}</td>
                    </tr>
                  </table>
                  `, `Inspect Action`, `${action.name} • ${action.id}`, `small`, {
                    footerButtons: [
                      {
                          name: `Cancel`,
                          id: `cancel`,
                          type: `plain`,
                          closeModal: true
                      },
                      {
                          name: `Execute`,
                          id: `execute`,
                          type: `theme`,
                          disabled: !action.enabled
                      },
                      {
                          name: `+ Args`,
                          id: `execute-with-arguments`,
                          type: `theme`,
                          disabled: !action.enabled
                      }
                    ]
                  })

                  Modal__InspectAction.onFooterButtonPress = (id) => {
                    if (id === `execute`) {
                      RunActionFromActionsPage()
                    } else if (id === `execute-with-arguments`) {
                      RunActionFromActionsPageWithArguments()
                    }
                  }
                })

                function RunActionFromActionsPageWithArguments() {
                  const Modal__RunActionWithArguments = createModal(`
                  <table class="styled full">
                    <tbody>
                      <tr>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                      </tr>
                    </tbody>
                  </table>
                  `, `Execute Action with Arguments`, `${action.name} • ${action.id}`, `medium`, {
                    persisted: true,
                    footerButtons: [
                      {
                          name: `Cancel`,
                          id: `cancel`,
                          type: `plain`,
                          closeModal: true
                      },
                      {
                          name: `Execute`,
                          id: `execute`,
                          type: `theme`,
                          disabled: !action.enabled
                      }
                    ]
                  })

                  const table = Modal__RunActionWithArguments.main.querySelector(`table`)
                  const tbody = table.querySelector(`tbody`)

                  updateRunActionWithArgumentsTable()
                  tbody.addEventListener(`keydown`, () => {
                    setTimeout(() => {
                      updateRunActionWithArgumentsTable()
                    })
                  })

                  function updateRunActionWithArgumentsTable() {
                    tbody.querySelectorAll(`tr:not(:first-child)`).forEach((tr, index, array) => {
                      let td = [
                        tr.querySelector(`td:first-child`),
                        tr.querySelector(`td:last-child`)
                      ]

                      if (index != array.length - 1) {
                        if (td[0].innerText === `` && td[1].innerText === ``) {
                          tr.remove()
                        }
                      }
                    });

                    let trLastChild = tbody.querySelector(`tr:last-child`)
                    let trLastChild__td = [
                      trLastChild.querySelector(`td:first-child`),
                      trLastChild.querySelector(`td:last-child`)
                    ]

                    if (trLastChild__td[0].innerText != `` && trLastChild__td[1].innerText != ``) {
                      trLastChild.insertAdjacentHTML(`afterend`, `
                      <tr>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                      </tr>
                      `)
                    }
                  }

                  Modal__RunActionWithArguments.onFooterButtonPress = (id) => {
                    if (id === `execute`) {
                      let arguments = []
                      tbody.querySelectorAll(`tr`).forEach(tr => {
                        let td = [
                          tr.querySelector(`td:first-child`),
                          tr.querySelector(`td:last-child`)
                        ]

                        if (td[0].innerText != `` && td[1].innerText != ``) {
                          arguments.push([td[0].innerText, td[1].innerText])
                        }
                      });

                      RunActionFromActionsPage(Object.fromEntries(arguments))
                    }
                  }
                }
                
                function RunActionFromActionsPage(arguments = {}) {
                  arguments = Object.entries(arguments)

                  arguments.push([`source`, `StreamerbotToolbox`])

                  let argumentsLocalStorage = Object.entries(JSON.parse(localStorage.getItem(`streamerbotToolbox__arguments`) || `{}`) ?? {}) ?? []
                  argumentsLocalStorage.forEach(argument => {
                    arguments.push([argument[0], argument[1]])
                  });
                  
                  arguments = Object.fromEntries(arguments)
                  
                  SB__RunActionById(action.id, arguments, `{"request":"DoAction","id":"DoAction","action":${JSON.stringify(action)}}`)
                }
              }
            }
          })
        })
      }

      if (data?.event?.source === `Application`) {
        if (data?.event?.type === `ActionAdded` || data?.event?.type === `ActionDeleted` || data?.event?.type === `ActionUpdated`) {
          SB__GetActions(`GetActions`)
        }
      }

      if (data?.event?.source === `Raw` && data?.event?.type === `Action`) {
        if (data.data.name != streamerbotActionPackage__name) {
          let actionHistoryQueued__List = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history ul`)
          
          let actionHistoryQueued__ListItem = document.createElement(`li`)
          actionHistoryQueued__ListItem.setAttribute(`hidden`, ``)
          actionHistoryQueued__ListItem.setAttribute(`data-action-running-id`, data.data.id)
          actionHistoryQueued__ListItem.setAttribute(`data-action-id`, data.data.actionId)
          actionHistoryQueued__ListItem.setAttribute(`data-action-queued-data`, JSON.stringify(data))
          actionHistoryQueued__ListItem.setAttribute(`data-action-state`, `queued`)
          actionHistoryQueued__List.prepend(actionHistoryQueued__ListItem)
          
          let actionHistoryQueued__Button = document.createElement(`button`)
          actionHistoryQueued__ListItem.append(actionHistoryQueued__Button)
          
          let actionHistoryQueued__Title = document.createElement(`p`)
          actionHistoryQueued__Title.classList.add(`title`)
          actionHistoryQueued__Title.innerHTML = data.data.name
          actionHistoryQueued__Button.append(actionHistoryQueued__Title)

          updateActionHistorySearch()

          function updateActionHistorySearch() {
            setTimeout(() => {
              let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history input[type="search"]`).value.toLowerCase()
              document.querySelectorAll(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card.action-history ul.styled li`).forEach(listItem => {
                let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
                if (listItemTitle.includes(searchTerm)) {
                  listItem.setAttribute(`hidden`, ``)
                  listItem.removeAttribute(`hidden`)
                } else {
                  listItem.setAttribute(`hidden`, ``)
                }
              });
            });
          }
          
          actionHistoryQueued__Button.addEventListener(`click`, () => {
            let actionHistoryQueued__table = ``
            let actionHistoryQueued__arguments = actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)
            actionHistoryQueued__arguments = JSON.parse(actionHistoryQueued__arguments) ?? {}
            actionHistoryQueued__arguments = actionHistoryQueued__arguments?.data?.arguments ?? {}
  
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
                  <td style="text-align: left;">${typeof argument[1] != `object` ? argument[1] : `<pre><code>${formatJson(argument[1]).html}</code></pre>`}</td>
                </tr>
                `
              });
  
              actionHistoryQueued__table += `
                </tbody>
              </table>
              `
            }
  
            const Modal__ActionHistory = createModal(`
            <h3>Arguments</h3>
            <br>
            ${actionHistoryQueued__table}
            `, `${data.data.name}<small>${SB__FormatTimestamp(data.data.arguments.actionQueuedAt, `small`)}</small>`, data.data.actionId, `medium`, {
              footerButtons: [
                {
                    name: `Close`,
                    id: `close`,
                    type: `plain`,
                    closeModal: true
                },
                {
                    name: `Re-run`,
                    id: `rerun`,
                    type: `theme`
                }
              ],
              footerType: `elevated`
            })

            Modal__ActionHistory.onFooterButtonPress = (id) => {
              if (id === `rerun`) {
                let arguments = []
                Modal__ActionHistory.main.querySelectorAll(`table:not([hidden]) tbody tr`).forEach(tableRow => {
                  arguments.push([
                    tableRow.querySelector(`td:first-child`).innerText,
                    tableRow.querySelector(`td:last-child`).innerText
                  ])
                });
                arguments = Object.fromEntries(arguments)
                SB__RunActionById(data.data.actionId, arguments)
              }
            }
  
            let copyButtons__List = document.createElement(`ul`)
            copyButtons__List.className = `buttons-row`
            copyButtons__List.style.paddingBottom = `1rem`

            let copyButtons__List__copyForDiscord = document.createElement(`li`)
            let copyButtons__List__copyAsJson = document.createElement(`li`)
            let copyButtons__List__copyForWiki = document.createElement(`li`)
            
            let copyButtons__List__copyForDiscord__button = document.createElement(`button`)
            copyButtons__List__copyForDiscord__button.innerHTML = `Copy for Discord`
            copyButtons__List__copyForDiscord__button.className = `active-state mdi mdi-forum`
            copyButtons__List__copyForDiscord.append(copyButtons__List__copyForDiscord__button)
            copyButtons__List.append(copyButtons__List__copyForDiscord)
            
            let copyButtons__List__copyAsJson__button = document.createElement(`button`)
            copyButtons__List__copyAsJson__button.innerHTML = `Copy as JSON`
            copyButtons__List__copyAsJson__button.className = `active-state mdi mdi-code-json`
            copyButtons__List__copyAsJson.append(copyButtons__List__copyAsJson__button)
            copyButtons__List.append(copyButtons__List__copyAsJson)

            let copyButtons__List__copyForWiki__button = document.createElement(`button`)
            copyButtons__List__copyForWiki__button.innerHTML = `Copy for Wiki`
            copyButtons__List__copyForWiki__button.className = `active-state mdi mdi-wikipedia`
            copyButtons__List__copyForWiki.append(copyButtons__List__copyForWiki__button)
            copyButtons__List.append(copyButtons__List__copyForWiki)


            copyButtons__List__copyForDiscord__button.addEventListener(`click`, () => {
              createSnackbar(`Copying variables for Discord to clipboard`)
              if (Modal__ActionHistory.main.querySelector(`table#completed`) != null) {
                if (Modal__ActionHistory.main.querySelector(`table#completed`).getAttribute(`hidden`) === null) {
                  copyArgumentsForDiscord(`completed`)
                } else {
                  copyArgumentsForDiscord(`queued`)
                }
              } else {
                copyArgumentsForDiscord(`queued`)
              }
              
              function copyArgumentsForDiscord(state) {
                if (state === `queued`) {
                  let discord = copyArgumentsForDiscordFormatter(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)).data.arguments)
                  navigator.clipboard.writeText(discord)
                } else if (state === `completed`) {
                  let discord = copyArgumentsForDiscordFormatter(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-completed-data`)).data.arguments)
                  navigator.clipboard.writeText(discord)
                }
              }

              function copyArgumentsForDiscordFormatter(json) {
                let formatted = "```yaml\n"
                Object.entries(json).forEach(argument => {
                  formatted += `${argument[0]}: ${argument[1]}\n`
                });
                formatted += "```"
                return formatted
              }
            })

            copyButtons__List__copyForWiki__button.addEventListener(`click`, () => {
              createSnackbar(`Copying variables for the Streamer.bot Wiki to clipboard`)
              if (Modal__ActionHistory.main.querySelector(`table#completed`) != null) {
                if (Modal__ActionHistory.main.querySelector(`table#completed`).getAttribute(`hidden`) === null) {
                  copyArgumentsForWiki(`completed`)
                } else {
                  copyArgumentsForWiki(`queued`)
                }
              } else {
                copyArgumentsForWiki(`queued`)
              }
              
              function copyArgumentsForWiki(state) {
                if (state === `queued`) {
                  let table = copyArgumentsForWikiFormatter(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)).data.arguments)
                  navigator.clipboard.writeText(table)
                } else if (state === `completed`) {
                  let table = copyArgumentsForWikiFormatter(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-completed-data`)).data.arguments)
                  navigator.clipboard.writeText(table)
                }
              }

              function copyArgumentsForWikiFormatter(json) {
                let formatted = `Name | Description\n----:|:------------\n`
                Object.entries(json).forEach(argument => {
                  formatted += `\`${argument[0]}\` | ${argument[1]}\n`
                });
                return formatted
              }
            })

            copyButtons__List__copyAsJson__button.addEventListener(`click`, () => {
              createSnackbar(`Copying variables as JSON to clipboard`)
              if (Modal__ActionHistory.main.querySelector(`table#completed`) != null) {
                if (Modal__ActionHistory.main.querySelector(`table#completed`).getAttribute(`hidden`) === null) {
                  copyArgumentsForJson(`completed`)
                } else {
                  copyArgumentsForJson(`queued`)
                }
              } else {
                copyArgumentsForJson(`queued`)
              }
              
              function copyArgumentsForJson(state) {
                if (state === `queued`) {
                  console.log(`Copying:`, formatJson(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)).data.arguments).json)
                  navigator.clipboard.writeText(formatJson(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-queued-data`)).data.arguments).json)
                } else if (state === `completed`) {
                  console.log(`Copying:`, formatJson(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-completed-data`)).data.arguments).json)
                  navigator.clipboard.writeText(formatJson(JSON.parse(actionHistoryQueued__ListItem.getAttribute(`data-action-completed-data`)).data.arguments).json)
                }
              }
            })

            Modal__ActionHistory.main.prepend(copyButtons__List)

            if (actionHistoryQueued__ListItem.getAttribute(`data-action-state`) === `completed`) {
              let actionHistoryCompletedDialog__List = document.createElement(`ul`)
              actionHistoryCompletedDialog__List.className = `buttons-row`
              Modal__ActionHistory.main.prepend(actionHistoryCompletedDialog__List)
  
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
                  Modal__ActionHistory.main.querySelector(`table#completed`).setAttribute(`hidden`, ``)
                  Modal__ActionHistory.main.querySelector(`table#completed`).removeAttribute(`hidden`)
                  
                  Modal__ActionHistory.main.querySelector(`table#queued`).setAttribute(`hidden`, ``)
  
                } else if (actionHistoryCompletedDialog__QueuedListItem.classList.contains(`button-active`)) {
                  Modal__ActionHistory.main.querySelector(`table#queued`).setAttribute(`hidden`, ``)
                  Modal__ActionHistory.main.querySelector(`table#queued`).removeAttribute(`hidden`)
                  
                  Modal__ActionHistory.main.querySelector(`table#completed`).setAttribute(`hidden`, ``)
  
                }
              }
            }
          })
        }
      }

      if (data?.event?.source === `Raw` && data?.event?.type === `ActionCompleted`) {
        if (data.data.name != streamerbotActionPackage__name) {
          let actionHistoryCompleted__ListItem = document.querySelector(`main .main[data-page="${urlSafe(`Actions`)}"] aside .card-grid .card.action-history ul li[data-action-running-id="${data.data.id}"]`)
          actionHistoryCompleted__ListItem.setAttribute(`data-action-completed-data`, JSON.stringify(data))
          actionHistoryCompleted__ListItem.setAttribute(`data-action-state`, `completed`)
          actionHistoryCompleted__ListItem.setAttribute(`data-exclusion`, data.data.excludeFromHistory)
        }
      }

      /***
      ************************************
      ************************************
      ************************************
      ********* Websocket Events *********
      ************************************
      ************************************
      ************************************
      ***/

      if (data?.id === `GetEvents`) {
        document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"]`).classList.add(`col-2`)
        document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"]`).innerHTML = `
        <div class="card-grid" id="events"></div>
        <aside>
          <div class="card-grid">
            <div class="card" id="event-history">
              <div class="card-header">
                <p class="card-title">Event History</p>
                <div class="form-group styled no-margin no-padding dense card-header-append">
                  <button class="outlined no-margin no-padding dense">Settings</button>
                </div>
              </div>
              <hr>
              <div class="form-group styled no-margin">
                <input type="search" placeholder="Search...">
              </div>
              <ul class="styled"></ul>           
            </div>
          </div>
        </aside>`

        document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history .card-header .card-header-append button`).addEventListener(`click`, () => {
          const Modal__EventHistorySettings = createModal(`
          
          `, `Event History Settings`, undefined, `medium`)

          let EventHistorySettings__ExcludeObs = ICreateCheckbox(`Exclude OBS Events`, {checked: loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeObsStudio})
          Modal__EventHistorySettings.main.append(EventHistorySettings__ExcludeObs.element)

          EventHistorySettings__ExcludeObs.onStateChange = (state) => {
            if (state) {
              saveKeyToStorage(`streamerbotToolbox__eventHistory`, {excludeObsStudio: true})
            } else {
              saveKeyToStorage(`streamerbotToolbox__eventHistory`, {excludeObsStudio: false})
            }
          }

          let EventHistorySettings__ExcludeActions = ICreateCheckbox(`Exclude Actions`, {checked: loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeActions})
          Modal__EventHistorySettings.main.append(EventHistorySettings__ExcludeActions.element)

          EventHistorySettings__ExcludeActions.onStateChange = (state) => {
            if (state) {
              saveKeyToStorage(`streamerbotToolbox__eventHistory`, {excludeActions: true})
            } else {
              saveKeyToStorage(`streamerbotToolbox__eventHistory`, {excludeActions: false})
            }
          }

          let EventHistorySettings__Spacing = document.createElement(`br`)
          Modal__EventHistorySettings.main.append(EventHistorySettings__Spacing)

          let EventHistorySettings__Note = document.createElement(`p`)
          Modal__EventHistorySettings.main.append(EventHistorySettings__Note)
          EventHistorySettings__Note.innerText = `These events above can be viewed from seperate tabs.`
        })

        document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history input[type="search"]`).addEventListener(`keydown`, updateEventHistorySearch)
        updateEventHistorySearch()

        function updateEventHistorySearch() {
          setTimeout(() => {
            let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history input[type="search"]`).value.toLowerCase()
            document.querySelectorAll(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history ul.styled li`).forEach(listItem => {
              let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
              let listItemDescription = listItem.querySelector(`p.description`).innerText.toLowerCase()
  
              if (listItemTitle.includes(searchTerm) || listItemDescription.includes(searchTerm)) {
                listItem.setAttribute(`hidden`, ``)
                listItem.removeAttribute(`hidden`)
              } else {
                listItem.setAttribute(`hidden`, ``)
              }
            });
          });
        }

        let eventsEntries = Object.entries(data.events)
        eventsEntries.sort()

        let eventsEntriesAll = []
        eventsEntries.forEach(events => {
          events[1].forEach(event => {
            eventsEntriesAll.push([events[0], event])
          });
        });

        eventsEntries.unshift([`View All`, eventsEntriesAll])

        eventsEntries.forEach(events => {
          let navbar__listItem = document.createElement(`li`)
          navbar__listItem.className = `navbar-list-item`

          let navbar__listItem__button = document.createElement(`button`)
          navbar__listItem.append(navbar__listItem__button)

          let navbar__listItem__button__title = document.createElement(`p`)
          navbar__listItem__button__title.className = `title`
          navbar__listItem__button__title.innerText = events[0]
          navbar__listItem__button.append(navbar__listItem__button__title)
          
          let navbar__listItem__button__description = document.createElement(`p`)
          navbar__listItem__button__description.className = `description`
          navbar__listItem__button__description.innerText = `${events[1].length} ${events[1].length === 1 ? `Event` : `Events`}`
          navbar__listItem__button.append(navbar__listItem__button__description)

          document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Websocket Events`)}"]`).append(navbar__listItem)

          navbar__listItem__button.addEventListener(`click`, () => {
            navbar__listItem.classList.add(`nav-active`)
            
            document.querySelectorAll(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Websocket Events`)}"] li.nav-active`).forEach(listItem => {
              listItem.classList.remove(`nav-active`)
            });

            navbar__listItem.classList.add(`nav-active`)

            document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] .card-grid#events`).innerHTML = `
            <div class="card">
              <div class="card-header">
                <p class="card-title">${events[0]}, ${events[1].length} ${events[1].length === 1 ? `Event` : `Events`}</p>
              </div>
              <hr>
              <ul class="styled"></ul>
            </div>
            `

            events[1].sort()

            if (navbar__listItem__button__title.innerText != `View All`) {
              events[1].forEach(event => {
                document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] .card-grid#events .card ul`).insertAdjacentHTML(`beforeend`, `
                <li>
                  <button disabled>
                    <p class="title">
                      ${event}
                    </p>
                  </button>
                </li>
                `)
              });
            } else {
              let eventGroups = []

              events[1].forEach(event => {
                if (!eventGroups.includes(event[0])) {
                  eventGroups.push(event[0])
                  document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] .card-grid#events .card ul`).insertAdjacentHTML(`beforeend`, `
                  <li class="title">
                    <button disabled>
                      <p class="title">
                        ${event[0]}
                      </p>
                    </button>
                  </li>
                  `)
                }

                document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] .card-grid#events .card ul`).insertAdjacentHTML(`beforeend`, `
                <li>
                  <button disabled>
                    <p class="title">
                      ${event[1]}
                    </p>
                  </button>
                </li>
                `)
              });
            }
          })
        });
      }

      if (data?.id === undefined && data?.event?.source != null && data?.event?.type != null && data?.data?.name != streamerbotActionPackage__name && data?.data?.parentName != streamerbotActionPackage__name) {
        if (data?.event?.source === `Obs` && data?.event?.type === `Event` && loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeObsStudio === true) return
        if (data?.event?.source === `Raw` && data?.event?.type === `Action` && loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeActions === true) return
        if (data?.event?.source === `Raw` && data?.event?.type === `SubAction` && loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeActions === true) return
        if (data?.event?.source === `Raw` && data?.event?.type === `ActionCompleted` && loadDataFromStorage(`streamerbotToolbox__eventHistory`)?.excludeActions === true) return

        let eventHistory__listItem = document.createElement(`li`)
        eventHistory__listItem.setAttribute(`hidden`, ``)
        document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] .card-grid .card#event-history ul`).prepend(eventHistory__listItem)

        let eventHistory__listItem__button = document.createElement(`button`)
        eventHistory__listItem.append(eventHistory__listItem__button)

        let eventHistory__listItem__button__title = document.createElement(`p`)
        eventHistory__listItem__button__title.className = `title`
        eventHistory__listItem__button__title.innerText = data.event.type
        eventHistory__listItem__button.append(eventHistory__listItem__button__title)

        let eventHistory__listItem__button__description = document.createElement(`p`)
        eventHistory__listItem__button__description.className = `description`
        eventHistory__listItem__button__description.innerText = `${data.event.source} • ${SB__FormatTimestamp(data.timeStamp, `small`)}`
        eventHistory__listItem__button.append(eventHistory__listItem__button__description)

        updateEventHistorySearch()

        function updateEventHistorySearch() {
          setTimeout(() => {
            let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history input[type="search"]`).value.toLowerCase()
            document.querySelectorAll(`main .main[data-page="${urlSafe(`Websocket Events`)}"] aside .card-grid .card#event-history ul.styled li`).forEach(listItem => {
              let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
              let listItemDescription = listItem.querySelector(`p.description`).innerText.toLowerCase()
  
              if (listItemTitle.includes(searchTerm) || listItemDescription.includes(searchTerm)) {
                listItem.setAttribute(`hidden`, ``)
                listItem.removeAttribute(`hidden`)
              } else {
                listItem.setAttribute(`hidden`, ``)
              }
            });
          });
        }

        eventHistory__listItem__button.addEventListener(`click`, () => {
          createModal(`
          <div class="buttons-row">
            <button class="active-state mdi mdi-code-json" id="copy-as-json-button">Copy as JSON</button>
          </div>
          <br>
          <pre><code>${formatJson(data.data).html}</code></pre>
          `, data.event.type, `${data.event.source} • ${SB__FormatTimestamp(data.timeStamp, `small`)}`, `medium`, {})

          document.getElementById(`copy-as-json-button`).addEventListener(`click`, () => {
            createSnackbar(`Copying websocket data as JSON to clipboard`)
            navigator.clipboard.writeText(formatJson(data.data).json)
          })
        })
      }

      /***
      ************************************
      ************************************
      ************************************
      ********* Global Variables *********
      ************************************
      ************************************
      ************************************
      ***/

      if (data?.id === `WebsocketHandlerAction`) {
        document.querySelector(`main .main[data-page="${urlSafe(`Global Variables`)}"]`).classList.add(`full`)

        document.querySelector(`main .main[data-page="${urlSafe(`Global Variables`)}"]`).innerHTML = `
        <div class="card-grid">
          <div class="card">
            <div class="card-header">                
              <p class="card-title">Get Global Variable</p>
            </div>
            <hr>
            <div class="form-group styled">
              <label for="get-global-variable--variable-name">Variable Name</label>
              <input type="text" name="voice-alias" id="get-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"variable": ""}`).variable ?? ``}">
            </div>
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
              <input type="text" id="set-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"variable": ""}`).variable ?? ``}">
            </div>
            <div class="form-group styled">
              <label for="set-global-variable--value">Value</label>
              <input type="text" id="set-global-variable--value" placeholder="Value" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"value": ""}`).value ?? ``}">
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
              <input type="text" id="unset-global-variable--variable-name" placeholder="Variable Name" value="${JSON.parse(localStorage.getItem(`streamerbotToolbox__globalVariables`) || `{"variable": ""}`).variable ?? ``}">
            </div>
            <div class="form-group styled">
              <button class="styled" id="unset-global-variable--submit">Run</button>
            </div>
          </div>
        </div>

        <br>

        <div class="card-grid">
          <div class="card">
            <p id="global-variable--output"><b>Output:</b> <span class="output"></span></p>
          </div>
        </div>
        `

        SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, document.getElementById(`set-global-variable--variable-name`).value)

        document.getElementById(`get-global-variable--variable-name`).addEventListener(`keydown`, () => {
          setTimeout(() => {
            let wsDataGlobalVariableName = document.getElementById(`get-global-variable--variable-name`).value
            document.getElementById(`set-global-variable--variable-name`).value = wsDataGlobalVariableName
            document.getElementById(`unset-global-variable--variable-name`).value = wsDataGlobalVariableName
            SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
            updateVariableGlobalVariablesStorage()
          });
        })

        document.getElementById(`set-global-variable--variable-name`).addEventListener(`keydown`, () => {
          setTimeout(() => {
            let wsDataGlobalVariableName = document.getElementById(`set-global-variable--variable-name`).value
            document.getElementById(`get-global-variable--variable-name`).value = wsDataGlobalVariableName
            document.getElementById(`unset-global-variable--variable-name`).value = wsDataGlobalVariableName
            SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
            updateVariableGlobalVariablesStorage()
          });
        })

        document.getElementById(`unset-global-variable--variable-name`).addEventListener(`keydown`, () => {
          setTimeout(() => {
            let wsDataGlobalVariableName = document.getElementById(`unset-global-variable--variable-name`).value
            document.getElementById(`set-global-variable--variable-name`).value = wsDataGlobalVariableName
            document.getElementById(`get-global-variable--variable-name`).value = wsDataGlobalVariableName
            SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
            updateVariableGlobalVariablesStorage()
          });
        })

        document.getElementById(`set-global-variable--value`).addEventListener(`keydown`, () => {
          setTimeout(() => {
            updateValueGlobalVariablesStorage()
          });
        })


        function updateVariableGlobalVariablesStorage() {
          let wsDataGlobalVariableName = document.getElementById(`set-global-variable--variable-name`).value
          saveKeyToStorage(`streamerbotToolbox__globalVariables`, {variable: wsDataGlobalVariableName})
        }
        
        function updateValueGlobalVariablesStorage() {
          let wsDataGlobalVariableValue = document.getElementById(`set-global-variable--value`).value
          saveKeyToStorage(`streamerbotToolbox__globalVariables`, {variable: wsDataGlobalVariableValue})
        }

        document.getElementById(`set-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`set-global-variable--variable-name`).value
          let wsDataGlobalVariableValue = document.getElementById(`set-global-variable--value`).value

          SB__StreamerbotActionPackageRequest(`SetGlobalVariable`, {
            wsDataName: wsDataGlobalVariableName,
            wsDataValue: wsDataGlobalVariableValue
          })

          SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
        })

        document.getElementById(`unset-global-variable--submit`).addEventListener(`click`, () => {
          let wsDataGlobalVariableName = document.getElementById(`unset-global-variable--variable-name`).value

          SB__StreamerbotActionPackageRequest(`UnsetGlobalVariable`, wsDataGlobalVariableName)
          SB__StreamerbotActionPackageRequest(`GetGlobalVariable`, wsDataGlobalVariableName)
        })
      }

      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsSource === `StreamerbotTool`) {
        if (data.data.wsRequest === `GetGlobalVariable`) {
          if (data.data.wsData === ``) data.data.wsData = `Global Variable Doesn't Exist or it doesn't have a value`
          document.querySelector(`#global-variable--output .output`).innerHTML = data.data.wsData
        }
      }

      /***
      ****************************
      ****************************
      ****************************
      ********* Commands *********
      ****************************
      ****************************
      ****************************
      ***/

      if (data?.id === `WebsocketHandlerAction`) {
        SB__StreamerbotActionPackageRequest(`GetCommandsFromFile`)
      }

      if (data?.event?.source === `None` && data?.event?.type === `Custom`) {
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
              document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Commands`)}"]`).insertAdjacentHTML(`beforeend`, `
              <li class="navbar-list-item" data-command-name="${command[0]}" data-command-count="${command[1]}">
                <button>
                  <p class="title">${command[0]}</p>
                  <p class="description">${commandsText}</p>
                </button>
              </li>
              `)
            });

            document.querySelectorAll(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Commands`)}"] li`).forEach(listItem => {
              listItem.querySelector(`button`).addEventListener(`click`, function () {
                listItem.classList.add(`nav-active`)
                
                document.querySelectorAll(`nav.navbar ul.navbar-list[data-page="${urlSafe(`Commands`)}"] li.nav-active`).forEach(listItem => {
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

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"]`).innerHTML = `
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

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.enabled-state .form-group #enable`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`EnableCommandById`, commandId)
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.enabled-state .form-group #disable`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`DisableCommandById`, commandId)
                })


                /// /////////////// ///
                /// Global Cooldown ///
                /// /////////////// ///

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #reset`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandResetGlobalCooldown`, commandId)
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #remove`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandRemoveGlobalCooldown`, commandId)
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #add`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandAddGlobalCooldown`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })
                
                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #update`).addEventListener(`click`, () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.global-cooldown .form-group #global-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandSetGlobalCooldown`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })

                /// ///////////// ///
                /// User Cooldown ///
                /// ///////////// ///

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #reset`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataUserId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  SB__StreamerbotActionPackageRequest(`CommandResetUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId
                  })
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #remove`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataUserId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  SB__StreamerbotActionPackageRequest(`CommandRemoveUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId
                  })
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #reset-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandResetAllUserCooldowns`, commandId)
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #remove-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value

                  SB__StreamerbotActionPackageRequest(`CommandRemoveAllUserCooldowns`, commandId)
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #add`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #user-cooldown`).value
                  let wsDataUserId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group input#user-name`).value || ``
                  if (wsDataUserId === ``) wsDataUserId = `ik1497`
                  wsDataUserId = await fetch(`https://decapi.me/twitch/id/${wsDataUserId}`)
                  wsDataUserId = await wsDataUserId.text()

                  SB__StreamerbotActionPackageRequest(`CommandAddUserCooldown`, {
                    wsDataId: commandId,
                    wsDataUserId: wsDataUserId,
                    wsDataDuration: wsDataDuration
                  })
                })

                document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #add-to-all`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #user-cooldown`).value

                  SB__StreamerbotActionPackageRequest(`CommandAddAllUserCooldowns`, {
                    wsDataId: commandId,
                    wsDataDuration: wsDataDuration
                  })
                })

                document.querySelector(`main .card-grid .card.user-cooldown .form-group #update`).addEventListener(`click`, async () => {
                  let commandId = document.querySelector(`main .command-information .form-group select`).value
                  let wsDataDuration = document.querySelector(`main .main[data-page="${urlSafe(`Commands`)}"] .card-grid .card.user-cooldown .form-group #user-cooldown`).value

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

      /***
      ******************************
      ******************************
      ******************************
      ********* OBS Studio *********
      ******************************
      ******************************
      ******************************
      ***/

      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsRequest === `ObsIsConnected`) {
        if (data.data.wsData === true) {
          let obsConnection = loadDataFromStorage(`streamerbotToolbox__obsStudio`)
          obsConnection = obsConnection.connection || 0
          document.body.setAttribute(`obs-connection-state`, `connected`)

          SB__StreamerbotActionPackageOBSRequest(`GetSceneList`, {}, obsConnection)
          SB__StreamerbotActionPackageOBSRequest(`GetVersion`, {}, obsConnection)

        } else {
          document.body.setAttribute(`obs-connection-state`, `disconnected`)
        }
      }
      
      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsRequest === `ObsSendRaw`) {
        obsData = data.data.wsData
        obsData = JSON.parse(obsData)
        if (data.data.requestType != undefined) console.log(`[OBS Websocket] Request ${data.data.requestType}:`, obsData)

        let obsConnection = JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`)) || {connection: 0}
        obsConnection = obsConnection.connection

        console.log(`Connected to OBS`)

        switch (data?.data?.requestType) {
          case `GetSceneList`:
            document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`OBS Studio`)}"]`).innerHTML = ``

            obsData.scenes = obsData.scenes.reverse()
            
            obsData.scenes.forEach(scene => {
              document.querySelector(`nav.navbar ul.navbar-list[data-page="${urlSafe(`OBS Studio`)}"]`).insertAdjacentHTML(`beforeend`, `
              <li class="navbar-list-item">
                <button>
                  <p class="title">${scene.sceneName}</p>
                </button>
              </li>
              `)  
            });

            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"]`).classList.add(`col-2`)
            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"]`).innerHTML = `
            <div class="card-grid">
              <div class="card sources">
              </div>
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
                <div class="card events">
                  <div class="card-header">
                    <p class="card-title">Events</p>
                    </div>
                    <hr>
                    <div class="form-group styled no-margin">
                      <input type="search" placeholder="Search...">
                    </div>
                    <ul class="styled"></ul>
                  </div>
                </div>
              </div>
            </aside>
            `

            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events input[type=search]`).addEventListener(`keydown`, updateObsEventsSearch)

            updateObsEventsSearch()

            function updateObsEventsSearch() {
              setTimeout(() => {
                let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events input[type=search]`).value.toLowerCase()

                document.querySelectorAll(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events ul.styled li`).forEach(listItem => {
                  let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
                  let listItemDescription = listItem.querySelector(`p.description`).innerText.toLowerCase()
  
                  if (listItemTitle.includes(searchTerm) || listItemDescription.includes(searchTerm)) {
                    listItem.setAttribute(`hidden`, ``)
                    listItem.removeAttribute(`hidden`)
                  } else {
                    listItem.setAttribute(`hidden`, ``)
                  }
                });
              });
            }

            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.settings .form-group #nav-switch-scenes`).onchange = () => {
              let streamerbotToolbox__obsStudio = localStorage.getItem(`streamerbotToolbox__obsStudio`) || `{}`
              streamerbotToolbox__obsStudio = JSON.parse(streamerbotToolbox__obsStudio) || {}
              streamerbotToolbox__obsStudio.navSwitchScenes = document.querySelector(`.card-grid .card.settings .form-group #nav-switch-scenes`).checked
              localStorage.setItem(`streamerbotToolbox__obsStudio`, JSON.stringify(streamerbotToolbox__obsStudio))
            }

            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.settings .form-group #scene-preview`).onclick = () => {
              SB__StreamerbotActionPackageOBSRequest(`GetCurrentProgramScene`, {}, obsConnection)
            }


            document.querySelectorAll(`nav.navbar ul.navbar-list[data-page="${urlSafe(`OBS Studio`)}"] li`).forEach(listItem => {
              listItem.querySelector(`button`).addEventListener(`click`, () => {
                listItem.classList.add(`nav-active`)
                
                document.querySelectorAll(`.nav-active`).forEach(navActiveListItem => {
                  navActiveListItem.classList.remove(`nav-active`)
                });

                listItem.classList.add(`nav-active`)

                document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.sources`).innerHTML = `
                <div class="card-header">
                  <p class="card-title">Sources</p>
                </div>
                <hr>
                <ul class="styled" data-scene="${listItem.querySelector(`p.title`).innerText}"></ul>
                `

                SB__StreamerbotActionPackageOBSRequest(`GetSceneItemList`, {sceneName: listItem.querySelector(`p.title`).innerText}, obsConnection)

                if (JSON.parse(localStorage.getItem(`streamerbotToolbox__obsStudio`) ?? `{"navSwitchScenes": true}`).navSwitchScenes) {      
                  SB__StreamerbotActionPackageOBSRequest(`SetCurrentProgramScene`, {sceneName: listItem.querySelector(`p.title`).innerText}, obsConnection)
                }
              })
            });

            break
          case `GetSceneItemList`:
            obsData.sceneItems = obsData.sceneItems.reverse()

            obsData.sceneItems.forEach(sceneItem => {
              document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.sources ul`).insertAdjacentHTML(`beforeend`, `
              <li data-source-information="${JSON.stringify(sceneItem).replace(/\s*\"\s*/gm, `'`)}">
                <button>${sceneItem.sourceName}</button>
                <div class="dropdown-section">
                  <button class="append mdi mdi-cog"></button>
                  <ul class="dropdown-list">
                    <li id="inspect-source-properties"><button><i class="mdi mdi-flip-to-back"></i> <span style="text-align: end;">Inspect Source Properties</span></button></li>
                    <li id="transform-settings"><button><i class="mdi mdi-flip-to-back"></i> <span style="text-align: end;">Transform Settings</span></button></li>
                  </ul>
                </div>
              </li>
              `)
            });

            document.querySelectorAll(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.sources > ul > li`).forEach(listItem => {
              let sourceData = listItem.getAttribute(`data-source-information`)
              sourceData = sourceData.replace(/\s*\'\s*/gm, `"`)
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
                let Modal__ObsStudioTransformSettings = createModal(`
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

                Modal__ObsStudioTransformSettings.main.querySelector(`.form-group button#update`).addEventListener(`click`, () => {
                  SB__StreamerbotActionPackageOBSRequest(`SetSceneItemTransform`, {
                    sceneName: document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.sources > ul`).getAttribute(`data-scene`),
                    sceneItemId: sourceData.sceneItemId,
                    sceneItemTransform: {
                      alignment: +Modal__ObsStudioTransformSettings.main.querySelector(`table #alignment`).value || 5,
                      boundsAlignment: +Modal__ObsStudioTransformSettings.main.querySelector(`table #bounds-alignment`).value || 0,
                      boundsWidth: +Modal__ObsStudioTransformSettings.main.querySelector(`. .main table #bounds-width`).value || 1,
                      boundsHeight: +Modal__ObsStudioTransformSettings.main.querySelector(`table #bounds-height`).value || 1,
                      boundsType: Modal__ObsStudioTransformSettings.main.querySelector(`table #bounds-type`).value || "OBS_BOUNDS_NONE",
                      cropTop: +Modal__ObsStudioTransformSettings.main.querySelector(`table #crop-top`).value || 0,
                      cropRight: +Modal__ObsStudioTransformSettings.main.querySelector(`table #crop-right`).value || 0,
                      cropBottom: +Modal__ObsStudioTransformSettings.main.querySelector(`table #crop-bottom`).value || 0,
                      cropLeft: +Modal__ObsStudioTransformSettings.main.querySelector(`table #crop-left`).value || 0,
                      width: +Modal__ObsStudioTransformSettings.main.querySelector(`table #width`).value || null,
                      height: +Modal__ObsStudioTransformSettings.main.querySelector(`table #height`).value || null,
                      positionX: +Modal__ObsStudioTransformSettings.main.querySelector(`table #position-x`).value || 0,
                      positionY: +Modal__ObsStudioTransformSettings.main.querySelector(`table #position-y`).value || 0,
                      rotation: +Modal__ObsStudioTransformSettings.main.querySelector(`table #rotation`).value || 0,
                      scaleX: +Modal__ObsStudioTransformSettings.main.querySelector(`table #scale-x`).value || null,
                      scaleY: +Modal__ObsStudioTransformSettings.main.querySelector(`table #scale-y`).value || null,
                      sourceHeight: +Modal__ObsStudioTransformSettings.main.querySelector(`table #source-height`).value || 0,
                      sourceWidth: +Modal__ObsStudioTransformSettings.main.querySelector(`table #source-width`).value || 0
                    }
                  }, obsConnection)
                })
              })
            });
            break
          case `GetVersion`:
            document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] aside .card-grid .card.settings`).insertAdjacentHTML(`afterend`, `
            <div class="card">
              <div class="card-header">
                <p class="card-title">Connection</p>
              </div>
              <hr>
              <div class="buttons-row list-items">
              <li>OBS Studio v${obsData.obsVersion}</;>
              <li>RPC v${obsData.rpcVersion}</li>
                <li>OBS Websocket v${obsData.obsWebSocketVersion}</p>
                <li>${obsData.platformDescription}</li>
              </div>
            </div>
            `)
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

      if (data?.event?.source === `Obs` && data?.event?.type === `Event`) {
        let obsEventListItem = document.createElement(`li`)
        obsEventListItem.setAttribute(`hidden`, ``)
        document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events ul.styled`).prepend(obsEventListItem)

        let obsEventListItem__Button = document.createElement(`button`)
        obsEventListItem.append(obsEventListItem__Button)
        
        let obsEventListItem__Button__Title = document.createElement(`p`)
        obsEventListItem__Button.append(obsEventListItem__Button__Title)
        obsEventListItem__Button__Title.className = `title`
        obsEventListItem__Button__Title.innerText = data?.data["obsEvent.event"]
        
        let obsEventListItem__Button__Description = document.createElement(`p`)
        obsEventListItem__Button__Description.className = `description`
        obsEventListItem__Button__Description.innerText = SB__FormatTimestamp(data.timeStamp, `small`)
        obsEventListItem__Button.append(obsEventListItem__Button__Description)

        updateObsEventsSearch()

        function updateObsEventsSearch() {
          setTimeout(() => {
            let searchTerm = document.querySelector(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events input[type=search]`).value.toLowerCase()

            document.querySelectorAll(`main .main[data-page="${urlSafe(`OBS Studio`)}"] .card-grid .card.events ul.styled li`).forEach(listItem => {
              let listItemTitle = listItem.querySelector(`p.title`).innerText.toLowerCase()
              let listItemDescription = listItem.querySelector(`p.description`).innerText.toLowerCase()

              if (listItemTitle.includes(searchTerm) || listItemDescription.includes(searchTerm)) {
                listItem.setAttribute(`hidden`, ``)
                listItem.removeAttribute(`hidden`)
              } else {
                listItem.setAttribute(`hidden`, ``)
              }
            });
          });
        }

        obsEventListItem__Button.addEventListener(`click`, () => {
          let table = ``
          Object.entries(data?.data).forEach(entry => {
            table += `
            <tr>
              <td style="text-align: right;">${entry[0]}</td>
              <td style="text-align: left;">${ValidateJson(entry[1]) ? `<pre><code>${formatJson(entry[1]).html}</code></pre>` : entry[1]}</td>
            </tr>
            `
          });

          table = `
          <table class="styled">
            <thead>
              <th style="text-align: right;">Name</th>
              <th style="text-align: left;">Value</th>
            </thead>
            <tbody>
              ${table}
            </tbody>
          </table>
          `

          createModal(`
            ${table}
          `, data?.data["obsEvent.event"], SB__FormatTimestamp(data.timeStamp, `small`), `medium`, {})
        })
      }

      /***
      ******************************
      ******************************
      ******************************
      ********* Log Viewer *********
      ******************************
      ******************************
      ******************************
      ***/

      if (data?.id === `WebsocketHandlerAction`) {
        document.querySelector(`main .main[data-page="${urlSafe(`Log Viewer`)}"]`).classList.add(`full`)
        document.querySelector(`main .main[data-page="${urlSafe(`Log Viewer`)}"]`).innerHTML = `
        <blockquote class="warning">
        Note: Work in progress
        </blockquote>
        `

        let formGroup = document.createElement(`div`)
        formGroup.className = `form-group styled`

        let formGroup__button = document.createElement(`button`)
        formGroup__button.innerText = `Open Latest Log File`
        formGroup.append(formGroup__button)

        document.querySelector(`main .main[data-page="${urlSafe(`Log Viewer`)}"]`).append(formGroup)

        formGroup__button.onclick = () => {
          let year = `${new Date().getFullYear()}`
          let month = `${new Date().getMonth() + 1}`
          let day = `${new Date().getDate()}`

          if (month < 10) month = `0${month}`
          if (day < 10) day = `0${day}`

          SB__StreamerbotActionPackageRequest(`StartProcess`, `logs/log_${year}${month}${day}.log`)
        }
      }

      if (data?.event?.source === `None` && data?.event?.type === `Custom` && data?.data?.wsRequest === `ReadFile`) {
        console.log(`SUCCESS`)
      }

      /***
      *********************************
      *********************************
      *********************************
      ********* ERROR LOGGING *********
      *********************************
      *********************************
      *********************************
      ***/

      if (data?.id != null) {
        let id = decodeURI(data.id)
        if (ValidateJson(id)) {
          id = JSON.parse(id)
          if (id.request === `DoAction`) {
            if (data.status === `ok`) {
              createAlert(`Succesfully ran action: "${id.action.name}"`, `success`)
            } else if (data.status === `error`) {
              createAlert(data.error, `error`)
            }
          }
        }
      }



      /***
      ***************************************
      ***************************************
      ***************************************
      ********* SB Helper Functions *********
      ***************************************
      ***************************************
      ***************************************
      ***/



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
        wsRequest: wsRequest,
        wsAuthentication: JSON.parse(localStorage.getItem(`streamerbotToolbox__StreamerbotActionPackage`) || `{"password": ""}`).password || ``
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
          wsAuthentication: JSON.parse(localStorage.getItem(`streamerbotToolbox__StreamerbotActionPackage`) || `{"password": ""}`).password || ``,
          wsDataConnection: obsConnection,
          wsDataRequestType: obsRequest,
          wsDataRequestData: JSON.stringify(obsRequestData)
        },
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Action Package Requests]%c Running OBS Request "${obsRequest}" with the data ${JSON.stringify(obsRequestData)} on the connection "${obsConnection}" and a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetActions(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetActions`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching all actions with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetEvents(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetEvents`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching all events with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetInfo(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetInfo`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching instance info with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetActiveViewers(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetActiveViewers`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching all active viewers with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetBroadcaster(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetBroadcaster`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching broadcaster information with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__Subscribe(subscriptions = {}, id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `Subscribe`,
        events: subscriptions,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching all events with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__UnSubscribe(subscriptions = {}, id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `UnSubscribe`,
        events: subscriptions,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching all events with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__GetCredits(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `GetCredits`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Fetching credits with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__TestCredits(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `TestCredits`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Testing credits with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }

    function SB__ClearCredits(id = "StreamerbotActionPackage") {
      let jsonBody = {
        request: `ClearCredits`,
        id: id
      }

      ws.send(JSON.stringify(jsonBody))

      console.log(`%c[Streamer.bot Requests]%c Clearing credits with a ws request id of "${id}"`, `color: #8c75fa;`, `color: white;`)
    }
  }
}

let speakerbotConnectionData = localStorage.getItem(`streamerbotToolbox__speakerbot`) || `{}`

if (speakerbotConnectionData != `{}`) {
  document.body.setAttribute(`speakerbot-state`, `enabled`)
  connectSpeakerbotws()
}

async function connectSpeakerbotws() {
  if ("WebSocket" in window) {
    let speakerbotConnectionJson = loadDataFromStorage(`streamerbotToolbox__speakerbot`)
    let wsServerUrl = `ws://${speakerbotConnectionJson.host}:${speakerbotConnectionJson.port}${speakerbotConnectionJson.endpoint}`
    const ws = new WebSocket(wsServerUrl)
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Speaker.bot...")

    ws.onclose = function () {
      setTimeout(connectSpeakerbotws, 10000)
      document.body.setAttribute(`speakerbot-state`, `disconnected`)
      document.querySelectorAll(`header .header-links a[data-integration=speakerbot]`).forEach(headerLink => {
        headerLink.parentNode.setAttribute(`hidden` , ``)
      });
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Speaker.bot, reconnecting every 10s...")
    }

    ws.onopen = function () {
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Speaker.bot")
      document.body.setAttribute(`speakerbot-state`, `connected`)
      document.querySelectorAll(`header .header-links a[data-integration=speakerbot]`).forEach(headerLink => {
        headerLink.parentNode.setAttribute(`hidden` , ``)
        headerLink.parentNode.removeAttribute(`hidden`)
      });
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"]`).classList.add(`full`)

      let defaultSpeakValues = localStorage.getItem(`streamerbotToolbox__speakerbot`) || undefined
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
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"]`).innerHTML = `
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

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] button.speak`).addEventListener(`click`, function () {
        let voiceAlias = document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .form-group input#voice-alias`).value || ``
        let message = document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .form-group input#message`).value || `This is a test message`
        let badWordsFilter = document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .form-group input#bad-words-filter`).checked

        let speakerbotData = localStorage.getItem(`streamerbotToolbox__speakerbot`) || `{}`
        speakerbotData = JSON.parse(speakerbotData)
        speakerbotData = Object.entries(speakerbotData)
        speakerbotData.push([`defaultSpeakVoiceAlias`, voiceAlias])
        speakerbotData.push([`defaultSpeakMessage`, message])
        
        speakerbotData = Object.fromEntries(speakerbotData)
        localStorage.setItem(`streamerbotToolbox__speakerbot`, JSON.stringify(speakerbotData))

        ws.send(JSON.stringify({
            request: "Speak",
            voice: voiceAlias,
            message: message,
            badWordFilter: badWordsFilter,
            id: "Speak"
          }
        ))
        createSnackbar(`TTS with the voice alias: "${voiceAlias}", and the text: "${message}"`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Enable"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Enable",
            id: "Enable"
          }
        ))

        createSnackbar(`Enable`)
      })
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Disable"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
          request: "Disable",
          id: "Disable"
        }
        ))
        
        createSnackbar(`Disable`)
      })
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Pause"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Pause",
            id: "Pause"
          }
        ))

        createSnackbar(`Pause`)
      })
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Resume"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
          request: "Resume",
          id: "Resume"
        }
        ))
        
        createSnackbar(`Resume`)
      })
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="On"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "On",
            id: "On"
          }
        ))

        createSnackbar(`On`)
      })
      
      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Off"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Off",
            id: "Off"
          }
        ))
        createSnackbar(`Off`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Stop"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Stop",
            id: "Stop"
          }
        ))

        createSnackbar(`Stop`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Clear"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Clear",
            id: "Clear"
          }
        ))

        createSnackbar(`Clear`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Enable Events"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Events",
            state: "on",
            id: "Enable Events"
          }
        ))

        createSnackbar(`Enable Events`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Disable Events"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Events",
            state: "off",
            id: "Disable Events"
          }
        ))

        createSnackbar(`Disable Events`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Speaking Mode: All"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Mode",
            mode: "all",
            id: "Speaking Mode: All"
          }
        ))

        createSnackbar(`Speaking Mode: All`)
      })

      document.querySelector(`main .main[data-page="${urlSafe(`Speaker.bot`)}"] .tags li button[title="Speaking Mode: Command"]`).addEventListener(`click`, function () {
        ws.send(JSON.stringify({
            request: "Mode",
            mode: "command",
            id: "Speaking Mode: Command"
          }
        ))

        createSnackbar(`Speaking Mode: Command`)
      })
    }

    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      if (!JSON.stringify(data).includes(`"status":"ok"`)) console.log(JSON.stringify(data))
    })
  }
}

function ValidateJson(json) {
  try {
    JSON.parse(json);
  } catch (err) {
      return false;
  }
  return true;
}

function SB__FormatTimestamp(timestamp, textSize = `small`) {
  let timestampObject = SB__TimestampObject(timestamp)

  if (textSize === `small` || textSize === undefined) {
    timestamp = `${timestampObject.hour}:${timestampObject.minute}:${timestampObject.second}`
  } else if (textSize === `medium`) {
    timestamp = `${timestampObject.hour}:${timestampObject.minute}:${timestampObject.second} (${timestampObject.timezone})`
  } else if (textSize === `full`) {
    timestamp = `${timestampObject.day}-${timestampObject.month}-${timestampObject.year}, ${timestampObject.hour}:${timestampObject.minute}:${timestampObject.second} (${timestampObject.timezone})`
  }
  return timestamp
}

function SB__TimestampObject(timestamp) {
  timestamp = timestamp.split(`T`)
  if (timestamp[1].includes(`+`)) {
    timestamp.push(`+` + timestamp[1].split(`+`)[1])
    timestamp[1] = timestamp[1].split(`+`)[0]
  } else if (timestamp[1].includes(`-`)) {
    timestamp.push(`-` + timestamp[1].split(`-`)[1])
    timestamp[1] = timestamp[1].split(`-`)[0]
  }

  timestamp[1] = timestamp[1].split(`:`)
  timestamp[1].push(timestamp[1][2].split(`.`)[1])
  timestamp[1][2] = timestamp[1][2].split(`.`)[0]

  timestamp[0] = timestamp[0].split(`-`)

  return {
    year: timestamp[0][0],
    month: timestamp[0][1],
    day: timestamp[0][2],
    hour: timestamp[1][0],
    minute: timestamp[1][1],
    second: timestamp[1][2],
    milliseconds: timestamp[1][3],
    timezone: timestamp[2]
  }
}

function urlSafe(url) {
  url = 
  url.replaceAll(`-`, ``)
     .replaceAll(` `, `-`)
     .replaceAll(`_`, ``)
     .replaceAll(`.`, ``)
     .replaceAll(`,`, ``)

  return url
}

document.addEventListener(`mousedown`, (e) => {
  if (e.target.tagName === `BODY`) {
    if (document.querySelector(`nav.navbar`) != null && document.querySelector(`nav.navbar`).getAttribute(`data-visible`) === "") {
      document.querySelector(`nav.navbar`).removeAttribute(`data-visible`)
    }
  }
})

document.addEventListener(`keyup`, (e) => {
  console.log(e)
  if (e.key === `F1`) {
    e.preventDefault()
    location.hash = `#Dashboard`
  } else if (e.key === `Escape`) {
    if (document.querySelector(`nav.navbar`).getAttribute(`data-visible`) === "") {
      document.querySelector(`nav.navbar`).removeAttribute(`data-visible`)
    }
  } else if (e.key === `i` && e.ctrlKey === true) {
    document.querySelector(`.open-settings-modal`).click()
  }
})

document.addEventListener('wheel', function(e) {
  if (e.target.tagName === `SELECT` && e.target.getAttribute(`disabled`) === null && e.target.getAttribute(`readonly`) === null) {
    if (e.deltaY < 0) {
      e.target.selectedIndex = Math.max(e.target.selectedIndex - 1, 0);
    } else if (e.deltaY > 0) {
        e.target.selectedIndex = Math.min(e.target.selectedIndex + 1, e.target.length - 1);
    }
  }
});
