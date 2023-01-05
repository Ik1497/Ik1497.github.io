app();

// async function app() {
//   let navItemsArray = await fetch(`/api/navigation.json`);
//   navItemsArray = await navItemsArray.json();

//   /// ACTUAL CODE ///
//   document.body.insertAdjacentHTML(`afterbegin`, `<nav class="navbar-wrapper"><ul class="navbar"></ul></nav>`);

//   navItemsArray.forEach(function (navItem) {
//     if (navItem.type === "link") {
//       document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<li class="${navItem.icon}"><a id="nav-${navItem.type}: ${navItem.name}" href="${navItem.href}" title="${navItem.name}">${navItem.name}</a></li>`);
//       let currentUrl = window.location.pathname;
//       if (currentUrl.replace(".html", "") === navItem.href) {
//         document.getElementById(`nav-${navItem.type}: ${navItem.name}`).classList.add("nav-active");
//       }
//     }

//     if (navItem.type === "hr") {
//       document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<li><hr></li>`);
//     }

//     if (navItem.type === "label") {
//       document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<li><p class="nav-label">${navItem.name}</p></li>`);
//     }
//   });
// };

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

        console.log(navItemList)
        document.querySelector("nav.navbar-wrapper ul.navbar").insertAdjacentHTML(`beforeend`, `<div class="navbar-group" data-navbar-group-state="opened"><button class="group-title" title="${navItemGroup.name}">${navItemGroup.name}</button><ul>${navItemList}</ul></div>`)
      }
    });
}