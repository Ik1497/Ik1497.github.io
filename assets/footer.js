// General Code

document.write(`
<script
src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js"
integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg="
crossorigin="anonymous"
></script>
<script>
anchors.options = {
  placement: 'left',
  icon: "#"
};
anchors.add();
</script>
`);
// Footer Code
var date;
var time;

var currentPage = window.location.pathname;
document.write(`
<hr>
<footer class="footer-info">
<a target="_blank" href="https://github.com/Ik1497/Ik1497.github.io/tree/main/${currentPage}" class="footer-edit mdi mdi-square-edit-outline"> Suggest Changes To This Page</a>
<p class="footer-update">Last updated: ${date}, ${time} UTC +0</p>
</footer>
`);
if (next == null || previous == null) {}
else {
var next;
var previous;
var nextName = next.split("/").pop();
nextName = nextName.replace('.html', '');
nextName = nextName.replace('-', ' ');

var previousName = previous.split("/").pop();
previousName = previousName.replace('.html', '');
previousName = previousName.replace('-', ' ');
document.write(`
<footer class="footer-grid">
<ul class="footer-grid">
    <a href="${previous}">
      <li>
        <strong>
          Previous
          <em>${previousName}</em>
        </strong>
      </li>
    </a>
    <a href="${next}">
    <li class="footer-align-right">
      <strong>
        Next up
        <em>${nextName}</em>
      </strong>
    </li>
  </a>
  </footer>
`);
}