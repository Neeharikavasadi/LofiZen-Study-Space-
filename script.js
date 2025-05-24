// Get Elements
const backgroundVideo = document.getElementById("backgroundVideo");
const videoSource = document.getElementById("videoSource");
const themeSelector = document.getElementById("themeSelector");
const music = document.getElementById("music");
const musicSource = document.getElementById("musicSource");
const playPauseBtn = document.getElementById("playPauseBtn");
const startTimerBtn = document.getElementById("startFocusTimer");
const pauseTimerBtn = document.getElementById("pauseFocusTimer");
const stopTimerBtn = document.getElementById("stopFocusTimer");
const timerDisplay = document.getElementById("focusTimerDisplay");
const minutesInput = document.getElementById("focusMinutes");
const volumeControl = document.getElementById("volumeControl");
const alarmSound = document.getElementById("alarmSound");
const darkModeToggle = document.getElementById("darkModeToggle");

// Focus Timer Variables
let timerInterval;
let remainingSeconds;
let isTimerRunning = false;
let isPaused = false;

// Logo Animation
window.onload = () => {
    setTimeout(() => {
        document.getElementById("logoGif").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("logoScreen").style.display = "none";
            document.getElementById("staticLogo").style.display = "block";
            document.querySelector(".container").style.display = "block";
            backgroundVideo.style.display = "block";
        }, 1000);
    }, 3000); // Adjust time to match GIF duration
};

// Volume Control
volumeControl.addEventListener("input", () => {
    music.volume = volumeControl.value;
});

// Themes
const themes = {
    blue: { video: "images/bluebg.mp4", music: "images/bluesd.mp3" },
    green: { video: "images/greenbg.mp4", music: "images/greensd.mp3" },
    purple: { video: "images/purplebg.mp4", music: "images/purplesd.mp3" },
    pink: { video: "images/pinkbg.mp4", music: "images/pinksd.mp3" },
    orange: { video: "images/orangebg.mp4", music: "images/orangesd.mp3" }
};

// Theme Selector
themeSelector.addEventListener("change", () => {
    const selectedTheme = themeSelector.value;
    if (themes[selectedTheme]) {
        videoSource.src = themes[selectedTheme].video;
        backgroundVideo.load();
        musicSource.src = themes[selectedTheme].music;
        music.load();
        if (isPlaying) music.play();
    }
});

// Play/Pause Music
let isPlaying = false;
playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        music.pause();
        playPauseBtn.textContent = "▶ Play";
    } else {
        music.play();
        playPauseBtn.textContent = "⏸ Pause";
    }
    isPlaying = !isPlaying;
});

// Focus Timer
startTimerBtn.addEventListener("click", () => {
    const minutes = parseInt(minutesInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
    }
    remainingSeconds = minutes * 60;
    startCountdown();
});

function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    isTimerRunning = true;
    isPaused = false;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerFinished();
        }
    }, 1000);
}

// Pause Timer
pauseTimerBtn.addEventListener("click", () => {
    if (isTimerRunning && !isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
        pauseTimerBtn.textContent = "▶ Resume";
    } else if (isTimerRunning && isPaused) {
        startCountdown();
        pauseTimerBtn.textContent = "⏸ Pause";
    }
});

// Stop Timer
stopTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isPaused = false;
    remainingSeconds = 0;
    updateTimerDisplay();
    pauseTimerBtn.textContent = "⏸ Pause";
});

// Update Timer Display
function updateTimerDisplay() {
    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;
    timerDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Timer Finished - Pause Background Music and Play Notification Sound
function timerFinished() {
    isTimerRunning = false;

    // Pause the background music
    music.pause();
    playPauseBtn.textContent = "▶ Play"; // Update play/pause button text
    isPlaying = false; // Update music state

    // Play the alarm sound
    alarmSound.loop = true; // Enable looping
    alarmSound.play().then(() => {
        // Show an alert box with a stop button
        const stopAlarm = confirm("⏰ Hurry Time's up! Click OK to stop the alarm.");
        if (stopAlarm) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmSound.loop = false;
        }
    }).catch((error) => {
        console.error("Error playing alarm sound:", error);
        alert("Unable to play the alarm sound. Please check your browser settings.");
    });
}

