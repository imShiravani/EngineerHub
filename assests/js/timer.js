let stopwatchInterval = null;
let stopwatchTime = 0;
let isStopwatchRunning = false;
let laps = [];

let timerInterval = null;
let timerRemaining = 0;
let isTimerRunning = false;
let timerEndTime = null;

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let centiseconds = Math.floor((ms % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

function formatTimer(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    let display = document.getElementById('stopwatchDisplay');
    if (display) display.innerText = formatTime(stopwatchTime);
}

function updateTimerDisplay() {
    let display = document.getElementById('timerDisplay');
    if (display) display.innerText = formatTimer(timerRemaining);
}

function saveStopwatchState() {
    localStorage.setItem('stopwatch_time', stopwatchTime);
    localStorage.setItem('stopwatch_running', isStopwatchRunning);
    if (isStopwatchRunning && stopwatchInterval) {
        localStorage.setItem('stopwatch_start_time', Date.now() - stopwatchTime);
    }
    localStorage.setItem('laps', JSON.stringify(laps));
}

function loadStopwatchState() {
    let savedTime = localStorage.getItem('stopwatch_time');
    if (savedTime) stopwatchTime = parseInt(savedTime);
    let savedRunning = localStorage.getItem('stopwatch_running');
    if (savedRunning === 'true') {
        let startTime = localStorage.getItem('stopwatch_start_time');
        if (startTime) {
            let elapsed = Date.now() - parseInt(startTime);
            stopwatchTime = parseInt(savedTime) + elapsed;
            startStopwatch();
        }
    }
    let savedLaps = localStorage.getItem('laps');
    if (savedLaps) laps = JSON.parse(savedLaps);
    updateStopwatchDisplay();
    renderLaps();
}

function saveTimerState() {
    localStorage.setItem('timer_remaining', timerRemaining);
    localStorage.setItem('timer_running', isTimerRunning);
    if (isTimerRunning && timerEndTime) {
        localStorage.setItem('timer_end_time', timerEndTime);
    }
}

function loadTimerState() {
    let savedRemaining = localStorage.getItem('timer_remaining');
    if (savedRemaining) timerRemaining = parseInt(savedRemaining);
    let savedRunning = localStorage.getItem('timer_running');
    if (savedRunning === 'true') {
        let endTime = localStorage.getItem('timer_end_time');
        if (endTime) {
            let remaining = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
            if (remaining > 0) {
                timerRemaining = remaining;
                startTimer(false);
            } else {
                timerRemaining = 0;
                isTimerRunning = false;
            }
        }
    }
    updateTimerDisplay();
    renderHistory();
}

function startStopwatch() {
    if (isStopwatchRunning) return;
    isStopwatchRunning = true;
    let start = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - start;
        updateStopwatchDisplay();
        saveStopwatchState();
    }, 10);
    saveStopwatchState();
}

function pauseStopwatch() {
    if (!isStopwatchRunning) return;
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    saveStopwatchState();
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchTime = 0;
    laps = [];
    updateStopwatchDisplay();
    renderLaps();
    saveStopwatchState();
}

function recordLap() {
    if (!isStopwatchRunning && stopwatchTime === 0) return;
    let lapTime = formatTime(stopwatchTime);
    laps.unshift(lapTime);
    renderLaps();
    saveStopwatchState();
}

function renderLaps() {
    const container = document.getElementById('lapsList');
    if (!container) return;
    if (laps.length === 0) {
        container.innerHTML = `<div class="lap-empty">⏱️ ${currentLang === 'fa' ? 'هنوز لاپی ثبت نشده است' : 'No laps recorded yet'}</div>`;
        return;
    }
    let html = '';
    laps.forEach((lap, idx) => {
        const lapNumber = laps.length - idx;
        html += `
            <div class="lap-card">
                <div class="lap-number">${currentLang === 'fa' ? 'لاپ' : 'Lap'} ${lapNumber}</div>
                <div class="lap-time">${lap}</div>
                <div class="lap-icon">⏱️</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function startTimer(resetInput) {
    if (timerInterval) clearInterval(timerInterval);
    if (resetInput !== false) {
        let hours = parseInt(document.getElementById('timerHours').value) || 0;
        let minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        let seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        timerRemaining = hours * 3600 + minutes * 60 + seconds;
        if (timerRemaining <= 0) return;
    }
    if (timerRemaining <= 0) return;
    isTimerRunning = true;
    timerEndTime = Date.now() + timerRemaining * 1000;
    timerInterval = setInterval(() => {
        let remaining = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
        timerRemaining = remaining;
        updateTimerDisplay();
        saveTimerState();
        if (remaining <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerInterval = null;
            notifyTimerEnd();
            addToHistory();
            timerRemaining = 0;
            updateTimerDisplay();
            saveTimerState();
        }
    }, 200);
    saveTimerState();
}

function pauseTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerInterval = null;
    saveTimerState();
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemaining = 0;
    let hourInp = document.getElementById('timerHours');
    let minInp = document.getElementById('timerMinutes');
    let secInp = document.getElementById('timerSeconds');
    if (hourInp) hourInp.value = 0;
    if (minInp) minInp.value = 0;
    if (secInp) secInp.value = 0;
    updateTimerDisplay();
    saveTimerState();
}

function notifyTimerEnd() {
    if ('vibrate' in navigator) navigator.vibrate(200);
    try {
        let context = new(window.AudioContext || window.webkitAudioContext)();
        let oscillator = context.createOscillator();
        let gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.frequency.value = 880;
        gain.gain.value = 0.3;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
        oscillator.stop(context.currentTime + 1);
    } catch (e) {}
    alert(currentLang === 'fa' ? 'زمان تایمر به پایان رسید!' : 'Timer finished!');
}

function addToHistory() {
    let history = JSON.parse(localStorage.getItem('timerHistory') || '[]');
    let hours = parseInt(document.getElementById('timerHours').value) || 0;
    let minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    let seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds === 0) return;
    let now = new Date();
    let persianDate = new Intl.DateTimeFormat('fa-IR').format(now);
    history.unshift({ time: formatTimer(totalSeconds), date: persianDate });
    if (history.length > 20) history.pop();
    localStorage.setItem('timerHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    let history = JSON.parse(localStorage.getItem('timerHistory') || '[]');
    if (history.length === 0) {
        container.innerHTML = `<div class="lap-empty">📭 ${currentLang === 'fa' ? 'تاریخچه خالی است' : 'History is empty'}</div>`;
        return;
    }
    container.innerHTML = history.map(item => `<div class="lap-card"><div class="lap-number">${item.time}</div><div class="lap-time">${item.date}</div><div class="lap-icon">⏲️</div></div>`).join('');
}

function buildTimerTool() {
    const container = document.getElementById('widgetContainer');
    container.innerHTML = `
        <div class="timer-container">
            <h2>${translations[currentLang].tool_timer_title || '⏱️ کرنومتر و تایمر'}</h2>
            <div class="tabs">
                <button class="tab-btn active" data-tab="stopwatch">⏱️ ${currentLang === 'fa' ? 'زمان‌سنج پیشرفته' : 'Advanced Stopwatch'}</button>
                <button class="tab-btn" data-tab="timer">⏲️ ${currentLang === 'fa' ? 'شمارش معکوس هوشمند' : 'Smart Countdown'}</button>
            </div>
            <div id="stopwatchPanel" class="panel active">
                <div class="time-display" id="stopwatchDisplay">00:00:00.00</div>
                <div class="button-group">
                    <button class="timer-btn" id="swStart">▶ ${currentLang === 'fa' ? 'شروع' : 'Start'}</button>
                    <button class="timer-btn" id="swPause">⏸ ${currentLang === 'fa' ? 'توقف' : 'Pause'}</button>
                    <button class="timer-btn warning" id="swLap">🔄 ${currentLang === 'fa' ? 'ثبت دور (لاپ)' : 'Record Lap'}</button>
                    <button class="timer-btn" id="swReset">🔁 ${currentLang === 'fa' ? 'بازنشانی' : 'Reset'}</button>
                </div>
                <div class="lap-list" id="lapsList">
                    <div class="lap-empty">⏱️ ${currentLang === 'fa' ? 'هنوز لاپی ثبت نشده است' : 'No laps recorded yet'}</div>
                </div>
            </div>
            <div id="timerPanel" class="panel">
                <div class="time-display" id="timerDisplay">00:00:00</div>
                <div class="timer-input-group">
                    <input type="number" id="timerHours" min="0" max="23" value="0" placeholder="${currentLang === 'fa' ? 'ساعت' : 'Hours'}">
                    <span>:</span>
                    <input type="number" id="timerMinutes" min="0" max="59" value="5" placeholder="${currentLang === 'fa' ? 'دقیقه' : 'Minutes'}">
                    <span>:</span>
                    <input type="number" id="timerSeconds" min="0" max="59" value="0" placeholder="${currentLang === 'fa' ? 'ثانیه' : 'Seconds'}">
                </div>
                <div class="button-group">
                    <button class="timer-btn" id="timerStart">▶ ${currentLang === 'fa' ? 'شروع' : 'Start'}</button>
                    <button class="timer-btn" id="timerPause">⏸ ${currentLang === 'fa' ? 'توقف' : 'Pause'}</button>
                    <button class="timer-btn" id="timerReset">🔁 ${currentLang === 'fa' ? 'بازنشانی' : 'Reset'}</button>
                </div>
                <div class="lap-list" id="historyList"></div>
                <button class="clear-history" id="clearHistory">🗑️ ${currentLang === 'fa' ? 'پاک کردن تاریخچه' : 'Clear history'}</button>
            </div>
        </div>
    `;

    document.getElementById('swStart').onclick = startStopwatch;
    document.getElementById('swPause').onclick = pauseStopwatch;
    document.getElementById('swLap').onclick = recordLap;
    document.getElementById('swReset').onclick = resetStopwatch;

    document.getElementById('timerStart').onclick = () => {
        let h = parseInt(document.getElementById('timerHours').value) || 0;
        let m = parseInt(document.getElementById('timerMinutes').value) || 0;
        let s = parseInt(document.getElementById('timerSeconds').value) || 0;
        let total = h * 3600 + m * 60 + s;
        if (total > 0) {
            timerRemaining = total;
            updateTimerDisplay();
            startTimer(true);
        }
    };
    document.getElementById('timerPause').onclick = pauseTimer;
    document.getElementById('timerReset').onclick = resetTimer;
    document.getElementById('clearHistory').onclick = () => {
        localStorage.setItem('timerHistory', '[]');
        renderHistory();
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            let tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${tab}Panel`).classList.add('active');
        };
    });

    loadStopwatchState();
    loadTimerState();
    renderLaps();
    renderHistory();

    addBackToHomeButton(container);
}