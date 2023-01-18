let version = `1.0.0-pre`
let title = `Streamer.bot Toolbox with ActionCompleted v${version}`
let documentTitle = `${title} | Streamer.bot Actions`
document.title = documentTitle

let headerTagsMap = [
  `About`,
  `Actions`,
  `Action History`,
  `Present Viewers`,
  `Websocket Events`,
  `Chat`
]


if (location.hash === ``) location.href = `#About`

let headerAside = `<div class="form-area"><label>Url</label><input type="url" value="localhost" class="url"></div><div class="form-area"><label>Port</label><input type="number" value="8080" max="9999" class="port"></div><div class="form-area"><label>Endpoint</label><input type="text" value="/" class="endpoint"></div><button class="connect-websocket">Connect</button>`
let headerHtml = `<header><a href="/"><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon"><div class="name-description"><p class="name">${title}</p><p class="description">by Ik1497</p></div></div></a><aside>${headerAside}</aside></header>`
document.querySelector("body").insertAdjacentHTML(`afterbegin`,`${headerHtml}<nav class="navbar"><input type="search" placeholder="Search..."><ul class="navbar-list"></ul></nav><main><ul class="main-list"></ul></main>`)

document.querySelector(`header`).insertAdjacentHTML(`beforeend`, `<ul class="header-tags"></ul>`)

headerTagsMap.forEach(headerTag => {
  let headerTagActive = ``
  if (headerTag === `Chat (WIP)`) headerTag = `Chat`
  let headerTagHash = headerTag.replaceAll(` `, `-`)
  if (location.hash === `#${headerTagHash}`) headerTagActive = ` class="header-tag-active"`
  document.querySelector(`header .header-tags`).insertAdjacentHTML(`beforeend`, `<a href="#${headerTagHash}" title="${headerTag}"${headerTagActive}>${headerTag}</a>`)

  document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `<main class="nested" data-page-hash="${headerTagHash}"></main>`)
});

if (!headerTagsMap.includes(location.hash.replace(`#`, ``))) document.body.classList.add(`404`)

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
      if (data.id === `GetInfo`) {
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
            request: `Subscribe`,
            events: {
              raw: [`Action`, `ActionCompleted`]
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
          let welcomeMessage = `Welcome!`
          let profileImage = ``
          if (data.connected.includes(`youtube`)) profileImage = data.platforms.youtube.broadcastUserProfileImage
          if (data.connected.includes(`twitch`)) profileImage = await fetch(`https://decapi.me/twitch/avatar/${data.platforms.twitch.broadcastUserName}`)
          if (data.connected.includes(`twitch`)) profileImage = await profileImage.text()

          if (profileImage != ``) profileImage = `<img style="width: 1em; height: 1em; border-radius: 100vmax; margin-right: .125em" src="${profileImage}" alt="Broadcaster's Avatar">`
  
          console.log(profileImage)
          if (data.connected.includes(`youtube`)) welcomeMessage = `Welcome, <span style="display: flex; align-items: center;">${profileImage}${data.platforms.youtube.broadcastUserName}!</span>`
          if (data.connected.includes(`twitch`)) welcomeMessage = `Welcome, <span style="display: flex; align-items: center;">${profileImage}${data.platforms.twitch.broadcastUser}!</span>`
          document.body.querySelector(`main`).innerHTML = `
          <h1 style="padding-bottom: 3rem;">${welcomeMessage}</h1>
          <p>Streamer.bot Toolbox (v${version}) is made for making developing Streamer.bot actions easier;</p>
          <p>this tool is currently a very work in progress, feautures may come and go over time.</p>
          <br>
          <p>This tool requires your <code>Server/Clients</code> --> <code>Websocket Server</code> to be enabled.</p>
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
        <div class="header"><div class="info"><p class="title"></p><p class="description"></p></div><button class="close-button">&times</button></div><div class="main"></div></div>`
        document.querySelector(`.open-settings-modal`).addEventListener(`click`, function () {
          document.querySelector(`.open-settings-modal`).insertAdjacentHTML(`afterend`, globalArgsHtml)
          
          reloadPages()
          function reloadPages() {
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `integrations`) reloadIntegrations()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `global-arguments`) reloadGlobalArguments()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `broadcaster`) reloadBroadcaster()
            if (document.querySelector(`.settings-modal`).getAttribute(`data-active-page`) === `random-users`) reloadRandomUsers()
          }

          document.querySelectorAll(`.settings-modal .header .close-button, .settings-modal .save-button button`).forEach(closeButton => {            
            closeButton.addEventListener(`click`, function () {
              reloadPages()
              document.querySelector(`.settings-modal`).parentNode.removeChild(document.querySelector(`.settings-modal`))
            })
          });

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
            <p class="mdi mdi-check"> Streamer.bot (${instance.version}) • ${wsServerUrl}</p>
            `

          }
        
          function reloadBroadcaster() {
            document.querySelector(`.settings-modal .header .info .title`).innerHTML = `Broadcaster Settings • Settings`
            document.querySelector(`.settings-modal .header .info .description`).innerHTML = `Setting of argument for the Broadcast User`

            let options = {
              Disabled: `<option>Disabled</option>`,
              Twitch: `<option>Twitch</option>`,
              YouTube: `<option>YouTube</option>`
            }
            let broadcastService = localStorage.getItem(`streamerbotToolbox__broadcastService`) || `Off`

            if (broadcastService === `Twitch`) {
              options = options.Twitch + options.Twitch + options.Disabled
            } else if (broadcastService === `YouTube`) {
              options = options.YouTube + options.Twitch + options.Disabled
            } else if (broadcastService === `Off`) {
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
              document.querySelector(`.settings-modal .main table.add-contents tbody`).insertAdjacentHTML(`beforeend`, `<tr><td><input type="text" placeholder="Argument" value="${globalArgData[0]}" disabled></td><td><input type="text" placeholder="Value" value="${globalArgData[1]}" disabled></td><td><button title="Remove Argument" class="remove-row mdi mdi-trash-can"></button></td></tr>`)
            });

            document.querySelector(`.settings-modal .main table.add-contents .add-row`).addEventListener(`click`, function () {
              let globalArgsData = localStorage.getItem(`streamerbotToolbox__globalArgs`) || `{}`
              globalArgsData = JSON.parse(globalArgsData)
              globalArgsData = Object.entries(globalArgsData)
              
              globalArgsNewData = []
              let argumentInput = document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).value
              let valueInput = document.querySelector(`.settings-modal .main table.add-contents tbody td.value input`).value

              if (argumentInput === ``) argumentInput = `Argument`
              if (valueInput === ``) valueInput = `Value`

              globalArgsNewData.push(argumentInput)
              globalArgsNewData.push(valueInput)
              globalArgsData.push(globalArgsNewData)
              globalArgsData = Object.fromEntries(globalArgsData)

              localStorage.setItem(`streamerbotToolbox__globalArgs`, JSON.stringify(globalArgsData))
              
              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).value = ``
              document.querySelector(`.settings-modal .main table.add-contents tbody td.value input`).value = ``

              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).focus()
              document.querySelector(`.settings-modal .main table.add-contents tbody td.argument input`).select()
              reloadGlobalArguments()
            })

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

        // Groups Navbar
        uniqueGroups.forEach(group => {
          document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item"><button><p class="title">${group}</p></button></li>`)
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
            buttonHtmlText = buttonHtml.innerText
            if (buttonHtmlText === "None") buttonHtmlText = ""
            let actionCount = 0
            data.actions.forEach(action => {
              if (action.group === buttonHtmlText) {
                actionCount++
                document.querySelector(`main ul.main-list`).insertAdjacentHTML(`beforeend`, `<li><p class="action-name">${action.name}</p><button title="Execute Action">Execute</button></li>`)
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
                  broadcasterObj.prfileImage = broadcaster?.platforms?.youtube?.broadcastUserProfileImage ?? `https://yt3.ggpht.com/VpC8_9WcDEKcPSvnD6p1iGT_S2_XxdeZtL6tTL2axexj0SpG-c4Wx8i5lYNbJtvmzwCnzm9Bsg=s88-c-k-c0x00ffffff-no-rj`
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
                  globalArguments.push([`broadcastUserProfileImage`, broadcasterObj.prfileImage])
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
                
                globalArguments = Object.fromEntries(globalArguments)
                
                ws.send(
                  JSON.stringify({
                    request: "DoAction",
                    action: {
                      name: buttonHtml.parentNode.querySelector(`p.action-name`).innerText
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

      if (location.hash === `#Action-History` && data.id === `ActionCompleted`) {
        document.querySelector(`main`).innerHTML = ``
      }

      if (location.hash === `#Action-History` && data?.event?.source === `Raw`) {
        document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`afterbegin`, `<li class="navbar-list-item" data-id="${data.data.arguments.runningActionId}"><button>${data.data.name}</button></li>`)
        let listContents = ``
        let arguments = Object.entries(data.data.arguments)
        arguments.forEach(argument => {
          listContents += `<li>${argument[0]}</li><li>${argument[1]}</li>`
        });
        document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `
        <ul class="main-list col-2" data-id="${data.data.arguments.runningActionId}" hidden>
          ${listContents}
        </ul>
        `)

        document.querySelector(`nav.navbar ul.navbar-list li button`).addEventListener(`click`, function () {
          let actionId = this.parentNode.getAttribute(`data-id`)
          this.parentNode.classList.add(`nav-active`)
          document.querySelectorAll(`nav.navbar ul.navbar-list li.nav-active`).forEach(navActiveButton => {
            navActiveButton.classList.remove(`nav-active`)
          });
          this.parentNode.classList.add(`nav-active`)
          document.querySelectorAll(`main ul.main-list`).forEach(mainList => {
            mainList.setAttribute(`hidden`, ``)
          });
          document.querySelector(`main ul.main-list[data-id="${actionId}"]`).removeAttribute(`hidden`)
        })
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