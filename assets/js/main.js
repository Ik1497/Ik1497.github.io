Array.from( document.querySelectorAll( 'a' ) ).forEach( a => {
    a.classList.add( location.hostname === a.hostname || !a.hostname.length ? 'is-internal-link' : 'is-external-link' );
});

document.write(`
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="/assets/js/navigation.js"></script>
`);

