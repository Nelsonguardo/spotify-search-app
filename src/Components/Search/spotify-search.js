export class SpotifySearch extends HTMLElement {
    constructor() {
        super();
        this.currentPage = 1;
        this.resultsPerPage = 10;
        this.accessToken = null; // Variable para almacenar el token de acceso
    }

    connectedCallback() {
        // Extraer el token de acceso de la URL y guardarlo en el almacenamiento local si está presente
        const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
        this.accessToken = fragmentParams.get('access_token');
        if (this.accessToken) {
            localStorage.setItem('spotifyAccessToken', this.accessToken);
        }

        this.innerHTML = `
            <h1>Búsqueda de Spotify</h1>
            <form id="searchForm">
                <input type="text" id="searchInput" placeholder="Buscar una canción, artista o álbum">
                <button type="submit">Buscar</button>
            </form>
            <div id="searchResults"></div>
            <div id="pagination"></div>
        `;

        this.form = this.querySelector('#searchForm');
        this.input = this.querySelector('#searchInput');
        this.resultsDiv = this.querySelector('#searchResults');
        this.paginationDiv = this.querySelector('#pagination');

        this.form.addEventListener('submit', this.handleSearch.bind(this));

        // Crear el select para cambiar el número de resultados mostrados
        this.createResultCountSelect();
    }

    createResultCountSelect() {
        const selectHTML = `
            <label for="resultCount">Mostrar:</label>
            <select id="resultCount" class="select-result-count">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        `;
        this.resultsDiv.insertAdjacentHTML('beforebegin', selectHTML);

        // Agregar el evento para cambiar el número de resultados mostrados
        this.resultsDiv.previousElementSibling.addEventListener('change', (event) => {
            const resultCount = parseInt(event.target.value);
            this.resultsPerPage = resultCount;
            this.displayResults(this.lastSearchResults);
        });
    }

    async handleSearch(event) {
        event.preventDefault();
        const query = this.input.value.trim();
        if (query !== '') {
            try {
                const results = await this.searchSpotify(query);
                if (results) {
                    this.lastSearchResults = results; // Guardar los resultados para futuras referencias
                    this.displayResults(results);
                } else {
                    this.showErrorAlert('Error al buscar en Spotify. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                this.showErrorAlert('Error al buscar en Spotify. Por favor, inténtalo de nuevo.');
                console.error('Error al buscar en Spotify:', error);
            }
        } else {
            this.showErrorAlert('Por favor, ingresa una consulta de búsqueda.');
        }
    }

    async searchSpotify(query) {
        try {
            const accessToken = localStorage.getItem('spotifyAccessToken');
            if (!accessToken) {
                throw new Error('No se ha iniciado sesión en Spotify.');
            }

            const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al buscar datos en la API de Spotify');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al buscar en Spotify:', error);
            throw error; // Propaga el error para que sea manejado en el método handleSearch
        }
    }

    displayResults(results) {
        this.resultsDiv.innerHTML = '';
        this.paginationDiv.innerHTML = '';

        if (results && results.tracks && results.tracks.items.length > 0) {
            const totalResults = results.tracks.items.length;
            const totalPages = Math.ceil(totalResults / this.resultsPerPage);

            const startIndex = (this.currentPage - 1) * this.resultsPerPage;
            const endIndex = startIndex + this.resultsPerPage;
            const tracks = results.tracks.items.slice(startIndex, endIndex);

            const ul = document.createElement('ul');
            ul.classList.add('results-list'); // Agrega una clase a la lista
            tracks.forEach(track => {
                const li = document.createElement('li');
                li.classList.add('result-item'); // Agrega una clase al elemento li
            
                const img = document.createElement('img');
                img.src = track.album.images[2].url; // Establece la URL de la imagen
                img.classList.add('album-image'); // Agrega una clase a la imagen
                img.alt = track.name + ' Album Artwork'; // Establece un texto alternativo para la imagen
                li.appendChild(img);

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('info-div'); // Agrega una clase al div de información
                const nameSpan = document.createElement('span');
                nameSpan.classList.add('track-name'); // Agrega una clase al span del nombre de la pista
                nameSpan.textContent = track.name;
                infoDiv.appendChild(nameSpan);
            
                const artistSpan = document.createElement('span');
                artistSpan.classList.add('artist-name'); // Agrega una clase al span del nombre del artista
                artistSpan.textContent = track.artists[0].name;
                infoDiv.appendChild(artistSpan);

                li.appendChild(infoDiv);
            
                li.addEventListener('click', () => {
                    this.displayDetail(track);
                });
                ul.appendChild(li);
            });
            
            this.resultsDiv.appendChild(ul);

            // Mostrar la paginación
            this.displayPagination(totalPages);
        } else {
            this.resultsDiv.textContent = 'No se encontraron resultados';
        }
    }

    displayPagination(totalPages) {
        const previousPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
        const nextPage = this.currentPage < totalPages ? this.currentPage + 1 : totalPages;

        const paginationHTML = `
            <button class="pagination-button" data-page="${previousPage}">Anterior</button>
            <span class="pagination-text">Página ${this.currentPage} de ${totalPages}</span>
            <button class="pagination-button" data-page="${nextPage}">Siguiente</button>
        `;
        this.paginationDiv.innerHTML = paginationHTML;

        // Agregar eventos a los botones de paginación
        const buttons = this.paginationDiv.querySelectorAll('.pagination-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const page = parseInt(button.dataset.page);
                this.currentPage = page;
                this.displayResults(this.lastSearchResults);
            });
        });
    }

    displayDetail(item) {
        let detailMessage = `<div class="detail-container">`; // Contenedor para centrar el contenido
        detailMessage += `<h2>Detalles</h2>`;
        detailMessage += `<p><strong>Nombre:</strong> ${item.name}</p>`;

        // Verifica si es una canción
        if (item.type === 'track') {
            detailMessage += `<p><strong>Artistas:</strong> ${item.artists.map(artist => artist.name).join(', ')}</p>`;
            detailMessage += `<p><strong>Álbum:</strong> ${item.album.name}</p>`;
            detailMessage += `<img src="${item.album.images[1].url}" alt="Portada del álbum">`;

            // URL del fragmento de la canción
            const previewUrl = item.preview_url;

            if (previewUrl) {
                // Crear un elemento de audio
                const audioPlayer = new Audio(previewUrl);
                audioPlayer.controls = true; // Mostrar controles de reproducción
                detailMessage += `<p><strong>Reproducir fragmento:</strong></p>`;
                detailMessage += audioPlayer.outerHTML; // Convertir el elemento de audio a HTML
            } else {
                detailMessage += `<p>Este track no tiene un fragmento de audio disponible para reproducir.</p>`;
            }
        }

        detailMessage += `</div>`; // Cierre del contenedor
        // Mostrar los detalles en el modal
        displayModal(detailMessage);
    }

    showErrorAlert(message) {
        showErrorAlert(message);
    }
}

customElements.define('spotify-search', SpotifySearch);

// Muestra el modal con los detalles de la canción seleccionada
function displayModal(detailMessage) {
    document.getElementById('detailMessage').innerHTML = detailMessage;
    document.getElementById('modal').style.display = 'block';
}

// Función para mostrar mensajes de error
function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
    });
}
