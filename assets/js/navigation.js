//////////////
/// NAVBAR ///
//////////////
const navItemsArray = JSON.stringify([
  {
    name: "Home",
    icon: "mdi mdi-home",
    href: "/",
    type: "link",
  },
  {
    name: "Changelogs",
    icon: "mdi mdi-fire",
    href: "/Changelogs/",
    type: "link",
  },
  {
    type: "hr",
  },
  {
    name: "Widgets",
    type: "label"
  },
  {
    name: "Music Widget",
    icon: "mdi mdi-spotify",
    href: "/Extensions/Music/",
    type: "link",
  },
  {
    name: "Mute Indicator",
    icon: "mdi mdi-volume-mute",
    href: "/Extensions/Mute-Indicator/Docs",
    type: "link",
  },
  {
    type: "hr"
  },
  {
    name: "Tools",
    type: "label"
  },
  {
    name: "OBS Websocket Events",
    icon: "mdi mdi-application",
    href: "/Extensions/OBS-Websocket-Events/",
    type: "link",
  }
]);

///////////////////
/// ACTUAL CODE ///
///////////////////
document.body.insertAdjacentHTML(`afterbegin`, `<nav class="navbar"></nav>`);

/* ADDING SOON...
  {
    name: "Hype Train Widget",
    icon: "mdi mdi-train",
    href: "/Extensions/Hype-Train/Docs.html",
    type: "link",
  }
*/

let navItems = JSON.parse(navItemsArray);

navItems.forEach(function (index, value) {
  let navItem = navItems[value];

  if (navItem.type === "link") {
    document
      .querySelector("nav.navbar")
      .insertAdjacentHTML(
        `beforeend`,
        `<a id="nav-` +
          navItem.type +
          `: ` +
          navItem.name +
          `" href="` +
          navItem.href +
          `"><li class="` +
          navItem.icon +
          `">` +
          navItem.name +
          `</li></a>`
      );
    let currentUrl = window.location.pathname;
    if (currentUrl.replace(".html", "") === navItem.href) {
      document
        .getElementById(`nav-` + navItem.type + `: ` + navItem.name)
        .classList.add("nav-active");
    }
  }

  if (navItem.type === "hr") {
    document
      .querySelector("nav.navbar")
      .insertAdjacentHTML(`beforeend`, `<hr>`);
  }

  if (navItem.type === "label") {
    document
      .querySelector("nav.navbar")
      .insertAdjacentHTML(
        `beforeend`,
        `<p class="nav-label">` + navItem.name + `</p>`
      );
  }
});
