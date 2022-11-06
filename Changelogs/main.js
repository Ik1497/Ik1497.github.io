WidgetsMusic();

///////////////////
/// > Widgets < ///
///////////////////

// Music
async function WidgetsMusic() {
    const resp = await fetch("./pages/Widgets/Music.html");
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

    if (value === "WidgetsMusic") {WidgetsMusic();}
    if (value === "ExtensionsMusicBee") {ExtensionsMusicBee();}
}