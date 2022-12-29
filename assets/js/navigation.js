app();

async function app() {
  let navItemsArray = await fetch(`/api/navigation.json`);
  navItemsArray = await navItemsArray.json();

  /// ACTUAL CODE ///
  document.body.insertAdjacentHTML(`afterbegin`, `<nav class="navbar"></nav>`);

  navItemsArray.forEach(function (navItem) {
    if (navItem.type === "link") {
      document.querySelector("nav.navbar").insertAdjacentHTML(`beforeend`, `<a id="nav-${navItem.type}: ${navItem.name}" href="${navItem.href}"><li class="${navItem.icon}">${navItem.name}</li></a>`);
      let currentUrl = window.location.pathname;
      if (currentUrl.replace(".html", "") === navItem.href) {
        document.getElementById(`nav-${navItem.type}: ${navItem.name}`).classList.add("nav-active");
      }
    }

    if (navItem.type === "hr") {
      document.querySelector("nav.navbar").insertAdjacentHTML(`beforeend`, `<hr>`);
    }

    if (navItem.type === "label") {
      document.querySelector("nav.navbar").insertAdjacentHTML(`beforeend`, `<p class="nav-label">${navItem.name}</p>`);
    }
  });
};