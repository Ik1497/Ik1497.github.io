if (document.body.getAttribute(`data-layout-hidden`) === null) {
  app();
}


async function app() {
  let navItemsArray = await fetch(`https://raw.githubusercontent.com/Ik1497/Docs/main/api/navigation.json`)
  navItemsArray = await navItemsArray.json()
  navItemsArray = navItemsArray.navigationItems

  document.body.insertAdjacentHTML(`afterbegin`, `
  <div class="main-wrapper__col-1">
    <nav class="navbar-wrapper">
      <ul class="navbar"></ul>
    </nav>
  </div>
  `);

  navItemsArray.forEach(navItemGroup => {
    if (navItemGroup.type === `group`) {
      let navItemList = ``;
      
      navItemGroup.groupItems.forEach(navItem => {
        navItem = navItem.groupItem

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
              <header class="page-info animated fadeInDown">
                <p class="title animated fadeInDown wait-p2s">${navItem.name}</p>
                <p class="description animated fadeInDown wait-p4s">${navItem.description}</p>
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
            navItemList += `
            <li title="${navItem.name}" aria-label="${navItem.name}"${navActive}${published}>
              <a href="${navItem.href}" class="${navItem.icon}">${navItem.name}</a>
            </li>
            `
          }
        }
      });

      let navbarSettings__collapsedGroups = loadDataFromStorage(`navbarSettings__collapsedGroups`, `array`)

      let openState = `true`
      if (navbarSettings__collapsedGroups.includes(navItemGroup.name)) {
        openState = `false`
      }

      document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `
      <div class="navbar-group" data-open="${openState}" data-name="${navItemGroup.name}">
        <button class="group-title" title="${navItemGroup.name}" aria-label="${navItemGroup.name}">
          ${navItemGroup.name}
        </button>
        <ul class="navbar-group-items" style="max-height: 0px;">
          ${navItemList}
        </ul>
      </div>
      `)
    }
  });

  const navbar = document.querySelector(`nav.navbar-wrapper ul.navbar`)

  navbar.querySelectorAll(`.navbar-group`).forEach(navbarGroup => {
    if (navbarGroup.dataset.open === `true`) {
      navbarGroup.querySelector(`ul.navbar-group-items`).style.maxHeight = `${navbarGroup.querySelector(`ul.navbar-group-items`).scrollHeight}px`
    }

    if (navbarGroup.querySelectorAll(`ul li`).length < 1) {
      navbarGroup.remove()
    } else {      
      navbarGroup.querySelector(`button.group-title`).addEventListener(`click`, function () {
        if (navbarGroup.dataset.open === `true`) {
          navbarGroup.dataset.open = `false`
          navbarGroup.querySelector(`ul.navbar-group-items`).style.maxHeight = `0px`
        } else if (navbarGroup.dataset.open === `false`) {
          navbarGroup.dataset.open = `true`
          navbarGroup.querySelector(`ul.navbar-group-items`).style.maxHeight = `${navbarGroup.querySelector(`ul.navbar-group-items`).scrollHeight}px`
        }

        localStorage.setItem(`navbarSettings__collapsedGroups`, `[]`)

        navbar.querySelectorAll(`.navbar-group`).forEach(navbarGroup => {
          if (navbarGroup.dataset.open === `false`) {
            saveItemToStorage(`navbarSettings__collapsedGroups`, navbarGroup.dataset.name)
          }
        });
      })
    }
  });
}
