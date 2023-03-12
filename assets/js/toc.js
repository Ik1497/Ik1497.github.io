let headings = document.querySelectorAll(`h2, h3, h4, h5, h6`)

let usedTocItems = []

if (headings.length != 0 || document.body.getAttribute(`data-layout-hidden`) === null) {
  let mainWrapperCol3 = document.createElement(`div`)
  document.body.append(mainWrapperCol3)
  mainWrapperCol3.className = `main-wrapper__col-3`

  let tableOfContents__Title = document.createElement(`p`)
  mainWrapperCol3.append(tableOfContents__Title)
  tableOfContents__Title.className = `table-of-contents__title`
  tableOfContents__Title.innerText = `Table of Contents`

  let tableOfContents = document.createElement(`ul`)
  mainWrapperCol3.append(tableOfContents)
  tableOfContents.className = `table-of-contents`
  
  headings.forEach(heading => {
    headingName = tocUrlSafe(heading.innerText)
    usedTocItems.push(heading.innerText)
    heading.id = headingName
    heading.dataset.hash = `#${headingName}`
    document.querySelector(`ul.table-of-contents`).insertAdjacentHTML(`beforeend`, `
    <li class="heading-tag-${heading.tagName.toLowerCase()}" title="${heading.innerText}" aria-label="${heading.innerText}" data-hash="#${headingName}">
      <button onclick="location.href = '#${headingName}'">
        <span></span>
        ${heading.innerText}
      </button>
    </li>
    `);
  });
  updateTocActive()
}

document.querySelector(`main`).addEventListener(`scroll`, updateTocScroll)

function updateTocScroll() {
  if (document.body.dataset?.tocCooldown != ``) {
    updateTocActive()
    
    document.body.dataset.tocCooldown = ``
    setTimeout(() => {
      delete document.body.dataset.tocCooldown
      updateTocActive()
      
    }, 750);
  }
}

function updateTocActive() {
  document.querySelectorAll(`ul.table-of-contents li.toc-active`).forEach(tocItem => {
    tocItem.classList.remove(`toc-active`)
  });

  let headingNotSelected = true

  headings.forEach(heading => {
    if (isScrolledIntoView(heading) && headingNotSelected) {
      getTocItem(heading.dataset.hash)?.classList?.add(`toc-active`)
      // location.hash = heading.dataset.hash
      headingNotSelected = false
    }
  });
}

function getTocItem(hash) {
  return document.querySelector(`ul.table-of-contents li[data-hash="${hash}"]`)
}

function isScrolledIntoView(element) {
  var rect = element.getBoundingClientRect();
  var elementTop = rect.top;
  var elementBottom = rect.bottom;

  var isVisible = (elementTop >= 0) && (elementBottom <= window.innerHeight);
  return isVisible;
}

function tocUrlSafe(text) {
  let result = text
    .toLowerCase()
    .replaceAll(`#`, ``)
    .replaceAll(`?`, ``)
    .replaceAll(`!`, ``)
    .replaceAll(`&`, ``)
    .replaceAll(`=`, ``)
    .replaceAll(`(`, ``)
    .replaceAll(`)`, ``)
    .replaceAll(`[`, ``)
    .replaceAll(`]`, ``)
    .replaceAll(`{`, ``)
    .replaceAll(`}`, ``)
    .replaceAll(`.`, ``)
    .replaceAll(`,`, ``)
    .replaceAll(`/`, ``)
    .replaceAll(`:`, ``)
    .replaceAll(`;`, ``)
    .replaceAll(`+`, ``)
    .replaceAll(`-`, ``)
    .replaceAll(` `, `-`)

  if (usedTocItems.includes(text)) {
    let tocItemCount = 0
    usedTocItems.forEach(usedTocItem => {
      if (usedTocItem === text) {
        tocItemCount++
      }
    });
    result += `-${tocItemCount}`
  }

  return result
}
