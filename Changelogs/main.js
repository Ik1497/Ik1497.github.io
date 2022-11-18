changelogSelector();

///////////////////
/// > Widgets < ///
///////////////////

// Music - Minimal
async function WidgetsMusicMinimal() {
  const resp = await fetch("./pages/Widgets/Music-Minimal.html");
  const main = await resp.text();
  document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

// Music - Widget
async function WidgetsMusicWidget() {
  const resp = await fetch("./pages/Widgets/Music-Widget.html");
  const main = await resp.text();
  document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

function changelogSelector() {
  var element = document.getElementById("selectChangelogExtension");
  var value = element.value;
  var main = document.querySelector("main");
  main.parentNode.removeChild(main);

  var newMain = '<main class="animated fadeInUp"></main>';
  document.querySelector("header").insertAdjacentHTML("afterend", newMain);

  if (value === "WidgetsMusicMinimal") {
    WidgetsMusicMinimal();
  }
  if (value === "WidgetsMusicWidget") {
    WidgetsMusicWidget();
  }
}
