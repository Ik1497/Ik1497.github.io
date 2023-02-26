let headings = document.querySelectorAll(`h2, h3, h4, h5, h6`)

let usedTocItems = []

if (headings.length != 0 || document.body.getAttribute(`data-layout-hidden`) === null) {
  document.querySelector(`main`).insertAdjacentHTML(`afterend`, `<ul class="table-of-contents"></ul>`);
  
  headings.forEach(heading => {
      headingName = tocUrlSafe(heading.innerText)
      usedTocItems.push(heading.innerText)

    heading.id = headingName

    document.querySelector(`ul.table-of-contents`).insertAdjacentHTML(`beforeend`, `<li class="heading-tag-${heading.tagName.toLowerCase()}" title="${heading.innerText}" aria-label="${heading.innerText}"><button onclick="location.href = '#${headingName}'"><span class="mdi mdi-chevron-right"></span>${heading.innerText}</button></li>`);
  });
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
