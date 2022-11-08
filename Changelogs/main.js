changelogSelector();

///////////////////
/// > Widgets < ///
///////////////////

// Music
async function WidgetsMusic() {
  const resp = await fetch("./pages/Widgets/Music.html");
  const main = await resp.text();
  document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

// Test
async function WidgetsTest() {
  const resp = await fetch("./pages/Widgets/Test.html");
  const main = await resp.text();
  document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

//////////////////////
/// > Extensions < ///
//////////////////////

// MusicBee
async function ExtensionsMusicBee() {
  const resp = await fetch("./pages/Extensions/MusicBee.html");
  const main = await resp.text();
  document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

function changelogSelector() {
  var element = document.getElementById("selectChangelogExtension");
  var value = element.value;
  var main = document.querySelector("main");
  main.parentNode.removeChild(main);

  var newMain = '<main class=""></main>';
  document.querySelector("body").insertAdjacentHTML("afterbegin", newMain);

  if (value === "WidgetsMusic") {
    WidgetsMusic();
  }
  if (value === "WidgetsTest") {
    WidgetsTest();
  }

  if (value === "ExtensionsMusicBee") {
    ExtensionsMusicBee();
  }
}

//////////////////
/// Default JS ///
//////////////////

/*
var changelogList = document.querySelectorAll(
  ".changelog-new, .changelog-update, .changelog-fixes"
);

for (var i = 0; i < changelogList.length; ++i) {
  console.log(i);
  changelogList[i].classList.add("animated fadeInUp wait-p6s");
}
*/