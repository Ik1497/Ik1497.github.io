let headings = document.querySelectorAll(`h2, h3, h4, h5, h6`)

if (headings.length != 0) {
    document.querySelector(`main`).insertAdjacentHTML(`afterend`, `<ul class="table-of-contents"></ul>`);
    
    headings.forEach(heading => {
        document.querySelector(`ul.table-of-contents`).insertAdjacentHTML(`beforeend`, `<li class="heading-tag-${heading.tagName.toLowerCase()}" title="${heading.innerText}" aria-label="${heading.innerText}"><button onclick="location.href = '#${heading.id}'"><span class="mdi mdi-chevron-right"></span>${heading.innerText}</button></li>`);
    });
}
