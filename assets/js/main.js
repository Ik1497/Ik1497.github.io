document.write(`
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js" integrity="sha256-lZaRhKri35AyJSypXXs4o6OPFTbTmUoltBbDCbdzegg=" crossorigin="anonymous" ></script>
`);

document.querySelectorAll(`a`).forEach(a => {
    a.classList.add( location.hostname === a.hostname || !a.hostname.length ? 'is-internal-link' : 'is-external-link' );
});
