const langJson = JSON.stringify({
  extensions: {
    music: {
      defaultSongTitle: "Play a Song",
      defaultSongArtist: "for this widget to work!",
    },
    anotherWidget: {
      lorem: "ipsum",
      dolar: "sit",
    },
  },
});

const lang = JSON.parse(langJson);
console.log(lang);

const extensionsMusicDefaultSongTitle = lang.extensions.music.defaultSongTitle || "test";
document.querySelector('[data-lang="extensions.music.defaultSongTitle"]').innerHTML = extensionsMusicDefaultSongTitle || "test";

// const params = new URLSearchParams(window.location.search);
// let transitionTime = params.get("lang") || "en";
