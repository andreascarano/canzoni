const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const audioPlayer = document.getElementById('audio-player');
const trackSelector = document.getElementById('track-selector');
const shuffleCheckbox = document.createElement('input');
const shuffleLabel = document.createElement('label');

let isPlaying = false;
let isShuffle = false;
let lastClickTime = 0;  // Memorizza l'ora dell'ultimo clic sul pulsante "PRECEDENTE"

// Aggiungi un checkbox per la riproduzione casuale
shuffleCheckbox.type = 'checkbox';
shuffleCheckbox.id = 'shuffle-checkbox';
shuffleLabel.textContent = 'Riproduzione a cazzo di cane';
shuffleLabel.htmlFor = 'shuffle-checkbox';

document.querySelector('.player-controls').appendChild(shuffleCheckbox);
document.querySelector('.player-controls').appendChild(shuffleLabel);

shuffleCheckbox.addEventListener('change', () => {
    isShuffle = shuffleCheckbox.checked;
});

trackSelector.addEventListener('change', () => {
    playSelectedTrack();
});

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = 'APPICCIA';
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = 'CAFFE';
    }
    isPlaying = !isPlaying;
});

stopBtn.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseBtn.textContent = 'APPICCIA';
    isPlaying = false;
});

nextBtn.addEventListener('click', () => {
    playNextTrack();
});

prevBtn.addEventListener('click', () => {
    const currentTime = audioPlayer.currentTime;
    const now = Date.now();

    if (currentTime > 5 && now - lastClickTime > 500) {
        // Se la traccia è oltre i 5 secondi e il clic è avvenuto dopo più di 500ms dall'ultimo
        audioPlayer.currentTime = 0;
    } else {
        // Se la traccia è all'inizio o il clic è rapido, passa alla traccia precedente
        playPreviousTrack();
    }

    lastClickTime = now;
});

audioPlayer.addEventListener('timeupdate', () => {
    currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    progressBar.value = audioPlayer.currentTime;
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationSpan.textContent = formatTime(audioPlayer.duration);
    progressBar.max = audioPlayer.duration;
});

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value;
});

// Aggiungi evento per quando la canzone finisce
audioPlayer.addEventListener('ended', () => {
    playNextTrack();
});

function playSelectedTrack() {
    const selectedTrack = trackSelector.value;
    const audioSource = document.getElementById('audio-source');
    audioSource.src = selectedTrack;
    audioPlayer.load();
    audioPlayer.play();
    playPauseBtn.textContent = 'CAFFE';
    isPlaying = true;
}

function playNextTrack() {
    const options = trackSelector.options;
    let nextIndex;

    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * options.length);
    } else {
        nextIndex = (trackSelector.selectedIndex + 1) % options.length;
    }

    trackSelector.selectedIndex = nextIndex;
    playSelectedTrack();
}

function playPreviousTrack() {
    const options = trackSelector.options;
    let prevIndex = trackSelector.selectedIndex - 1;

    if (prevIndex < 0) {
        prevIndex = options.length - 1;  // Torna all'ultima traccia se sei alla prima
    }

    trackSelector.selectedIndex = prevIndex;
    playSelectedTrack();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
