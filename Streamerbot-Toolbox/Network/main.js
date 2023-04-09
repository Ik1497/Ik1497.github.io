app()

async function app() {
  document.body.insertAdjacentHTML(`beforeend`, `
  <header>
    <a href="">
      <div class="main">
        <img src="https://ik1497.github.io/assets/images/favicon.png" alt="favicon">
        <div class="name-description">
          <p class="name">Streamer.bot Network Toolbox</p>
          <p class="description">by Ik1497</p>
        </div>
      </div>
    </a>
    <aside>
      <div class="form-area url">
        <label>Url</label>
        <input type="url" value="" class="url">
      </div>
      <div class="form-area port">
        <label>Port</label>
        <input type="number" min="0" max="99999" class="port" value="53128">
      </div>
      <button class="connect-websocket">Fetch Data</button>
    </aside>
    <ul class="header-links buttons-row">
      <li class="button-active">
        <a title="Actions" class="mdi mdi-lightning-bolt">
          <p class="button-row-title">Actions</p>
        </a>
      </li>
    </ul>
  </header>
  <nav class="navbar">
    <input type="search" placeholder="Search...">
    <ul class="navbar-list"></ul>
  </nav>
  <main>
    <div class="main"></div>
  </main>
  <button class="navbar-toggler footer-icon mdi mdi-menu"></button>
  `)

  document.querySelector(`.navbar-toggler`).addEventListener(`click`, () => {
    document.querySelector(`.navbar`).toggleAttribute(`data-visible`)
  })

  let sbStorageConnectionData = loadDataFromStorage(`streamerbotToolbox__network__connection`)
  document.querySelector(`header aside .form-area.url input`).value = sbStorageConnectionData.host
  document.querySelector(`header aside .form-area.port input`).value = sbStorageConnectionData.port

  document.querySelector(`header aside button.connect-websocket`).addEventListener(`click`, () => {
    let sbConnectionData = {
      host: document.querySelector(`header aside .form-area.url input`).value,
      port: document.querySelector(`header aside .form-area.port input`).value
    }

    saveKeyToStorage(`streamerbotToolbox__network__connection`, sbConnectionData)

    loadData()
  })
  
  if (loadDataFromStorage(`streamerbotToolbox__network__connection`) != {}) loadData()
}

async function loadData() {
  let sbStorageConnectionData = loadDataFromStorage(`streamerbotToolbox__network__connection`)
  let url = `http://${sbStorageConnectionData.host}:${sbStorageConnectionData.port}`

  let actions = await fetch(`${url}/actions`)
  actions = await actions.json()
  actions = actions.actions

  let actionsGroups = {}
  actionsGroups[`View All`] = []

  actions.forEach(action => {
    if (action.group === ``) action.group = `None`

    if (actionsGroups[action.group] === undefined) actionsGroups[action.group] = []

    actionsGroups[action.group].push(action)
    actionsGroups[`View All`].push(action)
  });

  actionsGroups = Object.entries(actionsGroups).sort()

  actionsGroups.sort((a, b) => {
    if (a[0] == `None`) return -1
    if (b[0] == `None`) return 1
    return 0
  });

  actionsGroups.sort((a, b) => {
    if (a[0] == `View All`) return -1
    if (b[0] == `View All`) return 1
    return 0
  });

  actionsGroups.forEach(actionGroup => {
    let navbarItem = document.createElement(`li`)
    document.querySelector(`nav.navbar ul.navbar-list`).append(navbarItem)
    navbarItem.className = `navbar-list-item`

    let navbarItem__Button = document.createElement(`button`)
    navbarItem.append(navbarItem__Button)

    let navbarItem__Button__Title = document.createElement(`p`)
    navbarItem__Button.append(navbarItem__Button__Title)
    navbarItem__Button__Title.className = `title`
    navbarItem__Button__Title.innerText = actionGroup[0]

    let navbarItem__Button__Description = document.createElement(`p`)
    navbarItem__Button.append(navbarItem__Button__Description)
    navbarItem__Button__Description.className = `description`
    navbarItem__Button__Description.innerText = `${actionGroup[1].length} ${actionGroup[1].length === 1 ? `Action` : `Actions`}`

    navbarItem__Button.addEventListener(`click`, () => {
      document.querySelectorAll(`nav.navbar ul.navbar-list li.navbar-list-item.nav-active`).forEach(navActiveButton => {
        navActiveButton.classList.remove(`nav-active`)
      });
      
      navbarItem.classList.add(`nav-active`)

      const main = document.querySelector(`main .main`)

      main.innerHTML = `
      <div class="card-grid">
        <div class="card">
          <div class="card-header">
            <p class="card-title">${actionGroup[0]}, ${actionGroup[1].length} ${actionGroup[1].length === 1 ? `Action` : `Actions`}</p>
          </div>
          <hr>
          <ul class="styled"></ul>
        </div>
      </div>
      `

      actionGroup[1].forEach(action => {
        let actionItem = document.createElement(`li`)
        main.querySelector(`.card-grid .card ul.styled`).append(actionItem)

        let actionItem__Button = document.createElement(`button`)
        actionItem.append(actionItem__Button)

        let actionItem__Button__Title = document.createElement(`p`)
        actionItem__Button.append(actionItem__Button__Title)
        actionItem__Button__Title.className = `title`
        actionItem__Button__Title.innerText = action.name

        let actionItem__Append = document.createElement(`div`)
        actionItem.append(actionItem__Append)
        actionItem__Append.className = `append form-group styled no-margin`

        let actionItem__Append__ExecuteButton = document.createElement(`button`)
        actionItem__Append.append(actionItem__Append__ExecuteButton)
        actionItem__Append__ExecuteButton.className = `primary dense`
        actionItem__Append__ExecuteButton.title = `Execute Action`
        actionItem__Append__ExecuteButton.innerText = `Execute`

        actionItem__Button.addEventListener(`click`, () => {
          const Modal__InspectAction = createModal(`
          <ul class="buttons-row list-items tonal">
            <li>${action.subactions_count} ${action.subaction_count === 1 ? `Sub-Action` : `Sub-Actions`}</li>
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
              }
            ]
          })

          Modal__InspectAction.onFooterButtonPress = (id) => {
            if (id === `execute`) {
              RunActionById(action.id)
            }
          }
        })

        actionItem__Append__ExecuteButton.addEventListener(`click`, () => {
          RunActionById(action.id)
        })
      });
    })
  });
}

async function RunAction(name) {
  let sbStorageConnectionData = loadDataFromStorage(`streamerbotToolbox__network__connection`)
  let url = `http://${sbStorageConnectionData.host}:${sbStorageConnectionData.port}`

  await fetch(`${url}/actions?runActionName=${name}`)
}

async function RunActionById(id) {
  let sbStorageConnectionData = loadDataFromStorage(`streamerbotToolbox__network__connection`)
  let url = `http://${sbStorageConnectionData.host}:${sbStorageConnectionData.port}`

  await fetch(`${url}/actions?runActionId=${id}`)
}
