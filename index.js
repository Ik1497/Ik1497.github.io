let page = {
  name: `Streamer<wbr>.bot Actions`,
  description: `Everything you NEED for streaming!`,
  favicon: `https://ik1497.github.io/assets/images/favicon.png`,
  githubUser: `ik1497`,
  githubRepository: `ik1497.github.io`,
  buttons: [
    {
      name: `Latest Extension`,
      href: `/Extensions/Progress-Bar/Docs`,
      external: false,
      type: `default`
    },
    {
      name: `View on Github`,
      href: `https://github.com/Ik1497/Ik1497.github.io`,
      external: true,
      type: `alt`
    }
  ]
}

// ----------- //
// Top Section //
// ----------- //

document.querySelector(`main`).insertAdjacentHTML(`afterbegin`, `
<section class="top-section">
  <div class="main-text">
    <div class="title animated fadeInDown wait-p2s">${page.name}</div>
    <div class="description animated fadeInDown wait-p4s">${page.description}</div>
    <div class="main-buttons"></div>
  </div>
  <div class="logo">
    <div class="logo-background animated fadeInDown wait-p6s"></div>
    <img class="logo-image animated fadeInDown wait-p6s" src="${page.favicon}" alt="logo">
  </div>
</section>
`)

// -------------- //
// Item grid Code //
// -------------- //

document.querySelector(`section.top-section`).insertAdjacentHTML(`afterend`, `
<section class="recent-extensions">
  <h2 class="animated fadeInDown wait-p2s">Recent Extensions</h2>
  <ul class="item-grid">Loading items...</ul>
</section>
`)

itemGrid()

async function itemGrid() {
  let navigation = await fetch(`https://raw.githubusercontent.com/Ik1497/Docs/main/api/navigation.json`)
  navigation = await navigation.json()
  navigation = navigation.navigationItems

  let items = []

  navigation.forEach(navigationGroup => {
    navigationGroup.groupItems.forEach(groupItem => {
      if (groupItem.groupItem.homePageIndex != `` && groupItem.groupItem.homePageIndex != undefined) {
        items.push(groupItem.groupItem)
      }
    });
  });

  items.sort((a, b) => {
    if (a.homePageIndex > b.homePageIndex) {
      return 1
    }

    if (a.homePageIndex < b.homePageIndex) {
      return -1
    }

    return 0
  })

  document.querySelector(`section.recent-extensions ul.item-grid`).innerHTML = ``

  items.forEach((item, itemIndex) => {
    let href = item.href

    if (location.hostname != `ik1497.github.io`) {
      if (item.href.slice(-1) != `/`) {
        href = `https://ik1497.github.io${item.href}`
      }
    }

    document.querySelector(`section.recent-extensions ul.item-grid`).insertAdjacentHTML(`beforeend`, `
    <li class="item-grid-item${item.channel != `public` ? ` disabled` : ``}" title="${item.channel != `public` ? `SOON...` : item.name}" aria-label="${item.channel != `public` ? `Extensions will be published in the future` : item.name}">
      <a href="${href}" data-tilt class="item-grid-item">
        <article class="animated fadeInDown wait-p${(itemIndex * 2) + 2}s">
          <div class="background"></div>
          <i class="icon ${item.icon}"></i>
          <p class="title">${item.name}</p>
          <p class="description">${item.description}</p>
        </article>
      </a>
    </li>
    `)

    if (itemIndex === 0) {
      document.querySelector(`section.top-section .main-buttons`).insertAdjacentHTML(`beforeend`, `
      <a href="${href}" class="animated fadeInDown wait-p6s" title="Latest Extension">Latest Extension</a>
      <a href="https://github.com/Ik1497/Ik1497.github.io" target="_blank" class="animated fadeInDown wait-p8s alt" title="View on Github">View on Github</a>
      `)
    }
  });
}

// ---------- //
// GitHub API //
// ---------- //
document.querySelector(`section.recent-extensions`).insertAdjacentHTML(`afterend`, `
<section class="repository-info">
  <h2 class="animated fadeInDown wait-p6s">Repository Info</h2>
  <ul class="item-grid"></ul>
</section>`);

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

  document.querySelector(`section.repository-info ul.item-grid`).insertAdjacentHTML(`beforeend`, `
  <li class="item-grid-item" title="${githubStargazersCount} Stars" aria-label="${githubStargazersCount} Stars">
    <a href="https://github.com/${page.githubUser}/${page.githubRepository}/stargazers" target="_blank" data-tilt class="item-grid-item">
      <article class="animated fadeInDown wait-p8s">
        <div class="background"></div>
        <i class="icon mdi mdi-star" style="color: #fff000"></i>
        <p class="title">${githubStargazersCount} Stars</p>
        <p class="description">Become a Stargazer!</p>
      </article>
    </a>
  </li>
  `)

  document.querySelector(`section.repository-info ul.item-grid`).insertAdjacentHTML(`beforeend`, `
  <li class="item-grid-item" title="${githubWatchers} Watchers" aria-label="${githubWatchers} Watchers">
    <a href="https://github.com/${page.githubUser}/${page.githubRepository}/watchers" target="_blank" data-tilt class="item-grid-item">
      <article class="animated fadeInDown wait-p10s">
        <div class="background"></div>
        <i class="icon mdi mdi-eye" style="color: var(--text-900)"></i>
        <p class="title">${githubWatchers} Watchers</p>
        <p class="description">Watch this Repository to be notified of all changes!</p>
      </article>
    </a>
  </li>
  `)
}

// ----------- //
// Footer Code //
// ----------- //

document.querySelector(`section.repository-info`).insertAdjacentHTML(`afterend`, `
<section class="footer">
  <footer>© 2022-${new Date().getFullYear()} Streamer.bot Actions. All rights reserved.</footer>
</section>
`)
