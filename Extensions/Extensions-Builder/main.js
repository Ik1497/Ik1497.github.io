document.getElementById(`page-naming--name`).addEventListener(`keydown`, EditSettings)
document.getElementById(`page-naming--description`).addEventListener(`keydown`, EditSettings)
document.getElementById(`page-naming--author`).addEventListener(`keydown`, EditSettings)
document.getElementById(`page-naming--copyright`).addEventListener(`keydown`, EditSettings)

function EditSettings() {
  setTimeout(() => {
    UpdateOutput()
  }, 50);
}

UpdateOutput()

function UpdateOutput() {
  let page = {
    title: document.getElementById(`page-naming--name`).value || `INSERT TITLE`,
    description: document.getElementById(`page-naming--description`).value || `INSERT DESCRIPTION`,
    author: document.getElementById(`page-naming--author`).value || `INSERT AUTHOR`,
    copyright: document.getElementById(`page-naming--copyright`).value || `INSERT COPYRIGHT`
  }

  document.getElementById(`output`).innerText = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Title -->
  <title>${page.title}</title>
  <meta name="og:title" content="${page.title}">

  <!-- Description -->
  <meta name="description" content="${page.description}">
  <meta name="og:description" content="${page.description}">
  
  <!-- Author and Copyright -->
  <meta name="copyright" content="${page.copyright}">
  <meta name="author" content="${page.author}">
  
  <!-- Misc -->

  <!-- JavaScript -->
  <script src="main.js" defer></script>

  <!-- Stylesheets -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
  
  </header>

  <nav>
  
  </nav>

  <main>

  </main>

  <footer>
  
  </footer>
</body>
</html>`
}