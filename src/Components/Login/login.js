export class Login extends HTMLElement {
    connectedCallback() {
        // Verifica si estamos en la página de inicio de sesión
        if (window.location.pathname === '/pages/login') {
            this.innerHTML = `
                <div class="button-container">
                    <button id="loginBtn">Iniciar sesión con Spotify</button>
                </div>
            `;

            this.querySelector('#loginBtn').addEventListener('click', () => {
                const clientId = '018fa1bff9944972ac7fb4483127c46a';
                const redirectUri = 'http://127.0.0.1:8080/pages/search?'; // Redirige siempre a la página de inicio de sesión

                // Redirige al usuario a la página de autorización de Spotify
                window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email`;
            });
        }
    }
}

customElements.define('spotify-login', Login);
