window.videoPlayerModule = (function() {
    let videoPlayer, videoWrapper, customControls, ytContainer, ytFrame, historyListEl;
    let hideTimer, isTheaterMode = false;
    let playlist = [];
    let currentVideoIndex = -1;
    let activeTab = 'direct';
    let currentLang = 'fa';

    function t(key) {
        if (key === 'search_placeholder') {
            return currentLang === 'fa' ? '🔍 جستجو در لیست پخش...' : '🔍 Search in playlist...';
        }
        if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][key])
            return translations[currentLang][key];
        const fallback = {
            player_title: { fa: "پلیر پیشرفته ویدیو", en: "Advanced Video Player" },
            url_placeholder: { fa: "لینک ویدیو یا یوتیوب", en: "Video or YouTube URL" },
            sub_placeholder: { fa: "لینک زیرنویس (اختیاری)", en: "Subtitle URL (optional)" },
            add_btn: { fa: "افزودن", en: "Add" },
            play_all: { fa: "پخش لیست", en: "Play All" },
            copy_all: { fa: "کپی همه", en: "Copy All" },
            shuffle: { fa: "درهم‌سازی", en: "Shuffle" },
            delete_all: { fa: "حذف همه", en: "Delete All" },
            tab_movies: { fa: "فیلم‌ها", en: "Movies" },
            tab_youtube: { fa: "یوتیوب", en: "YouTube" },
            empty_list: { fa: "لیست خالی است", en: "List is empty" },
            delete_confirm: { fa: "حذف شود؟", en: "Delete?" },
            delete_tab_confirm: { fa: "همه موارد این تب حذف شوند؟", en: "Delete all items in this tab?" },
            copy_success: { fa: "کپی شد!", en: "Copied!" },
            fetching_title: { fa: "دریافت عنوان...", en: "Fetching title..." },
            new_video: { fa: "ویدیو جدید", en: "New video" }
        };
        return fallback[key] ? fallback[key][currentLang] : key;
    }

    function extractVideoID(url) {
        var match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
        return (match && match[7] && match[7].length === 11) ? match[7] : false;
    }

    async function fetchYouTubeTitle(url) {
        try {
            var res = await fetch('https://noembed.com/embed?url=' + encodeURIComponent(url));
            var data = await res.json();
            return data.title || null;
        } catch (e) { return null; }
    }

    function formatTime(s) {
        if (isNaN(s)) return "00:00:00";
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = Math.floor(s % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function saveHistory() { localStorage.setItem('videoHistory', JSON.stringify(playlist)); }

    function loadSubtitle(url, format) {
        if (!videoPlayer) return;
        var tracks = videoPlayer.querySelectorAll('track');
        for (var i = 0; i < tracks.length; i++) tracks[i].remove();
        if (url && format === 'vtt') {
            var track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = currentLang === 'fa' ? 'زیرنویس' : 'Subtitle';
            track.srclang = currentLang === 'fa' ? 'fa' : 'en';
            track.src = url;
            track.default = true;
            videoPlayer.appendChild(track);
        }
    }

    function resetIdleTimer() {
        if (!document.fullscreenElement && !isTheaterMode) return;
        clearTimeout(hideTimer);
        if (customControls) customControls.classList.add('show-controls');
        hideTimer = setTimeout(function() {
            if (customControls && !customControls.matches(':hover'))
                customControls.classList.remove('show-controls');
            else resetIdleTimer();
        }, 5000);
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function createCard(videoData, index, container) {
        var card = document.createElement('div');
        card.className = 'history-card' + (index === currentVideoIndex ? ' active' : '');
        var isYt = videoData.type === 'youtube';
        var icon = isYt ? '📺' : '🎬';
        card.innerHTML = '<div class="history-details">' +
            '<h3>' + icon + ' ' + escapeHtml(videoData.fileName) + '</h3>' +
            '<small>' + formatTime(videoData.progress || 0) + ' / ' + formatTime(videoData.duration || 0) + '</small>' +
            '</div>' +
            '<div class="actions d-flex gap-2">' +
            '<button class="btn btn-primary play-single">▶️</button>' +
            '<button class="btn btn-warning copy-link" title="' + t('copy_all') + '">📋</button>' +
            '<button class="btn btn-danger delete-item" title="' + t('delete_confirm') + '">🗑️</button>' +
            '</div>';
        container.appendChild(card);

        card.querySelector('.play-single').onclick = function() { playVideo(index); };
        card.querySelector('.copy-link').onclick = function() {
            navigator.clipboard.writeText(videoData.url).then(function() {
                var btn = card.querySelector('.copy-link');
                var orig = btn.innerHTML;
                btn.innerHTML = '✅';
                setTimeout(function() { btn.innerHTML = orig; }, 1000);
            });
        };
        card.querySelector('.delete-item').onclick = function() {
            if (confirm(t('delete_confirm'))) {
                playlist.splice(index, 1);
                saveHistory();
                loadHistory();
                if (currentVideoIndex === index) {
                    videoPlayer.pause();
                    videoPlayer.removeAttribute('src');
                    if (ytFrame) ytFrame.src = "";
                    currentVideoIndex = -1;
                } else if (currentVideoIndex > index) currentVideoIndex--;
            }
        };
    }

    function loadHistory() {
        if (!historyListEl) return;
        var saved = localStorage.getItem('videoHistory');
        playlist = saved ? JSON.parse(saved) : [];
        historyListEl.innerHTML = '';
        var filtered = [];
        for (var i = 0; i < playlist.length; i++) {
            var item = playlist[i];
            var type = item.type || 'direct';
            if (type === activeTab) filtered.push(item);
        }
        if (filtered.length === 0) {
            historyListEl.innerHTML = '<div style="text-align:center; padding:30px; color:#aaa;">' + t('empty_list') + '</div>';
            return;
        }
        for (var j = 0; j < filtered.length; j++) {
            var originalIndex = playlist.indexOf(filtered[j]);
            createCard(filtered[j], originalIndex, historyListEl);
        }
    }

    function playVideo(index) {
        if (index < 0 || index >= playlist.length) return;
        currentVideoIndex = index;
        var vid = playlist[index];
        var ytId = extractVideoID(vid.url);
        if (vid.type === 'youtube' && ytId) {
            videoPlayer.pause();
            videoPlayer.style.display = 'none';
            if (customControls) customControls.style.display = 'none';
            ytContainer.style.display = 'block';
            ytFrame.src = 'https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0&controls=1';
        } else {
            ytContainer.style.display = 'none';
            ytFrame.src = "";
            videoPlayer.style.display = 'block';
            if (customControls) customControls.style.display = 'flex';
            videoPlayer.src = vid.url;
            loadSubtitle(vid.subtitleUrl, vid.subtitleFormat);
            videoPlayer.play().catch(function(e) { console.warn("Play error:", e); });
        }
        loadHistory();
    }

    function switchTab(tab) {
        activeTab = tab;
        var tabDirect = document.getElementById('tabDirect');
        var tabYoutube = document.getElementById('tabYoutube');
        if (tabDirect && tabYoutube) {
            if (tab === 'direct') {
                tabDirect.classList.add('active');
                tabYoutube.classList.remove('active');
            } else {
                tabYoutube.classList.add('active');
                tabDirect.classList.remove('active');
            }
        }
        loadHistory();
    }

    function setLanguage(lang) {
        currentLang = lang;
        var h1 = document.querySelector('.video-player-modern h1');
        if (h1) h1.innerHTML = '🎬 ' + t('player_title');
        var urlInput = document.getElementById('fileUrl');
        if (urlInput) urlInput.placeholder = t('url_placeholder');
        var subInput = document.getElementById('subtitleUrl');
        if (subInput) subInput.placeholder = t('sub_placeholder');
        var addBtn = document.querySelector('#linkForm button');
        if (addBtn) addBtn.innerHTML = '➕ ' + t('add_btn');
        var playAllBtn = document.getElementById('playAll');
        if (playAllBtn) playAllBtn.innerHTML = '▶️ ' + t('play_all');
        var copyAllBtn = document.getElementById('copyAll');
        if (copyAllBtn) copyAllBtn.innerHTML = '📋 ' + t('copy_all');
        var shuffleBtn = document.getElementById('shufflePlaylist');
        if (shuffleBtn) shuffleBtn.innerHTML = '🔀 ' + t('shuffle');
        var deleteAllBtn = document.getElementById('deleteAll');
        if (deleteAllBtn) deleteAllBtn.innerHTML = '🗑️ ' + t('delete_all');
        var searchInput = document.getElementById('searchHistory');
        if (searchInput) searchInput.placeholder = t('search_placeholder');
        var tabs = document.querySelectorAll('.video-player-modern .tab-btn');
        if (tabs.length >= 2) {
            tabs[0].innerHTML = '🎬 ' + t('tab_movies');
            tabs[1].innerHTML = '📺 ' + t('tab_youtube');
        }
        var backBtn = document.getElementById('videoPlayerBackBtn');
        if (backBtn) backBtn.innerHTML = (currentLang === 'fa') ? '🏠 خانه' : '🏠 Home';
        loadHistory();
    }

    function build() {
        var container = document.getElementById('widgetContainer');
        var backText = (currentLang === 'fa') ? '🏠 خانه' : '🏠 Home';
        container.innerHTML = `
            <div class="video-player-modern">
                <div class="main-container" style="position: relative;">
                    <button id="videoPlayerBackBtn" class="back-to-home-btn player-back-btn">${backText}</button>
                    <h1>🎬 ${t('player_title')}</h1>
                    <form id="linkForm" class="row g-3 mb-4">
                        <div class="col-md-5"><input type="url" id="fileUrl" class="form-control" placeholder="${t('url_placeholder')}" required></div>
                        <div class="col-md-5"><input type="url" id="subtitleUrl" class="form-control" placeholder="${t('sub_placeholder')}"></div>
                        <div class="col-md-2"><button type="submit" class="btn btn-primary w-100">➕ ${t('add_btn')}</button></div>
                    </form>
                    <div id="errorMessage" class="text-danger text-center mb-2"></div>
                    <div class="video-wrapper" id="videoWrapper">
                        <video id="videoPlayer"></video>
                        <div id="youtube-frame-container"><iframe id="youtube-frame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                        <div class="custom-controls" id="customControls">
                            <button id="fullscreenBtn" class="btn btn-secondary btn-sm" title="تمام صفحه">🖥️</button>
                            <button id="theaterBtn" class="btn btn-secondary btn-sm" title="حالت تئاتر">🎭</button>
                            <button id="pipBtn" class="btn btn-secondary btn-sm" title="تصویر در تصویر">🖼️</button>
                            <div class="volume-container d-flex align-items-center gap-2">
                                <button id="muteBtn" class="btn btn-secondary btn-sm">🔊</button>
                                <input type="range" id="volumeSlider" class="form-range volume-slider" min="0" max="1" step="0.1" value="1">
                            </div>
                            <button id="forwardBtn" class="btn btn-secondary btn-sm" title="15 ثانیه به جلو">⏩</button>
                            <button id="rewindBtn" class="btn btn-secondary btn-sm" title="15 ثانیه به عقب">⏪</button>
                            <span id="durationDisplay" class="time-display">00:00:00</span>
                            <div class="progress-bar-container" id="progressBar">
                                <div class="progress-bar-filled" id="progressBarFilled"></div>
                            </div>
                            <span id="currentTimeDisplay" class="time-display">00:00:00</span>
                            <select id="speedSelector" class="form-select form-select-sm" style="width: auto;">
                                <option value="0.5">0.5x</option><option value="0.75">0.75x</option><option value="1" selected>1x</option>
                                <option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option>
                            </select>
                            <button id="playPauseBtn" class="btn btn-secondary" title="پخش / وقفه">▶️</button>
                        </div>
                    </div>
                    <div class="toolbar">
                        <button id="playAll" class="btn btn-success">▶️ ${t('play_all')}</button>
                        <button id="copyAll" class="btn btn-warning">📋 ${t('copy_all')}</button>
                        <button id="shufflePlaylist" class="btn btn-info">🔀 ${t('shuffle')}</button>
                        <button id="deleteAll" class="btn btn-danger">🗑️ ${t('delete_all')}</button>
                    </div>
                    <div class="history-section">
                        <div class="input-group mb-3">
                            <span class="input-group-text">🔍</span>
                            <input type="text" id="searchHistory" class="form-control" placeholder="${t('search_placeholder')}">
                        </div>
                        <div class="custom-tabs">
                            <button class="tab-btn active" id="tabDirect">🎬 ${t('tab_movies')}</button>
                            <button class="tab-btn" id="tabYoutube">📺 ${t('tab_youtube')}</button>
                        </div>
                        <div id="historyList"></div>
                    </div>
                </div>
            </div>
        `;

        videoPlayer = document.getElementById('videoPlayer');
        videoWrapper = document.getElementById('videoWrapper');
        customControls = document.getElementById('customControls');
        ytContainer = document.getElementById('youtube-frame-container');
        ytFrame = document.getElementById('youtube-frame');
        historyListEl = document.getElementById('historyList');

        document.getElementById('videoPlayerBackBtn').onclick = function() { if (typeof switchTool !== 'undefined') switchTool('home'); };
        loadHistory();

        document.getElementById('linkForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            var url = document.getElementById('fileUrl').value;
            var subUrl = document.getElementById('subtitleUrl').value;
            if (!url) return;
            var ytId = extractVideoID(url);
            var isYt = !!ytId;
            var type = isYt ? 'youtube' : 'direct';
            var fileName = isYt ? t('fetching_title') : (decodeURIComponent(url.split('/').pop().split('?')[0]) || t('new_video'));
            var newItem = { fileName, url, subtitleUrl: subUrl, subtitleFormat: subUrl ? subUrl.split('.').pop().toLowerCase() : '', progress: 0, duration: 0, type };
            playlist.push(newItem);
            saveHistory();
            if (isYt) {
                var title = await fetchYouTubeTitle(url);
                if (title) {
                    playlist[playlist.length - 1].fileName = title;
                    saveHistory();
                }
            }
            switchTab(type);
            playVideo(playlist.length - 1);
            document.getElementById('linkForm').reset();
        });

        document.getElementById('tabDirect').onclick = function() { switchTab('direct'); };
        document.getElementById('tabYoutube').onclick = function() { switchTab('youtube'); };
        document.getElementById('playAll').onclick = function() {
            for (var i = 0; i < playlist.length; i++) {
                if ((playlist[i].type || 'direct') === activeTab) { playVideo(i); break; }
            }
        };
        document.getElementById('deleteAll').onclick = function() {
            if (confirm(t('delete_tab_confirm'))) {
                var newList = [];
                for (var i = 0; i < playlist.length; i++) {
                    if ((playlist[i].type || 'direct') !== activeTab) newList.push(playlist[i]);
                }
                playlist = newList;
                saveHistory();
                loadHistory();
                videoPlayer.pause();
                videoPlayer.removeAttribute('src');
                if (ytFrame) ytFrame.src = "";
                currentVideoIndex = -1;
            }
        };
        document.getElementById('copyAll').onclick = function() {
            var urls = [];
            for (var i = 0; i < playlist.length; i++) {
                if ((playlist[i].type || 'direct') === activeTab) urls.push(playlist[i].url);
            }
            navigator.clipboard.writeText(urls.join('\n'));
        };
        document.getElementById('shufflePlaylist').onclick = function() {
            for (var i = playlist.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = playlist[i];
                playlist[i] = playlist[j];
                playlist[j] = temp;
            }
            currentVideoIndex = -1;
            saveHistory();
            loadHistory();
        };
        var searchInput = document.getElementById('searchHistory');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                var term = e.target.value.toLowerCase();
                var cards = document.querySelectorAll('.video-player-modern .history-card');
                for (var i = 0; i < cards.length; i++) {
                    var text = cards[i].querySelector('h3').textContent.toLowerCase();
                    cards[i].style.display = text.includes(term) ? 'flex' : 'none';
                }
            });
        }

        var playPauseBtn = document.getElementById('playPauseBtn');
        playPauseBtn.onclick = function() { videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); };
        videoPlayer.onplay = function() { playPauseBtn.innerHTML = '⏸️'; };
        videoPlayer.onpause = function() { playPauseBtn.innerHTML = '▶️'; };
        videoWrapper.onclick = function(e) {
            if (e.target.closest('.custom-controls')) return;
            if (ytContainer.style.display === 'block') return;
            videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
        };
        document.getElementById('rewindBtn').onclick = function() { videoPlayer.currentTime = Math.max(videoPlayer.currentTime - 15, 0); };
        document.getElementById('forwardBtn').onclick = function() { videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 15, videoPlayer.duration); };
        var muteBtn = document.getElementById('muteBtn');
        muteBtn.onclick = function() {
            videoPlayer.muted = !videoPlayer.muted;
            muteBtn.innerHTML = videoPlayer.muted ? '🔇' : '🔊';
        };
        var volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.oninput = function(e) {
            videoPlayer.volume = e.target.value;
            videoPlayer.muted = false;
            muteBtn.innerHTML = '🔊';
        };
        document.getElementById('speedSelector').onchange = function(e) { videoPlayer.playbackRate = e.target.value; };
        document.getElementById('pipBtn').onclick = function() {
            if (document.pictureInPictureElement) document.exitPictureInPicture();
            else videoPlayer.requestPictureInPicture();
        };
        var progressBar = document.getElementById('progressBar');
        progressBar.onclick = function(e) {
            var rect = progressBar.getBoundingClientRect();
            var percent = (e.clientX - rect.left) / rect.width;
            videoPlayer.currentTime = percent * videoPlayer.duration;
        };
        videoPlayer.ontimeupdate = function() {
            if (videoPlayer.style.display === 'none') return;
            if (currentVideoIndex !== -1 && playlist[currentVideoIndex]) {
                playlist[currentVideoIndex].progress = videoPlayer.currentTime;
                playlist[currentVideoIndex].duration = videoPlayer.duration;
                saveHistory();
                var activeCard = document.querySelector('.video-player-modern .history-card.active');
                if (activeCard) {
                    var small = activeCard.querySelector('small');
                    if (small) small.textContent = formatTime(videoPlayer.currentTime) + ' / ' + formatTime(videoPlayer.duration);
                }
            }
            var fillPercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
            var filled = document.getElementById('progressBarFilled');
            if (filled) filled.style.width = fillPercent + '%';
            var currentSpan = document.getElementById('currentTimeDisplay');
            if (currentSpan) currentSpan.textContent = formatTime(videoPlayer.currentTime);
            var durationSpan = document.getElementById('durationDisplay');
            if (durationSpan) durationSpan.textContent = formatTime(videoPlayer.duration);
        };

        var fullscreenBtn = document.getElementById('fullscreenBtn');
        fullscreenBtn.onclick = function() {
            if (document.fullscreenElement) document.exitFullscreen();
            else videoWrapper.requestFullscreen();
        };
        document.addEventListener('fullscreenchange', function() {
            if (document.fullscreenElement) {
                fullscreenBtn.innerHTML = '🖥️';
                resetIdleTimer();
            } else {
                fullscreenBtn.innerHTML = '🖥️';
                if (customControls) customControls.classList.remove('show-controls');
            }
        });
        var theaterBtnElem = document.getElementById('theaterBtn');
        theaterBtnElem.onclick = function() {
            isTheaterMode = !isTheaterMode;
            document.body.classList.toggle('theater-mode');
            if (isTheaterMode) {
                theaterBtnElem.innerHTML = '🎭';
                resetIdleTimer();
            } else {
                theaterBtnElem.innerHTML = '🎭';
                if (customControls) customControls.classList.remove('show-controls');
            }
        };
        videoWrapper.addEventListener('mousemove', function() {
            if (customControls && !customControls.matches(':hover')) resetIdleTimer();
        });
        customControls.addEventListener('mouseenter', function() {
            clearTimeout(hideTimer);
            customControls.classList.add('show-controls');
        });
        customControls.addEventListener('mouseleave', resetIdleTimer);

        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT') return;
            resetIdleTimer();
            if (ytContainer.style.display === 'block') return;
            switch (e.code) {
                case 'Space':
                case 'KeyP':
                    e.preventDefault();
                    playPauseBtn.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    document.getElementById('forwardBtn').click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    document.getElementById('rewindBtn').click();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    fullscreenBtn.click();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    theaterBtnElem.click();
                    break;
                case 'Escape':
                    if (document.fullscreenElement || isTheaterMode) {
                        if (document.fullscreenElement) document.exitFullscreen();
                        else if (isTheaterMode) theaterBtnElem.click();
                    }
                    break;
            }
        });
    }

    return { build: build, setLanguage: setLanguage };
})();

function buildVideoPlayerWidget() {
    window.videoPlayerModule.build();
    window.videoPlayerModule.setLanguage(currentLang);
}