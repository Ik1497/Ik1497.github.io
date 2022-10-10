document.write(`
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="og:site_name" content="Streamer.bot Actions"/>
<meta property="og:type" content="website" />
<meta property="og:image" content="https://raw.githubusercontent.com/Ik1497/Ik1497/main/assets/profile_picture/Logo-Round.png" />
<link rel="icon" href="https://raw.githubusercontent.com/Ik1497/Ik1497/main/assets/profile_picture/Logo-Round.png" />
<meta name="theme-color" content="#B80086">

<header class="main-header">
<div class="header-main-contents">
<a class="title" href="/">
    <img src="/assets/favicon.ico" alt="favicon">
    <p>Streamer.bot Actions</p>
</a>
<ul class="nav-lists one">
<li>Socials</li>
<li><a href="/Socials/Discord.html">Discord</a></li>
<li><a href="/Socials/Issues.html">Issues</a></li>
<li><a href="/Socials/Pull-Requests.html">Pull Requests</a></li>
<ul>
</div>
</header>

<script src="/assets/navigation.js"></script>
<script src="/assets/theme.js"></script>
<script src="/assets/main.js"></script>
<link rel="stylesheet" href="/assets/node_modules/@mdi/font/css/materialdesignicons.css">

<script src="/assets/Prism/prism.js"></script>
<link rel="stylesheet" href="/assets/Prism/prism.css">
<link rel="stylesheet" href="/assets/style.css">
`);

function GoWMan() {
    var themeSettings = document.getElementById("themeSettings").value;
    console.log(themeSettings);
    if (themeSettings === "GoWMan") {
    document.write(`
    <link rel="stylesheet" href="/assets/style.css">
    `);
    }
}
{/* <div class="buttons">
    <a id="dark-mode-toggle" class="dark-mode-toggle" onclick="themeSelector()"><i class="mdi mdi-invert-colors"></i></a>
</div> */}