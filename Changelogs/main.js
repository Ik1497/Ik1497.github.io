changelogSelector();

///////////////////
/// > Widgets < ///
///////////////////

// Music - Minimal
async function WidgetsMusicMinimal() {
  const resp = await fetch("./pages/Widgets/Music-Minimal.html");
  const main = await resp.text();
  document.querySelector(".main-contents").insertAdjacentHTML("beforeend", main);
}

// Music - Widget
async function WidgetsMusicWidget() {
  const resp = await fetch("./pages/Widgets/Music-Widget.html");
  const main = await resp.text();
  document.querySelector(".main-contents").insertAdjacentHTML("beforeend", main);
}

function changelogSelector() {
  var element = document.getElementById("selectChangelogExtension");
  var value = element.value;
  var main = document.querySelector(".main-contents");
  main.parentNode.removeChild(main);

  var newMain = '<div class="animated fadeInUp main-contents"></div>';
  document.querySelector("main").insertAdjacentHTML("beforeend", newMain);

  if (value === "WidgetsMusicMinimal") {
    WidgetsMusicMinimal();
  }
  if (value === "WidgetsMusicWidget") {
    WidgetsMusicWidget();
  }
}
