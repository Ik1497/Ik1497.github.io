app();

async function app() {
  let navItemsArray = await fetch(`/api/navigation.json`)
  navItemsArray = await navItemsArray.json()

  document.body.insertAdjacentHTML(`afterbegin`, `<nav class="navbar-wrapper"><ul class="navbar"></ul></nav>`);

  navItemsArray.forEach(navItemGroup => {
    if (navItemGroup.type === `group`) {
      let navItemList = ``;
      
      navItemGroup.groupItems.forEach(navItem => {
        if (navItem.type === `link` && navItem.enabled != false) {
          let navActive = ``
          if (location.pathname.replace(`.html`, ``) === navItem.href.replace(`.html`, ``)) {
            navActive += ` class="nav-active"`
          }

          if (location.hostname === `127.0.0.1` || location.hostname === `localhost`) {
            if (navItem.href.slice(-1) != `/`) {
              navItem.href += `.html`
            }
          }

          navItemList += `<li title="${navItem.name}"${navActive}><a href="${navItem.href}" class="${navItem.icon}">${navItem.name}</a></li>`
        }
      });

      let navbarSettings__collapsedGroups = localStorage.getItem(`navbarSettings__collapsedGroups`)
      navbarSettings__collapsedGroups = JSON.parse(navbarSettings__collapsedGroups)
      if (navbarSettings__collapsedGroups === `undefined` || navbarSettings__collapsedGroups === null) {
        navbarSettings__collapsedGroups = []
      } else if (JSON.stringify(navbarSettings__collapsedGroups).charAt(0) != `[`) {
        navbarSettings__collapsedGroups = `["${navbarSettings__collapsedGroups}"]`
      }

      let openState = `opened`
      if (navbarSettings__collapsedGroups.includes(navItemGroup.name)) {
        openState = `closed`
      }
      document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<div class="navbar-group" data-navbar-group-state="${openState}"><button class="group-title" title="${navItemGroup.name}">${navItemGroup.name}</button><ul>${navItemList}</ul></div>`)
       
    }
  });
  document.querySelectorAll(`nav.navbar-wrapper ul.navbar .navbar-group`).forEach(navbarGroup => {
    navbarGroup.querySelector(`button.group-title`).addEventListener(`click`, function () {
      let navbarSettings__collapsedGroups = localStorage.getItem(`navbarSettings__collapsedGroups`)
      navbarSettings__collapsedGroups = JSON.parse(navbarSettings__collapsedGroups)
      if (navbarSettings__collapsedGroups === `undefined` || navbarSettings__collapsedGroups === null) {
        navbarSettings__collapsedGroups = []
      } else if (JSON.stringify(navbarSettings__collapsedGroups).charAt(0) != `[`) {
        navbarSettings__collapsedGroups = `["${navbarSettings__collapsedGroups}"]`
      }

      let navbarGroupState = navbarGroup.getAttribute(`data-navbar-group-state`)

      if (navbarGroupState === `opened`) {
        navbarGroup.setAttribute(`data-navbar-group-state`, `closed`)

        if (!navbarSettings__collapsedGroups.includes(navbarGroup.querySelector(`button.group-title`).innerHTML)) {
          navbarSettings__collapsedGroups.push(navbarGroup.querySelector(`button.group-title`).innerHTML)
        }
        localStorage.setItem(`navbarSettings__collapsedGroups`, JSON.stringify(navbarSettings__collapsedGroups))

      } else if (navbarGroupState === `closed`) {
        navbarGroup.setAttribute(`data-navbar-group-state`, `opened`)

        navbarSettings__collapsedGroups.forEach(navbarSettings__collapsedGroup => {
          if (navbarSettings__collapsedGroup === navbarGroup.querySelector(`button.group-title`).innerText) {
            const index = navbarSettings__collapsedGroups.indexOf(navbarSettings__collapsedGroup);
            if (index > -1) {
              navbarSettings__collapsedGroups.splice(index, 1)
            }

            localStorage.setItem(`navbarSettings__collapsedGroups`, JSON.stringify(navbarSettings__collapsedGroups))
          }
        });

      }
    })
  });
}
