function createSnackbar(snackBarHtml = ``, theme = `default`, loadTime = 3000, transitionDuration = 500, settings = {}) {
  if (loadTime === undefined) loadTime = 3000
  if (loadTime === transitionDuration) transitionDuration = 500

  let snackbarWrapper = document.createElement(`div`)
  snackbarWrapper.className = `snackbar-wrapper`
  snackbarWrapper.style.transitionDuration = `${transitionDuration}ms`
  
  let snackbarWrapper__snackbar = document.createElement(`div`)
  snackbarWrapper__snackbar.className = `snackbar`

  let snackbarWrapper__snackbar__snackbarContent = document.createElement(`div`)
  snackbarWrapper__snackbar__snackbarContent.className = `snackbar-content`
  snackbarWrapper__snackbar__snackbarContent.innerHTML = snackBarHtml

  snackbarWrapper__snackbar.append(snackbarWrapper__snackbar__snackbarContent)
  snackbarWrapper.append(snackbarWrapper__snackbar)

  document.body.append(snackbarWrapper)

  setTimeout(() => {
    snackbarWrapper.setAttribute(`data-state`, `opening`)
    
    setTimeout(() => {
      snackbarWrapper.setAttribute(`data-state`, `opened`)
      
      setTimeout(() => {
        snackbarWrapper.setAttribute(`data-state`, `closing`)
        
        setTimeout(() => {
          snackbarWrapper.setAttribute(`data-state`, `closed`)
          snackbarWrapper.remove()
          
        }, transitionDuration);
      }, loadTime);
    }, transitionDuration);
  }, 50);
}
