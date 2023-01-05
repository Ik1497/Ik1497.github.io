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
            navItemList += `<li title="${navItem.name}"><a href="${navItem.href}" class="${navItem.icon}">${navItem.name}</a></li>`
          }
        });

        document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<div class="navbar-group" data-navbar-group-state="opened"><button class="group-title" title="${navItemGroup.name}">${navItemGroup.name}</button><ul>${navItemList}</ul></div>`)
         
      }
    });
    document.querySelectorAll(`nav.navbar-wrapper ul.navbar .navbar-group`).forEach(navbarGroup => {
      console.log(navbarGroup)
      navbarGroup.querySelector(`button.group-title`).addEventListener(`click`, function () {
        let navbarGroupState = navbarGroup.getAttribute(`data-navbar-group-state`)

        if (navbarGroupState === `opened`) {
          navbarGroup.setAttribute(`data-navbar-group-state`, `closed`)
        } else if (navbarGroupState === `closed`) {
          navbarGroup.setAttribute(`data-navbar-group-state`, `opened`)
        }
      })
    });
}
