Array.from( document.querySelectorAll( 'a' ) ).forEach( a => {
    a.classList.add( location.hostname === a.hostname || !a.hostname.length ? 'is-internal-link' : 'is-external-link' );
})