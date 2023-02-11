if (document.body.getAttribute(`data-layout-hidden`) === null) {
  app();
}


async function app() {
  let navItemsArray = await fetch(`/api/navigation.json`)
  navItemsArray = await navItemsArray.json()

  document.body.insertAdjacentHTML(`afterbegin`, `<nav class="navbar-wrapper"><ul class="navbar"></ul></nav>`);

  navItemsArray.forEach(navItemGroup => {
    if (navItemGroup.type === `group`) {
      let navItemList = ``;
      
      navItemGroup.groupItems.forEach(navItem => {
        if (navItem.type === `link` && navItem.enabled != false) {
          let published = navItem.channel ?? `public`
          let navActive = ``

          // If page is published and user has access
          if (published === `beta` && localStorage.getItem(`websiteSettings__visibilityChannel`) === `beta`) { 
            navItem.name += ` (BETA)`
          }
          
          if (location.pathname.replace(`index.html`, ``).replace(`.html`, ``) === navItem.href.replace(`.html`, ``)) {

            navActive += ` class="nav-active"`
            
            
            if (location.pathname.replace(`index.html`, ``).replace(`.html`, ``) != `/`) {
              document.title = `${navItem.name} | Streamer.bot Actions`
              document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `
              <header class="page-info">
                <p class="title">${navItem.name}</p>
                <p class="description">${navItem.description}</p>
              </header>
              `)

              let editDate = navItem.lastEdited.date
              let editTime = navItem.lastEdited.time

              if (editDate != null || editTime != null) {
                document.querySelector(`footer.footer-info .footer-update`).innerHTML = `Last updated: ${editTime}, ${editDate}`
              }

              // If page is unpublished and user has no access
              if (published === `beta` && localStorage.getItem(`websiteSettings__visibilityChannel`) != `beta`) { 
                if (location.hostname != `ik1497.github.io`) {
                  window.location = `/403.html`
                } else {
                  window.location = `/403`
                }
              }

            }
          }

          if (location.hostname != `ik1497.github.io`) {
            if (navItem.href.slice(-1) != `/`) {
              navItem.href += `.html`
            }
          }

          
          // If page is published or user has access
          if (published != `beta` || localStorage.getItem(`websiteSettings__visibilityChannel`) === `beta`) { 
            navItemList += `<li title="${navItem.name}" aria-label="${navItem.name}"${navActive}${published}><a href="${navItem.href}" class="${navItem.icon}">${navItem.name}</a></li>`
          }
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
      document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<div class="navbar-group" data-navbar-group-state="${openState}"><button class="group-title" title="${navItemGroup.name}" aria-label="${navItemGroup.name}">${navItemGroup.name}</button><ul>${navItemList}</ul></div>`)
       
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
