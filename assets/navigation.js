document.write(`
<ul class="navbar">
<a href="/"><li class="mdi mdi-home">Home</li></a>
<a href="/About.html"><li class="mdi mdi-format-quote-open">About</li></a>
<a href="/FAQ"><li class="mdi mdi-frequently-asked-questions">FAQ</li></a>
</ul>
`);

function discord() {
  fetch('https://img.shields.io/discord/834650675224248362?label=&color=none')
    .then((response) => response.json())
    .then((data) => console.log(data));
}

// const navbarDropdownTitle = document.querySelector('.navbar-dropdown-title');
// element.addEventListener("click", openDropdown);

// function openDropdown() {
//   var element = document.querySelector('.navbar-dropdown');
//   element.classList.add("active");
// }

{/* <section class="navbar-dropdown"><p class="navbar-dropdown-title">Extensions</p>
  <div class="navbar-dropdown-items">
    <a><li class="mdi mdi-clock-outline">Time Widget</li></a>
  </div>
</section> */}