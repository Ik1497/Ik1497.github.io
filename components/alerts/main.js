function createAlert(alertHtml = ``, alertType = `success`, alertDuration = 5000, alertSettings = {}) {
  if (document.querySelector(`.alert-wrapper`) === null) {
    document.body.insertAdjacentHTML(`afterbegin`, `
    <div class="alert-wrapper">
      <ul></ul>
    </div>
    `)
  }

  let alertIcon = `default`
  if (alertType === `success`) alertIcon = `success mdi mdi-check-bold`
  if (alertType === `info`) alertIcon = `info mdi mdi-information`
  if (alertType === `warning`) alertIcon = `warning mdi mdi-alert`
  if (alertType === `error`) alertIcon = `error mdi mdi-close-thick`

  let alert__li = document.createElement(`li`)
  alert__li.className = alertIcon
  document.querySelector(`.alert-wrapper ul`).prepend(alert__li)
  
  alert__li__p = document.createElement(`p`)
  alert__li__p.innerHTML = alertHtml
  alert__li.append(alert__li__p)
  
  setTimeout(() => {
    alert__li.setAttribute(`data-state`, `opening`)

    setTimeout(() => {
      alert__li.setAttribute(`data-state`, `opened`)
      
      setTimeout(() => {
        alert__li.setAttribute(`data-state`, `closing`)
        
        setTimeout(() => {
          alert__li.setAttribute(`data-state`, `closed`)
          alert__li.remove()
          
        }, 500);
      }, alertDuration);
    }, 500);
  }, 50);
}
