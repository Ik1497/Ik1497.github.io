WidgetsMusic();

///////////////////
/// > Widgets < ///
///////////////////

// Music
async function WidgetsMusic() {
    const resp = await fetch("./Widgets-Music.html");
    const main = await resp.text();
    document.querySelector("main").insertAdjacentHTML("beforeend", main);
}

//////////////////////
/// > Extensions < ///
//////////////////////

// MusicBee
async function ExtensionsMusicBee() {
    const resp = await fetch("./Extensions-MusicBee.html");
    const main = await resp.text();
    document.querySelector("main").insertAdjacentHTML("beforeend", main);
}