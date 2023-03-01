let page = {
    name: "Streamer<wbr>.bot Actions",
    description: "Everything you NEED for streaming!",
    favicon: "https://ik1497.github.io/assets/images/favicon.png",
    footer: "© 2023 Streamer.bot Actions. All rights reserved.",
    githubUser: "ik1497",
    githubRepository: "ik1497.github.io",
    buttons: [
        {
            name: "Latest Extension",
            href: "/Extensions/Progress-Bar/Docs",
            external: false,
            type: "default"
        },
        {
            name: "View on Github",
            href: "https://github.com/Ik1497/Ik1497.github.io",
            external: true,
            type: "alt"
        }
    ],
    items: [
        {
            name: "Progress Bar",
            description: "Make an easy to set-up dynamic progress bar with Streamer.bot",
            icon: "mdi mdi-progress-upload",
            href: "/Extensions/Progress-Bar/Docs",
            enabled: true
        },
        {
            name: "Weather Widget V2",
            description: "Minimal night/day animated/static weather widget, including icons for weather events like rain, thunderstorms, snow, etc.",
            icon: "mdi mdi-weather-lightning",
            href: "/Extensions/Weather/Docs",
            enabled: true
        },
        {
            name: "Mute Indicator",
            description: "Mute Indicator so you can see if and what sources are muted.",
            icon: "mdi mdi-volume-mute",
            href: "/Extensions/Mute-Indicator/Docs",
            enabled: true
        },
        {
            name: ".bat/.vbs File Actions Handler.",
            description: "Run actions with a .bat file.",
            icon: "mdi mdi-script-text-play",
            href: "/Extensions/Local-Script-Action-Handler/Docs",
            enabled: true
        },
        {
            name: "Timer Widget",
            description: "Start, pause and stop a timer with Streamer.bot",
            icon: "mdi mdi-timer-outline",
            href: "/Extensions/Timer/Docs",
            enabled: false
        },
        {
            name: "Music Widget",
            description: "Music Widget for Spotify",
            icon: "mdi mdi-spotify",
            href: "/Extensions/Music/Widget/Docs",
            enabled: false
        },
    ]
}

// ----------- //
// Top Section //
// ----------- //

document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `<section class="top-section"><div class="main-text"><div class="title animated fadeInDown wait-p2s">${page.name}</div><div class="description animated fadeInDown wait-p4s">${page.description}</div><div class="main-buttons"></div></div><div class="logo"><div class="logo-background animated fadeInDown wait-p6s"></div><img class="logo-image animated fadeInDown wait-p6s" src="${page.favicon}" alt="logo"></section>`);

// ------- //
// Buttons //
// ------- //

for (let buttonsLength = 0; buttonsLength < page.buttons.length; buttonsLength++) {
    index = page.buttons[buttonsLength];
    let type = "";
    let external = "";

    if (index.type === "alt") { 
        type = " alt"
    }

    if (index.external === true) { 
        external = ` target="_blank"`
    }

    document.querySelector(`section.top-section .main-buttons`).insertAdjacentHTML(`beforeend`, `<a href="${index.href}" ${external} class="animated fadeInDown wait-p${(buttonsLength * 2) + 6}s${type}" title="${index.name}">${index.name}</a>`);
}

// -------------- //
// Item grid Code //
// -------------- //

document.querySelector(`section.top-section`).insertAdjacentHTML(`afterend`, `<section class="recent-extensions"><h2 class="animated fadeInDown wait-p2s">Recent Extensions</h2><ul class="item-grid"></ul></section>`)

for (let itemsLength = 0; itemsLength < page.items.length; itemsLength++) {
    index = page.items[itemsLength];
    let enabled = "";
    let itemGridTitle = index.name
    
    if (index.enabled === false) { 
        enabled = " disabled"
        itemGridTitle = `SOON...`
    }

    let hrefSuffix = ``

    if (location.hostname != `ik1497.github.io`) {
        if (index.href.slice(-1) != `/`) {
            hrefSuffix = `.html`
        }
    }

    
    document.querySelector(`section.recent-extensions ul.item-grid`).insertAdjacentHTML(`beforeend`, `<li class="item-grid-item${enabled}" title="${itemGridTitle}" aria-label="${itemGridTitle}"><a href="${index.href}${hrefSuffix}" data-tilt class="item-grid-item"><article class="animated fadeInDown wait-p${(itemsLength * 2) + 2}s"><div class="background"></div><i class="icon ${index.icon}"></i><p class="title">${index.name}</p><p class="description">${index.description}</p></article></a></li>`)
}

// ---------- //
// GitHub API //
// ---------- //
document.querySelector(`section.recent-extensions`).insertAdjacentHTML(`afterend`, `<section class="repository-info"><h2 class="animated fadeInDown wait-p6s">Repository Info</h2><ul class="item-grid"></ul></section>`);

let githubStargazersCount = sessionStorage.getItem(`github_stargazers_count`);
let githubWatchers = sessionStorage.getItem(`github_watchers`);

if (githubStargazersCount === null && githubWatchers === null) {
    fetchGithubRepoInformation();
} 
else {
    setGithubRepoInformation(githubStargazersCount, githubWatchers);
}

async function fetchGithubRepoInformation() {
    let response = await fetch(`https://api.github.com/repos/${page.githubUser}/${page.githubRepository}`);
    let data = await response.json();
    console.log(data);
    setGithubRepoInformation(data.stargazers_count, data.watchers);
}


function setGithubRepoInformation(githubStargazersCount, githubWatchers) {
    sessionStorage.setItem(`github_stargazers_count`, githubStargazersCount);
    sessionStorage.setItem(`github_watchers`, githubWatchers);

    document.querySelector(`section.repository-info ul.item-grid`).insertAdjacentHTML(`beforeend`, `<li class="item-grid-item" title="${githubStargazersCount} Stars" aria-label="${githubStargazersCount} Stars"><a href="https://github.com/${page.githubUser}/${page.githubRepository}/stargazers" target="_blank" data-tilt class="item-grid-item"><article class="animated fadeInDown wait-p8s"><div class="background"></div><i class="icon mdi mdi-star" style="color: #fff000"></i><p class="title">${githubStargazersCount} Stars</p><p class="description">Become a Stargazer!</p></article></a></li>`)
    document.querySelector(`section.repository-info ul.item-grid`).insertAdjacentHTML(`beforeend`, `<li class="item-grid-item" title="${githubWatchers} Watchers" aria-label="${githubWatchers} Watchers"><a href="https://github.com/${page.githubUser}/${page.githubRepository}/watchers" target="_blank" data-tilt class="item-grid-item"><article class="animated fadeInDown wait-p10s"><div class="background"></div><i class="icon mdi mdi-eye" style="color: var(--text-900)"></i><p class="title">${githubWatchers} Watchers</p><p class="description">Watch this Repository to be notified of all changes!</p></article></a></li>`)
}

// ----------- //
// Footer Code //
// ----------- //

document.querySelector(`section.repository-info`).insertAdjacentHTML(`afterend`, `<section class="footer"><footer>${page.footer}</footer></section>`);
