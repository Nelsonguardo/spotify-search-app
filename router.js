// Función para cargar el contenido según la ruta
function loadContent() {
    const path = window.location.pathname;
    const contentDiv = document.getElementById('content');

    if (path === '/') {
        // Redireccionar automáticamente a la página de login
        window.location.href = '/pages/login';
    } else if (path === '/pages/login') {
        // Cargar el contenido de login
        contentDiv.innerHTML = '<iframe src="pages/login.html" frameborder="0"></iframe>';
    } else if (path === '/pages/search?') {
        // Cargar el contenido de búsqueda
        contentDiv.innerHTML = '<iframe src="pages/search.html" frameborder="0"></iframe>';
    } else {
        // Manejar rutas desconocidas
        contentDiv.innerHTML = '404 - Página no encontrada';
    }
}

// Cargar el contenido inicial al cargar la página
window.onload = loadContent;

// Manejar cambios de ruta
window.onpopstate = loadContent;
