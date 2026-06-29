const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");
const stopAlarmBtn = document.getElementById("stopAlarmBtn");

const audio = document.getElementById("alarmAudio");

let remaining = 0;
let timer = null;
let alarmOscillator = null;

function updateDisplay() {

    let h = Math.floor(remaining / 3600);
    let m = Math.floor((remaining % 3600) / 60);
    let s = remaining % 60;

    display.textContent =
        String(h).padStart(2, '0') + ":" +
        String(m).padStart(2, '0') + ":" +
        String(s).padStart(2, '0');
}

function tick() {

    if (remaining <= 0) {
        clearInterval(timer);
        timer = null;
        playAlarm();
        return;
    }

    remaining--;
    updateDisplay();

}

function startTimer() {

    clearInterval(timer);

    let h = parseInt(hoursInput.value) || 0;
    let m = parseInt(minutesInput.value) || 0;
    let s = parseInt(secondsInput.value) || 0;

    remaining = h * 3600 + m * 60 + s;

    if (remaining <= 0) {
        alert("Enter a valid time.");
        return;
    }

    updateDisplay();

    timer = setInterval(tick, 1000);

}

function pauseTimer() {

    clearInterval(timer);

}

function resumeTimer() {

    if (timer || remaining <= 0)
        return;

    timer = setInterval(tick, 1000);

}

function resetTimer() {

    clearInterval(timer);

    remaining = 0;

    updateDisplay();

    stopAlarm();

}

function playAlarm() {

    audio.play().catch(() => {

        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        alarmOscillator = ctx.createOscillator();

        const gain = ctx.createGain();

        alarmOscillator.type = "square";

        alarmOscillator.frequency.value = 800;

        gain.gain.value = .2;

        alarmOscillator.connect(gain);

        gain.connect(ctx.destination);

        alarmOscillator.start();

    });

}

function stopAlarm() {

    audio.pause();
    audio.currentTime = 0;

    if (alarmOscillator) {
        alarmOscillator.stop();
        alarmOscillator = null;
    }

}

updateDisplay();

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resumeBtn.onclick = resumeTimer;
resetBtn.onclick = resetTimer;
stopAlarmBtn.onclick = stopAlarm;