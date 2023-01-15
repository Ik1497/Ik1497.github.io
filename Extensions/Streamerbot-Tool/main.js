let headerAside = `<div class="form-area"><label>Url</label><input type="url" value="localhost" class="url"></div><div class="form-area"><label>Port</label><input type="number" value="8080" max="9999" class="port"></div><div class="form-area"><label>Endpoint</label><input type="text" value="/" class="endpoint"></div><button class="connect-websocket">Connect</button>`
let headerHtml = `<header><div class="main"><img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon"><div class="name-description"><p class="name">Streamer.bot Tool</p><p class="description">by Ik1497</p></div></div><aside>${headerAside}</aside></header>`

let headTag_active__Actions = ``
let headTag_active__ActionHistory = ``

window.addEventListener('hashchange', () => {
  location.reload()
});
if (location.hash === `#Actions`) headTag_active__Actions = ` class="header-tag-active"`
if (location.hash === `#Actions-History`) headTag_active__ActionHistory = ` class="header-tag-active"`
if (location.hash === ``) location.href = `#Actions`

let headTag__Actions = `<a href="#Actions"${headTag_active__Actions}>Actions</a>`
let headTag__ActionHistory = `<a href="#Actions-History"${headTag_active__ActionHistory}>Action History</a>`
let headerTags = `<div class="header-tags">${headTag__Actions}${headTag__ActionHistory}</div>`
document.querySelector("body").insertAdjacentHTML(`afterbegin`,`${headerHtml}${headerTags}<nav class="navbar"><ul class="navbar-list"></ul></nav><main><ul class="actions"></ul></main>`)

document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, function () {
  window.location = `?ws=ws://${document.querySelector(`header aside .form-area .url`).value}:${document.querySelector(`header aside .form-area .port`).value}${document.querySelector(`header aside .form-area .endpoint`).value}`
})

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

    ws.onclose = function () {
      setTimeout(connectws, 10000)
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...")
      if (document.querySelector(`header aside`))
      document.querySelector(`header aside`).innerHTML = headerAside
      document.querySelector(`header aside button.connect-websocket`).innerText = `Connect`
      document.querySelector(`header aside`).setAttribute(`data-connection`, `disconnected`)
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
    }
    
    ws.addEventListener("message", (event) => {
      if (!event.data) return
      const data = JSON.parse(event.data)
      console.log(data)
      if (data.id === `GetInfo`) {
        document.querySelector(`header aside`).innerHTML = `${data.info.os} • Streamer.bot - ${data.info.name} ${data.info.version}`
      }

      if (location.hash === `#Actions` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: "GetActions",
            id: "GetActions",
          })
        )
      } else if (location.hash === `#Actions-History` && data.id === `GetInfo`) {
        ws.send(
          JSON.stringify({
            request: `Subscribe`,
            events: {
              raw: [`ActionCompleted`, `Action`]
            },
            id: `Subscribe`,
          })
        )
      }

      if (location.hash === `#Actions-History` && data.id === `Subscribe`) {

      }

      if (location.hash === `#Actions` && data.id === `GetActions`) {
        // ------ //
        // NAVBAR //
        // ------ //

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
          document.querySelector(`nav.navbar ul.navbar-list`).insertAdjacentHTML(`beforeend`, `<li class="navbar-list-item"><button>${group}</button></li>`)
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

            document.querySelector(`main ul.actions`).parentNode.removeChild(document.querySelector(`main ul.actions`))

            document.querySelector(`main`).insertAdjacentHTML(`beforeend`, `<ul class="actions"></ul>`)
            buttonHtmlText = buttonHtml.innerText
            if (buttonHtmlText === "None") buttonHtmlText = ""
            data.actions.forEach(action => {
              if (action.group === buttonHtmlText) {
                document.querySelector(`main ul.actions`).insertAdjacentHTML(`beforeend`, `<li><p class="action-name">${action.name}</p><button title="Execute Action">Execute</button></li>`)
              }
            })

            // Execute Button
            let globalArguments = localStorage.getItem(`streamerbotTool__globalArgs`) || `{}`
            globalArguments = JSON.parse(globalArguments)
            globalArguments = Object.entries(globalArguments)
            globalArguments.push([`source`, `StreamerbotTool`])
            globalArguments = Object.fromEntries(globalArguments)
            document.querySelectorAll(`main ul.actions button`).forEach(buttonHtml => {
              buttonHtml.addEventListener(`click`, function () { 
                ws.send(
                  JSON.stringify({
                    request: "DoAction",
                    action: {
                      name: buttonHtml.parentNode.querySelector(`p.action-name`).innerText
                    },
                    args: globalArguments,
                    id: "123",
                  })
                )
                console.log(JSON.stringify({
                  request: "DoAction",
                  action: {
                    name: buttonHtml.parentNode.querySelector(`p.action-name`).innerText
                  },
                  args: globalArguments,
                  id: "123",
                }))
              })
            })
          })
        })


        //////////////////////
        // Global Arguments //
        //////////////////////
        let globalArgsHtml = `<div class="global-args"><div class="header"><div class="info"><p class="title">Global Arguments</p><p class="description">Arguments that will be assigned to all actions</p></div><button class="close-button">&times</button></div><div class="main"><table class="add-contents"><thead><tr><th>Argument</th><th>Value</th></tr></thead><tbody><tr><td class="argument"><input type="text" placeholder="Argument"></td><td class="value"><input type="text" placeholder="Value"></td><td><button title="Add Argument"class="add-row mdi mdi-plus-box"></button></td></tr></tbody></table></div></div>`
        document.querySelector(`.open-global-args`).addEventListener(`click`, function () {
          document.querySelector(`.open-global-args`).insertAdjacentHTML(`afterend`, globalArgsHtml)
          document.querySelectorAll(`.global-args .header .close-button, .global-args .save-button button`).forEach(closeButton => {            
            closeButton.addEventListener(`click`, function () {
              document.querySelector(`.global-args`).parentNode.removeChild(document.querySelector(`.global-args`))
            })
          });
          
          reloadAddContentsTable()

          document.querySelector(`.global-args .main table.add-contents .add-row`).addEventListener(`click`, function () {
            let globalArgsData = localStorage.getItem(`streamerbotTool__globalArgs`) || `{}`
            globalArgsData = JSON.parse(globalArgsData)
            globalArgsData = Object.entries(globalArgsData)
            
            globalArgsNewData = []
            globalArgsNewData.push(document.querySelector(`.global-args .main table.add-contents tbody td.argument input`).value)
            globalArgsNewData.push(document.querySelector(`.global-args .main table.add-contents tbody td.value input`).value)
            globalArgsData.push(globalArgsNewData)
            globalArgsData = Object.fromEntries(globalArgsData)

            localStorage.setItem(`streamerbotTool__globalArgs`, JSON.stringify(globalArgsData))
            
            document.querySelector(`.global-args .main table.add-contents tbody td.argument input`).value = ``
            document.querySelector(`.global-args .main table.add-contents tbody td.value input`).value = ``
            reloadAddContentsTable()
          })

          function reloadAddContentsTable() {
            document.querySelectorAll(`.global-args .main table.add-contents tbody tr:not(:nth-child(1))`).forEach(tableRow => {
              tableRow.parentNode.removeChild(tableRow)
            });

            let globalArgsData = localStorage.getItem(`streamerbotTool__globalArgs`) || `{}`
            globalArgsData = JSON.parse(globalArgsData)
            globalArgsData = Object.entries(globalArgsData)

            globalArgsData.forEach(globalArgData => {
              document.querySelector(`.global-args .main table.add-contents tbody`).insertAdjacentHTML(`beforeend`, `<tr><td><input type="text" placeholder="Argument" value="${globalArgData[0]}" disabled></td><td><input type="text" placeholder="Value" value="${globalArgData[1]}" disabled></td><td><button title="Remove Argument" class="remove-row mdi mdi-trash-can"></button></td></tr>`)
            });

            document.querySelectorAll(`.global-args .main table.add-contents .remove-row`).forEach(removeRow => {
              removeRow.addEventListener(`click`, function () {
                let globalArgsData = localStorage.getItem(`streamerbotTool__globalArgs`) || `{}`
                globalArgsData = JSON.parse(globalArgsData)
                globalArgsData = Object.entries(globalArgsData)
                console.log(globalArgsData)
                
                let globalArgIndex = 0
                globalArgsData.forEach(globalArgData => {
                  if (globalArgData[0] === removeRow.parentNode.parentNode.querySelector(`input`).value) {
                    console.log(globalArgData, globalArgIndex)
                    console.log(removeRow.parentNode.parentNode.querySelector(`input`).value)
                    globalArgsData.splice(globalArgIndex, 1)
                  }
                  globalArgIndex = globalArgIndex + 1
                });
                
                globalArgsData = Object.fromEntries(globalArgsData)
                localStorage.setItem(`streamerbotTool__globalArgs`, JSON.stringify(globalArgsData))
  
                reloadAddContentsTable()
              })
            });
          }
        })
      }
    })
  }
}
