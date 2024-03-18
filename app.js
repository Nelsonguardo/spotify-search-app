
// Evento de clic para cerrar el modal
document.querySelector('.close').addEventListener('click', function () {
    // Ocultar el modal
    document.getElementById('modal').style.display = 'none';

    // Pausar el audio si está reproduciéndose
    const audioPlayer = document.querySelector('audio');
    if (audioPlayer) {
        audioPlayer.pause();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.getElementById('modal').style.display = 'none';

        // Pausar el audio si está reproduciéndose
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer) {
            audioPlayer.pause();
        }
    }
});

// Cierra el modal cuando el usuario hace clic fuera de él
window.onclick = function (event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';

        // Pausar el audio si está reproduciéndose
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer) {
            audioPlayer.pause();
        }
    }
};

