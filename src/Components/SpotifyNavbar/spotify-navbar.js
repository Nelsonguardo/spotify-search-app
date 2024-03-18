class SpotifyNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const accessToken = localStorage.getItem('spotifyAccessToken') || this.getAccessTokenFromUrl();
        const currentPath = window.location.pathname;

        const homeActive = currentPath === '/';
        const searchActive = currentPath.startsWith('/pages/search'); // Verificar si la ruta comienza con '/pages/search'
        const loginActive = currentPath === '/pages/login';

        const navContent = accessToken ? `
            <li><a href="/" class="${homeActive ? 'active' : ''}"><i class="fas fa-home"></i></a></li>
            <li><a href="/pages/search" class="${searchActive ? 'active' : ''}"><i class="fas fa-search"></i></a></li>
            <li><a href="#" id="logout"><i class="fas fa-sign-out-alt"></i></a></li>
        ` : `
            <li><a href="/" class="${homeActive ? 'active' : ''}"><i class="fas fa-home"></i></a></li>
            <li><a href="/pages/login" class="${loginActive ? 'active' : ''}"><i class="fas fa-sign-in-alt"></i></a></li>
        `;

        this.innerHTML = `
            <nav>
                <ul>
                    ${navContent}
                </ul>
            </nav>
        `;

        if (accessToken) {
            this.querySelector('#logout').addEventListener('click', () => {
                localStorage.removeItem('spotifyAccessToken');
                window.location.href = '/pages/login';
            });
        }
    }

    getAccessTokenFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        if (accessToken) {
            localStorage.setItem('spotifyAccessToken', accessToken);
            // Remover el token de la URL para evitar mostrarlo nuevamente
            window.history.replaceState({}, document.title, window.location.pathname);
            return accessToken;
        }
        return null;
    }
}

customElements.define('spotify-navbar', SpotifyNavbar);
