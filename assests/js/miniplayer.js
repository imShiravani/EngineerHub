let miniPlayerClosedByUser = false;
let lastPlayState = null;
let lastMuteState = null;

function formatTimeMini(sec) {
    if (isNaN(sec)) return '00:00';
    var mins = Math.floor(sec / 60);
    var secs = Math.floor(sec % 60);
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

window.showMiniPlayer = function(title, artist, cover) {
    miniPlayerClosedByUser = false;
    var miniPlayer = document.getElementById('miniPlayer');
    var miniTitle = document.getElementById('miniTitle');
    var miniArtist = document.getElementById('miniArtist');
    var miniCover = document.getElementById('miniCoverImg');
    if (miniTitle) miniTitle.textContent = title || (currentLang === 'fa' ? 'آهنگ در حال پخش' : 'Now playing');
    if (miniArtist) miniArtist.textContent = artist || (currentLang === 'fa' ? 'خواننده' : 'Artist');
    if (miniCover && cover) miniCover.src = cover;
    if (miniPlayer) {
        miniPlayer.style.display = 'block';
        miniPlayer.classList.remove('hide');
    }
    updateMiniPlayerUI(true);
};

window.hideMiniPlayer = function() {
    var miniPlayer = document.getElementById('miniPlayer');
    if (miniPlayer) {
        miniPlayer.classList.add('hide');
        setTimeout(function() { if (miniPlayer.classList.contains('hide')) miniPlayer.style.display = 'none'; }, 300);
    }
};

function updateMiniPlayerUI(force = false) {
    var player = window.globalMusicPlayer;
    if (!player || !player.audio) return;
    var playPauseBtn = document.getElementById('miniPlayPauseBtn');
    var muteBtn = document.getElementById('miniMuteBtn');
    var volumeSlider = document.getElementById('miniVolumeSlider');
    var progressFill = document.getElementById('miniProgressFill');
    var currentSpan = document.getElementById('miniCurrentTime');
    var totalSpan = document.getElementById('miniTotalTime');

    if (volumeSlider) volumeSlider.value = player.audio.volume;
    if (player.audio.duration) {
        var percent = (player.audio.currentTime / player.audio.duration) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (currentSpan) currentSpan.innerText = formatTimeMini(player.audio.currentTime);
        if (totalSpan) totalSpan.innerText = formatTimeMini(player.audio.duration);
    } else {
        if (currentSpan) currentSpan.innerText = '00:00';
        if (totalSpan) totalSpan.innerText = '00:00';
    }

    if (navigator.onLine) {
        let currentPlay = !player.audio.paused;
        let currentMuted = (player.audio.volume === 0);
        if (force || lastPlayState !== currentPlay) {
            if (playPauseBtn) playPauseBtn.innerHTML = currentPlay ? '⏸️' : '▶️';
            lastPlayState = currentPlay;
        }
        if (force || lastMuteState !== currentMuted) {
            if (muteBtn) muteBtn.innerHTML = currentMuted ? '🔇' : '🔊';
            lastMuteState = currentMuted;
        }
    }
}

window.updateMiniPlayerLanguage = function() {
    var player = window.globalMusicPlayer;
    var miniTitle = document.getElementById('miniTitle');
    var miniArtist = document.getElementById('miniArtist');
    if (!player || !player.audio || !player.audio.src || player.audio.paused) {
        if (miniTitle) miniTitle.textContent = currentLang === 'fa' ? 'آهنگ در حال پخش' : 'Now playing';
        if (miniArtist) miniArtist.textContent = currentLang === 'fa' ? 'خواننده' : 'Artist';
        return;
    }
    if (window.currentAlbumObject && window.currentOnlineSongId !== null) {
        var song = window.currentAlbumObject.songs.find(function(s, idx) { return idx == window.currentOnlineSongId; });
        if (song) {
            var newTitle = (currentLang === 'fa') ? song.titleFa : song.titleEn;
            var newArtist = (currentLang === 'fa') ? (song.artistFa || window.currentAlbumObject.artist) : (song.artistEn || window.currentAlbumObject.artistEn);
            if (miniTitle) miniTitle.textContent = newTitle;
            if (miniArtist) miniArtist.textContent = newArtist;
            return;
        }
    }
    if (player.titleSpan && player.artistSpan) {
        if (miniTitle) miniTitle.textContent = player.titleSpan.innerText;
        if (miniArtist) miniArtist.textContent = player.artistSpan.innerText;
    }
};

function updateMiniPlayerIconsForConnection() {
    if (!navigator.onLine) {
        var playPauseBtn = document.getElementById('miniPlayPauseBtn');
        var muteBtn = document.getElementById('miniMuteBtn');
        if (playPauseBtn) playPauseBtn.innerHTML = '▶️';
        if (muteBtn) muteBtn.innerHTML = '🔊';
        lastPlayState = null;
        lastMuteState = null;
    } else {
        lastPlayState = null;
        lastMuteState = null;
        updateMiniPlayerUI(true);
    }
}

window.addEventListener('online', updateMiniPlayerIconsForConnection);
window.addEventListener('offline', updateMiniPlayerIconsForConnection);

function bindPlayerStateEvents() {
    var player = window.globalMusicPlayer;
    if (!player || !player.audio) return;
    player.audio.addEventListener('play', function() { updateMiniPlayerUI(true); });
    player.audio.addEventListener('pause', function() { updateMiniPlayerUI(true); });
    player.audio.addEventListener('volumechange', function() { updateMiniPlayerUI(true); });
}

(function initMiniPlayerControls() {
    document.addEventListener('DOMContentLoaded', function() {
        var playPause = document.getElementById('miniPlayPauseBtn');
        var prevBtn = document.getElementById('miniPrevBtn');
        var nextBtn = document.getElementById('miniNextBtn');
        var repeatBtn = document.getElementById('miniRepeatBtn');
        var closeBtn = document.getElementById('miniCloseBtn');
        var muteBtn = document.getElementById('miniMuteBtn');
        var volumeSlider = document.getElementById('miniVolumeSlider');
        var progressBar = document.getElementById('miniProgressBar');

        if (playPause) {
            playPause.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player && player.audio) {
                    if (player.audio.paused) player.audio.play();
                    else player.audio.pause();
                    updateMiniPlayerUI(true);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player) {
                    if (window.currentAlbumSongs && window.currentAlbumIndex > 0) {
                        var prevIdx = window.currentAlbumIndex - 1;
                        var prevSong = window.currentAlbumSongs[prevIdx];
                        var title = (currentLang === 'fa') ? prevSong.titleFa : prevSong.titleEn;
                        var artist = (currentLang === 'fa') ? prevSong.artistFa : prevSong.artistEn;
                        player.playOnlineSong(prevSong.url, title, artist, window.currentAlbumObject.image, function() { playNextFromAlbum(); });
                        if (typeof updateMainPlayerInfo === 'function') updateMainPlayerInfo(title, artist);
                        var allSongs = document.querySelectorAll('#songsList .song-item');
                        for (var i = 0; i < allSongs.length; i++) {
                            var s = allSongs[i];
                            if (parseInt(s.getAttribute('data-song-idx')) === prevIdx) {
                                if (window.currentlyPlayingSong) window.currentlyPlayingSong.classList.remove('song-playing');
                                if (window.currentlyPlayingSong) {
                                    var oldSpan = window.currentlyPlayingSong.querySelector('.song-play-pause');
                                    if (oldSpan) oldSpan.innerHTML = '▶️';
                                }
                                window.currentlyPlayingSong = s;
                                var playSpan = s.querySelector('.song-play-pause');
                                if (playSpan) playSpan.innerHTML = '⏸️';
                                s.classList.add('song-playing');
                                window.currentAlbumIndex = prevIdx;
                                window.currentOnlineSongId = prevIdx;
                                break;
                            }
                        }
                    } else {
                        player.playPrev();
                    }
                    updateMiniPlayerUI(true);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player) {
                    if (window.currentAlbumSongs && window.currentAlbumIndex !== -1 && window.currentAlbumIndex + 1 < window.currentAlbumSongs.length) {
                        var nextIdx = window.currentAlbumIndex + 1;
                        var nextSong = window.currentAlbumSongs[nextIdx];
                        var title = (currentLang === 'fa') ? nextSong.titleFa : nextSong.titleEn;
                        var artist = (currentLang === 'fa') ? nextSong.artistFa : nextSong.artistEn;
                        player.playOnlineSong(nextSong.url, title, artist, window.currentAlbumObject.image, function() { playNextFromAlbum(); });
                        if (typeof updateMainPlayerInfo === 'function') updateMainPlayerInfo(title, artist);
                        var allSongs = document.querySelectorAll('#songsList .song-item');
                        for (var i = 0; i < allSongs.length; i++) {
                            var s = allSongs[i];
                            if (parseInt(s.getAttribute('data-song-idx')) === nextIdx) {
                                if (window.currentlyPlayingSong) window.currentlyPlayingSong.classList.remove('song-playing');
                                if (window.currentlyPlayingSong) {
                                    var oldSpan = window.currentlyPlayingSong.querySelector('.song-play-pause');
                                    if (oldSpan) oldSpan.innerHTML = '▶️';
                                }
                                window.currentlyPlayingSong = s;
                                var playSpan = s.querySelector('.song-play-pause');
                                if (playSpan) playSpan.innerHTML = '⏸️';
                                s.classList.add('song-playing');
                                window.currentAlbumIndex = nextIdx;
                                window.currentOnlineSongId = nextIdx;
                                break;
                            }
                        }
                    } else {
                        player.playNext();
                    }
                    updateMiniPlayerUI(true);
                }
            });
        }

        if (repeatBtn) {
            repeatBtn.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player) {
                    if (player.repeat === 'off') player.repeat = 'list';
                    else if (player.repeat === 'list') player.repeat = 'one';
                    else player.repeat = 'off';
                    player.updateRepeatIcon();
                    var icon = (player.repeat === 'one') ? '🔂' : '🔁';
                    repeatBtn.innerHTML = icon;
                    player.saveToLocalStorage();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player) {
                    player.audio.pause();
                    player.audio.src = '';
                    player.currentIndex = -1;
                    if (window.currentlyPlayingSong) {
                        var span = window.currentlyPlayingSong.querySelector('.song-play-pause');
                        if (span) span.innerHTML = '▶️';
                        window.currentlyPlayingSong.classList.remove('song-playing');
                    }
                    window.currentAlbumSongs = null;
                    window.currentAlbumIndex = -1;
                    window.currentAlbumObject = null;
                    window.currentlyPlayingSong = null;
                    window.currentOnlineSongId = null;
                    window.hideMiniPlayer();
                    localStorage.removeItem('currentPlayingSong');
                    miniPlayerClosedByUser = true;
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', function() {
                var player = window.globalMusicPlayer;
                if (player && player.audio) {
                    player.audio.muted = !player.audio.muted;
                    if (navigator.onLine) updateMiniPlayerUI(true);
                }
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', function(e) {
                var player = window.globalMusicPlayer;
                if (player && player.audio) {
                    var val = parseFloat(e.target.value);
                    player.audio.volume = val;
                    player.audio.muted = false;
                    if (navigator.onLine && muteBtn) updateMiniPlayerUI(true);
                    if (player.volumeSlider) player.volumeSlider.value = val;
                }
            });
        }

        if (progressBar) {
            progressBar.addEventListener('click', function(e) {
                var player = window.globalMusicPlayer;
                if (player && player.audio && player.audio.duration) {
                    var rect = progressBar.getBoundingClientRect();
                    var percent = (e.clientX - rect.left) / rect.width;
                    if (percent < 0) percent = 0;
                    if (percent > 1) percent = 1;
                    player.audio.currentTime = percent * player.audio.duration;
                    updateMiniPlayerUI(true);
                }
            });
        }
    });
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        bindPlayerStateEvents();
        if (!navigator.onLine) updateMiniPlayerIconsForConnection();
        else updateMiniPlayerUI(true);
    });
} else {
    bindPlayerStateEvents();
    if (!navigator.onLine) updateMiniPlayerIconsForConnection();
    else updateMiniPlayerUI(true);
}