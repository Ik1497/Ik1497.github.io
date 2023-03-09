reloadImageHandler()

function reloadImageHandler() {
  document.querySelectorAll(`img:not([data-loaded])`).forEach(img => {
    img.dataset.loaded = ``
    img.addEventListener(`click`, () => {
      createModal(`
      <img src="${img.src}" alt="${img.alt}" style="width: 100%;">
      `, `Image Preview`, img.alt, `large`, {})
    })
  });
}