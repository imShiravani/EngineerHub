let globalMusicPlayer = null;
let currentAlbumSongs = null;
let currentAlbumIndex = -1;
let currentAlbumObject = null;
let currentlyPlayingSong = null;
let currentOnlineSongId = null;

window.globalMusicPlayer = globalMusicPlayer;
window.currentAlbumSongs = currentAlbumSongs;
window.currentAlbumIndex = currentAlbumIndex;
window.currentAlbumObject = currentAlbumObject;
window.currentlyPlayingSong = currentlyPlayingSong;
window.currentOnlineSongId = currentOnlineSongId;

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2000);
}

function formatTimeMini(sec) {
    if (isNaN(sec)) return '00:00';
    var mins = Math.floor(sec / 60);
    var secs = Math.floor(sec % 60);
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

function MusicPlayerCore() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentIndex = -1;
    this.repeat = 'off';
    this.shuffle = false;
    this.volume = 0.7;
    this.coverDiv = null;
    this.titleSpan = null;
    this.artistSpan = null;
    this.durationSpan = null;
    this.currentSpan = null;
    this.totalSpan = null;
    this.progressFill = null;
    this.playlistContainer = null;
    this.shuffleBtn = null;
    this.prevBtn = null;
    this.playPauseBtn = null;
    this.nextBtn = null;
    this.repeatBtn = null;
    this.volumeSlider = null;
    this.progressBar = null;
    this.fileInput = null;
    this.volUpIcon = null;
    this.volDownIcon = null;
    this._attachCoreEvents();
}

MusicPlayerCore.prototype._attachCoreEvents = function() {
    var self = this;
    this.audio.ontimeupdate = function() { self.updateProgress(); };
    this.audio.onended = function() {
        if (self.repeat === 'one') {
            self.playTrack(self.currentIndex);
        } else if (self.repeat === 'list') {
            if (self.currentIndex + 1 < self.playlist.length) {
                self.playNext();
            } else {
                self.playTrack(0);
            }
        } else {
            self.playNext();
        }
        self.updatePlayPauseIcon();
    };
    this.audio.onplay = function() { self.updatePlayPauseIcon(); };
    this.audio.onpause = function() { self.updatePlayPauseIcon(); };
    this.audio.onloadedmetadata = function() { self.updateTrackInfo(); };
    this.audio.volume = this.volume;
};

MusicPlayerCore.prototype.bindUI = function(domElements) {
    var self = this;
    this.coverDiv = domElements.coverDiv;
    this.titleSpan = domElements.titleSpan;
    this.artistSpan = domElements.artistSpan;
    this.durationSpan = domElements.durationSpan;
    this.currentSpan = domElements.currentSpan;
    this.totalSpan = domElements.totalSpan;
    this.progressFill = domElements.progressFill;
    this.playlistContainer = domElements.playlistContainer;
    this.shuffleBtn = domElements.shuffleBtn;
    this.prevBtn = domElements.prevBtn;
    this.playPauseBtn = domElements.playPauseBtn;
    this.nextBtn = domElements.nextBtn;
    this.repeatBtn = domElements.repeatBtn;
    this.volumeSlider = domElements.volumeSlider;
    this.progressBar = domElements.progressBar;
    this.fileInput = domElements.fileInput;
    this.volUpIcon = domElements.volUpIcon;
    this.volDownIcon = domElements.volDownIcon;

    if (this.shuffleBtn) this.shuffleBtn.onclick = function() {
        self.shuffle = !self.shuffle;
        self.shuffleBtn.style.opacity = self.shuffle ? '1' : '0.5';
    };
    if (this.repeatBtn) this.repeatBtn.onclick = function() {
        if (self.repeat === 'off') self.repeat = 'list';
        else if (self.repeat === 'list') self.repeat = 'one';
        else self.repeat = 'off';
        self.updateRepeatIcon();
    };
    if (this.prevBtn) this.prevBtn.onclick = function() { self.playPrev(); };
    if (this.nextBtn) this.nextBtn.onclick = function() { self.playNext(); };
    if (this.playPauseBtn) this.playPauseBtn.onclick = function() { self.audio.paused ? self.audio.play() : self.audio.pause(); };
    if (this.volumeSlider) {
        this.volumeSlider.oninput = function(e) { self.audio.volume = parseFloat(e.target.value); };
        this.volumeSlider.value = this.volume;
    }
    if (this.progressBar) {
        this.progressBar.onclick = function(e) {
            var rect = self.progressBar.getBoundingClientRect();
            var percent = (e.clientX - rect.left) / rect.width;
            self.audio.currentTime = percent * self.audio.duration;
        };
    }
    if (this.fileInput) this.fileInput.onchange = function(e) { if (e.target.files.length) self.addToPlaylist(e.target.files[0]); };
    if (this.volUpIcon) this.volUpIcon.onclick = function() {
        self.audio.volume = Math.min(1, self.audio.volume + 0.1);
        if (self.volumeSlider) self.volumeSlider.value = self.audio.volume;
    };
    if (this.volDownIcon) this.volDownIcon.onclick = function() {
        self.audio.volume = Math.max(0, self.audio.volume - 0.1);
        if (self.volumeSlider) self.volumeSlider.value = self.audio.volume;
    };
    this.updateRepeatIcon();
    this.renderPlaylist();
    this.updatePlayPauseIcon();
    this.updateTrackInfo();
};

MusicPlayerCore.prototype.updateRepeatIcon = function() {
    if (!this.repeatBtn) return;
    if (this.repeat === 'off') this.repeatBtn.innerHTML = '🔁';
    else if (this.repeat === 'list') this.repeatBtn.innerHTML = '🔁';
    else this.repeatBtn.innerHTML = '🔂';
    if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
        setTimeout(replaceAllEmojis, 50);
    }
};

MusicPlayerCore.prototype.extractMetadata = function(file, cb) {
    if (typeof jsmediatags !== 'undefined' && jsmediatags.read) {
        jsmediatags.read(file, {
            onSuccess: function(tag) {
                var title = tag.tags.title || null;
                var artist = tag.tags.artist || null;
                var picture = null;
                if (tag.tags.picture) {
                    var pic = tag.tags.picture;
                    var base64 = btoa(new Uint8Array(pic.data).reduce(function(d, b) { return d + String.fromCharCode(b); }, ''));
                    picture = 'data:' + pic.format + ';base64,' + base64;
                }
                cb({ title: title, artist: artist, cover: picture });
            },
            onError: function() { cb({ title: null, artist: null, cover: null }); }
        });
    } else cb({ title: null, artist: null, cover: null });
};

MusicPlayerCore.prototype.addToPlaylist = function(file) {
    var self = this;
    var url = URL.createObjectURL(file);
    var defaultName = file.name.replace(/\.[^/.]+$/, '');
    this.extractMetadata(file, function(meta) {
        var displayName = meta.title || defaultName;
        var artistName = meta.artist || (currentLang === 'fa' ? 'ناشناس' : 'Unknown');
        var cover = meta.cover || null;
        self.playlist.push({ name: displayName, artist: artistName, url: url, cover: cover });
        self.renderPlaylist();
        if (self.currentIndex === -1) self.playTrack(0);
        self.saveToLocalStorage();
    });
};

MusicPlayerCore.prototype.playTrack = function(idx) {
    if (idx < 0 || idx >= this.playlist.length) return;
    this.currentIndex = idx;
    var t = this.playlist[idx];
    this.audio.src = t.url;
    this.audio.load();
    this.audio.play().catch(function(e) { console.warn(e); });
    this.updateTrackInfo();
    if (this.coverDiv) this.coverDiv.innerHTML = t.cover ? '<img src="' + t.cover + '">' : '🎧';
    this.updatePlayPauseIcon();
    var artistForMini = t.artist || (currentLang === 'fa' ? 'ناشناس' : 'Unknown');
    if (typeof window.showMiniPlayer === 'function') {
        window.showMiniPlayer(t.name, artistForMini, t.cover || 'assests/images/default-album.jpg');
    }
    this.highlightCurrentPlaylistItem();
    saveCurrentSongState(t.url, t.name, artistForMini, t.cover || 'assests/images/default-album.jpg', 0);
};

MusicPlayerCore.prototype.highlightCurrentPlaylistItem = function() {
    if (!this.playlistContainer) return;
    var items = this.playlistContainer.querySelectorAll('.playlist-item');
    for (var i = 0; i < items.length; i++) items[i].classList.remove('playing');
    if (this.currentIndex !== -1) {
        var playingItem = this.playlistContainer.querySelector('.playlist-item[data-index="' + this.currentIndex + '"]');
        if (playingItem) playingItem.classList.add('playing');
    }
};

MusicPlayerCore.prototype.playNext = function() {
    if (!this.playlist.length) return;
    if (this.shuffle) {
        var newIndex;
        do { newIndex = Math.floor(Math.random() * this.playlist.length); } while (newIndex === this.currentIndex && this.playlist.length > 1);
        this.playTrack(newIndex);
        return;
    }
    var n = this.currentIndex + 1;
    if (n >= this.playlist.length) {
        if (this.repeat === 'list') n = 0;
        else return;
    }
    this.playTrack(n);
};

MusicPlayerCore.prototype.playPrev = function() {
    if (!this.playlist.length) return;
    var p = this.currentIndex - 1;
    if (p < 0) {
        if (this.repeat === 'list') p = this.playlist.length - 1;
        else return;
    }
    this.playTrack(p);
};

MusicPlayerCore.prototype.renderPlaylist = function() {
    if (!this.playlistContainer) return;
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var empty = (lang === 'fa') ? 'لیست پخش خالی است' : 'Playlist empty';
    if (this.playlist.length === 0) {
        this.playlistContainer.innerHTML = '<div class="playlist-item" style="justify-content:center;">' + empty + '</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < this.playlist.length; i++) {
        var it = this.playlist[i];
        var displayText = it.name;
        if (it.artist && it.artist !== '') displayText = it.name + ' - ' + it.artist;
        var playingClass = (i === this.currentIndex) ? ' playing' : '';
        html += '<div class="playlist-item' + playingClass + '" data-index="' + i + '"><span style="flex:1;">' + escapeHtml(displayText.substring(0, 60)) + '</span><div class="playlist-actions"><span class="playlist-play" data-play="' + i + '" style="cursor:pointer;">▶️</span><span class="playlist-trash" data-del="' + i + '" style="cursor:pointer;">🗑️</span></div></div>';
    }
    this.playlistContainer.innerHTML = html;
    var self = this;
    this.playlistContainer.querySelectorAll('[data-play]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            var idx = parseInt(el.getAttribute('data-play'));
            self.playTrack(idx);
        });
    });
    this.playlistContainer.querySelectorAll('[data-del]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            var idx = parseInt(el.getAttribute('data-del'));
            var t = self.playlist[idx];
            if (t && t.url && t.url.startsWith('blob:')) URL.revokeObjectURL(t.url);
            self.playlist.splice(idx, 1);
            if (self.currentIndex >= idx) self.currentIndex--;
            if (!self.playlist.length) self.audio.pause();
            self.renderPlaylist();
            self.saveToLocalStorage();
        });
    });
    this.highlightCurrentPlaylistItem();
    if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
        setTimeout(replaceAllEmojis, 50);
    }
};

MusicPlayerCore.prototype.updateProgress = function() {
    if (this.audio.duration) {
        var p = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.progressFill) this.progressFill.style.width = p + '%';
        if (this.currentSpan) this.currentSpan.innerText = formatTimeMini(this.audio.currentTime);
        if (this.totalSpan) this.totalSpan.innerText = formatTimeMini(this.audio.duration);
    }
    if (typeof window.updateMiniProgress === 'function') window.updateMiniProgress();
    else if (typeof window.updateMiniPlayerUI === 'function') window.updateMiniPlayerUI();
};

MusicPlayerCore.prototype.updateTrackInfo = function() {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    if (this.currentIndex !== -1 && this.playlist[this.currentIndex]) {
        var track = this.playlist[this.currentIndex];
        if (this.titleSpan) this.titleSpan.innerText = track.name;
        if (this.artistSpan) this.artistSpan.innerText = track.artist || (lang === 'fa' ? 'ناشناس' : 'Unknown');
        if (this.durationSpan) this.durationSpan.innerText = formatTimeMini(this.audio.duration);
    } else {
        if (this.titleSpan) this.titleSpan.innerText = (lang === 'fa') ? 'هیچ آهنگی' : 'No track';
        if (this.artistSpan) this.artistSpan.innerText = (lang === 'fa') ? 'آلبوم ناشناخته' : 'Unknown album';
    }
};

MusicPlayerCore.prototype.updatePlayPauseIcon = function() {
    if (this.playPauseBtn) this.playPauseBtn.innerHTML = this.audio.paused ? '▶️' : '⏸️';
    if (this.playlistContainer && this.currentIndex !== -1) {
        var playingItem = this.playlistContainer.querySelector('.playlist-item[data-index="' + this.currentIndex + '"] .playlist-play');
        if (playingItem) playingItem.innerHTML = this.audio.paused ? '▶️' : '⏸️';
    }
    if (typeof window.updateMiniPlayerUI === 'function') window.updateMiniPlayerUI(true);
};

MusicPlayerCore.prototype.saveToLocalStorage = function() {
    var savedList = [];
    for (var i = 0; i < this.playlist.length; i++) {
        savedList.push({ name: this.playlist[i].name, artist: this.playlist[i].artist, cover: this.playlist[i].cover });
    }
    localStorage.setItem('musicPlayerPlaylist', JSON.stringify(savedList));
    localStorage.setItem('musicPlayerVolume', this.audio.volume);
    localStorage.setItem('musicPlayerRepeat', this.repeat);
    localStorage.setItem('musicPlayerShuffle', this.shuffle);
};

MusicPlayerCore.prototype.loadFromLocalStorage = function() {
    var self = this;
    var saved = localStorage.getItem('musicPlayerPlaylist');
    if (saved) {
        try {
            var parsed = JSON.parse(saved);
            this.playlist = parsed.map(function(i) { return { name: i.name, artist: i.artist || '', cover: i.cover, url: null }; });
            this.renderPlaylist();
        } catch (e) {}
    }
    var vol = localStorage.getItem('musicPlayerVolume');
    if (vol !== null) {
        this.audio.volume = parseFloat(vol);
        if (this.volumeSlider) this.volumeSlider.value = this.audio.volume;
    }
    this.repeat = localStorage.getItem('musicPlayerRepeat') || 'off';
    this.shuffle = localStorage.getItem('musicPlayerShuffle') === 'true';
    this.updateRepeatIcon();
};

MusicPlayerCore.prototype.playOnlineSong = function(url, title, artist, cover, onEndedCallback) {
    if (!artist || artist === '') {
        artist = (currentLang === 'fa' ? 'خواننده' : 'Artist');
    }
    this.audio.pause();
    this.audio.src = url;
    this.audio.load();
    this.audio.play().catch(function(e) { console.warn(e); });
    if (this.titleSpan) this.titleSpan.innerText = title;
    if (this.artistSpan) this.artistSpan.innerText = artist;
    this.updatePlayPauseIcon();
    if (typeof window.showMiniPlayer === 'function') {
        window.showMiniPlayer(title, artist, cover);
    }
    this.audio.onended = onEndedCallback || function() {};
    if (this.playlistContainer) this.highlightCurrentOfflinePlaylist(-1);
    saveCurrentSongState(url, title, artist, cover, 0);
    window.globalMusicPlayer = this;
};

MusicPlayerCore.prototype.highlightCurrentOfflinePlaylist = function(idx) {
    if (!this.playlistContainer) return;
    var items = this.playlistContainer.querySelectorAll('.playlist-item');
    for (var i = 0; i < items.length; i++) items[i].classList.remove('playing');
    if (idx !== -1 && items[idx]) items[idx].classList.add('playing');
    this.currentIndex = idx;
};

function renderAlbumsList() {
    var albums = JSON.parse(localStorage.getItem('musicAlbums') || '[]');
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var container = document.getElementById('albumsView');
    if (!container) return;
    container.innerHTML = '<div class="albums-grid" id="albumsGrid"></div>';
    var grid = document.getElementById('albumsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 0; i < albums.length; i++) {
        var a = albums[i];
        var albumName = (lang === 'fa') ? a.name : (a.nameEn || a.name);
        var artistName = (lang === 'fa') ? (a.artist || 'ناشناس') : (a.artistEn || 'Unknown');
        var card = document.createElement('div');
        card.className = 'album-select-card';
        card.setAttribute('data-album-id', a.id);
        card.innerHTML = '<img class="album-select-img" src="' + a.image + '" onerror="this.src=\'assests/images/default-album.jpg\'"><div class="album-select-info"><div class="album-select-title">' + escapeHtml(albumName) + '</div><div class="album-select-artist">' + escapeHtml(artistName) + '</div></div>';
        card.addEventListener('click', (function(id) { return function() { showAlbumDetail(id); }; })(a.id));
        grid.appendChild(card);
    }
    if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
        setTimeout(replaceAllEmojis, 50);
    }
}

function showAlbumDetail(albumId) {
    if (currentlyPlayingSong && currentAlbumObject && currentAlbumObject.id != albumId) {
        if (currentlyPlayingSong) {
            var oldSpan = currentlyPlayingSong.querySelector('.song-play-pause');
            if (oldSpan) oldSpan.innerHTML = '▶️';
            currentlyPlayingSong.classList.remove('song-playing');
            currentlyPlayingSong = null;
            currentOnlineSongId = null;
        }
    }
    var albums = JSON.parse(localStorage.getItem('musicAlbums') || '[]');
    var album = null;
    for (var i = 0; i < albums.length; i++) {
        if (albums[i].id == albumId) { album = albums[i]; break; }
    }
    if (!album) return;
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var albumName = (lang === 'fa') ? album.name : (album.nameEn || album.name);
    var artistName = (lang === 'fa') ? (album.artist || 'ناشناس') : (album.artistEn || 'Unknown');
    var container = document.getElementById('albumsView');
    if (!container) return;
    container.innerHTML = '<button class="back-to-albums" id="backToAlbumsBtn">← ' + ((lang === 'fa') ? 'بازگشت به آلبوم‌ها' : 'Back to albums') + '</button><div class="album-detail-card" id="albumDetailCard"><div class="album-detail-image"><img src="' + album.image + '" onerror="this.src=\'assests/images/default-album.jpg\'"></div><div class="album-detail-info"><div class="album-detail-title">' + escapeHtml(albumName) + '</div><div class="album-detail-artist">' + escapeHtml(artistName) + '</div><div class="songs-list" id="songsList"></div></div></div>';
    var songsList = document.getElementById('songsList');
    if (songsList) {
        songsList.innerHTML = '';
        var sortedSongs = album.songs.slice().sort(function(a, b) { return a.order - b.order; });
        for (var j = 0; j < sortedSongs.length; j++) {
            var song = sortedSongs[j];
            var songDiv = document.createElement('div');
            songDiv.className = 'song-item';
            songDiv.setAttribute('data-url', song.url);
            songDiv.setAttribute('data-title-fa', song.titleFa);
            songDiv.setAttribute('data-title-en', song.titleEn);
            var artistFaVal = song.artistFa || album.artist || (lang === 'fa' ? 'ناشناس' : 'Unknown');
            var artistEnVal = song.artistEn || album.artistEn || (lang === 'en' ? 'Unknown' : 'ناشناس');
            songDiv.setAttribute('data-artist-fa', artistFaVal);
            songDiv.setAttribute('data-artist-en', artistEnVal);
            songDiv.setAttribute('data-song-idx', j);
            var displayTitle = (lang === 'fa') ? song.titleFa : song.titleEn;
            var displayArtist = (lang === 'fa') ? artistFaVal : artistEnVal;
            songDiv.innerHTML = '<span class="song-play-pause">▶️</span><span class="song-title">' + escapeHtml(displayTitle) + '</span><span class="song-artist">' + escapeHtml(displayArtist) + '</span><span class="song-add" data-url="' + song.url + '" data-title="' + escapeHtml(displayTitle) + '" data-artist="' + escapeHtml(displayArtist) + '">🤍</span>';
            songsList.appendChild(songDiv);
        }
        attachSongEventsToDetail(album);
        highlightCurrentlyPlayingSong();
    }
    document.getElementById('backToAlbumsBtn').addEventListener('click', function() { renderAlbumsList(); });
}

function highlightCurrentlyPlayingSong() {
    if (currentOnlineSongId !== null) {
        var allSongs = document.querySelectorAll('#songsList .song-item');
        for (var i = 0; i < allSongs.length; i++) {
            var s = allSongs[i];
            if (parseInt(s.getAttribute('data-song-idx')) === currentOnlineSongId) {
                if (currentlyPlayingSong) currentlyPlayingSong.classList.remove('song-playing');
                if (currentlyPlayingSong) {
                    var oldSpan = currentlyPlayingSong.querySelector('.song-play-pause');
                    if (oldSpan) oldSpan.innerHTML = '▶️';
                }
                currentlyPlayingSong = s;
                var playSpan = s.querySelector('.song-play-pause');
                var isPlaying = (globalMusicPlayer && !globalMusicPlayer.audio.paused);
                if (playSpan) playSpan.innerHTML = isPlaying ? '⏸️' : '▶️';
                s.classList.add('song-playing');
                break;
            }
        }
    }
}

function attachSongEventsToDetail(album) {
    var songs = document.querySelectorAll('#songsList .song-item');
    for (var i = 0; i < songs.length; i++) {
        var item = songs[i];
        var playSpan = item.querySelector('.song-play-pause');
        var addSpan = item.querySelector('.song-add');
        var url = item.getAttribute('data-url');
        var titleFa = item.getAttribute('data-title-fa');
        var titleEn = item.getAttribute('data-title-en');
        var artistFa = item.getAttribute('data-artist-fa');
        var artistEn = item.getAttribute('data-artist-en');
        var idx = parseInt(item.getAttribute('data-song-idx'));
        (function(songElement, u, tFa, tEn, aFa, aEn, index, alb) {
            if (playSpan) {
                playSpan.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var title = (currentLang === 'fa') ? tFa : tEn;
                    var artist = (currentLang === 'fa') ? aFa : aEn;
                    togglePlaySongFromAlbum(songElement, u, title, artist, index, alb);
                });
            }
            if (addSpan) {
                addSpan.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var title = (currentLang === 'fa') ? tFa : tEn;
                    var artist = (currentLang === 'fa') ? aFa : aEn;
                    addToOfflinePlaylist(u, title, artist);
                    var original = addSpan.innerHTML;
                    addSpan.innerHTML = '❤️';
                    setTimeout(function() { addSpan.innerHTML = original; }, 800);
                });
            }
        })(item, url, titleFa, titleEn, artistFa, artistEn, idx, album);
    }
}

function togglePlaySongFromAlbum(songElement, url, title, artist, idx, album) {
    var playPauseSpan = songElement.querySelector('.song-play-pause');
    var player = globalMusicPlayer;
    if (!player || !player.audio) return;
    if (currentlyPlayingSong === songElement && !player.audio.paused) {
        player.audio.pause();
        if (playPauseSpan) playPauseSpan.innerHTML = '▶️';
        songElement.classList.remove('song-playing');
        currentlyPlayingSong = null;
        currentOnlineSongId = null;
        player.updatePlayPauseIcon();
        if (typeof window.hideMiniPlayer === 'function') window.hideMiniPlayer();
        currentAlbumSongs = null;
        currentAlbumIndex = -1;
        currentAlbumObject = null;
        localStorage.removeItem('currentPlayingSong');
        window.currentAlbumSongs = currentAlbumSongs;
        window.currentAlbumIndex = currentAlbumIndex;
        window.currentAlbumObject = currentAlbumObject;
        window.currentlyPlayingSong = currentlyPlayingSong;
        window.currentOnlineSongId = currentOnlineSongId;
    } else {
        if (currentlyPlayingSong) {
            var oldSpan = currentlyPlayingSong.querySelector('.song-play-pause');
            if (oldSpan) oldSpan.innerHTML = '▶️';
            currentlyPlayingSong.classList.remove('song-playing');
        }
        if (!artist || artist === '') {
            artist = (currentLang === 'fa') ? (album.artist || 'ناشناس') : (album.artistEn || 'Unknown');
        }
        player.playOnlineSong(url, title, artist, album.image, function() { playNextFromAlbum(); });
        if (playPauseSpan) playPauseSpan.innerHTML = '⏸️';
        songElement.classList.add('song-playing');
        currentlyPlayingSong = songElement;
        currentOnlineSongId = idx;
        updateMainPlayerInfo(title, artist);
        var sortedSongs = album.songs.slice().sort(function(a, b) { return a.order - b.order; });
        currentAlbumSongs = sortedSongs;
        currentAlbumIndex = idx;
        currentAlbumObject = album;
        saveCurrentSongState(url, title, artist, album.image, 0);
        window.currentAlbumSongs = currentAlbumSongs;
        window.currentAlbumIndex = currentAlbumIndex;
        window.currentAlbumObject = currentAlbumObject;
        window.currentlyPlayingSong = currentlyPlayingSong;
        window.currentOnlineSongId = currentOnlineSongId;
    }
}

function playNextFromAlbum() {
    if (currentAlbumSongs && currentAlbumIndex !== -1 && currentAlbumIndex + 1 < currentAlbumSongs.length) {
        var nextIdx = currentAlbumIndex + 1;
        var nextSong = currentAlbumSongs[nextIdx];
        var player = globalMusicPlayer;
        if (player) {
            var title = (currentLang === 'fa') ? nextSong.titleFa : nextSong.titleEn;
            var artist = (currentLang === 'fa') ? nextSong.artistFa : nextSong.artistEn;
            if (!artist || artist === '') {
                artist = (currentLang === 'fa') ? (currentAlbumObject.artist || 'ناشناس') : (currentAlbumObject.artistEn || 'Unknown');
            }
            player.playOnlineSong(nextSong.url, title, artist, currentAlbumObject.image, function() { playNextFromAlbum(); });
            updateMainPlayerInfo(title, artist);
            var allSongs = document.querySelectorAll('#songsList .song-item');
            for (var i = 0; i < allSongs.length; i++) {
                var s = allSongs[i];
                if (parseInt(s.getAttribute('data-song-idx')) === nextIdx) {
                    if (currentlyPlayingSong) currentlyPlayingSong.classList.remove('song-playing');
                    if (currentlyPlayingSong) {
                        var oldSpan = currentlyPlayingSong.querySelector('.song-play-pause');
                        if (oldSpan) oldSpan.innerHTML = '▶️';
                    }
                    currentlyPlayingSong = s;
                    var playSpan = s.querySelector('.song-play-pause');
                    if (playSpan) playSpan.innerHTML = '⏸️';
                    s.classList.add('song-playing');
                    currentAlbumIndex = nextIdx;
                    currentOnlineSongId = nextIdx;
                    break;
                }
            }
            window.currentAlbumIndex = currentAlbumIndex;
            window.currentOnlineSongId = currentOnlineSongId;
            window.currentlyPlayingSong = currentlyPlayingSong;
        }
    } else {
        if (currentlyPlayingSong) {
            var span = currentlyPlayingSong.querySelector('.song-play-pause');
            if (span) span.innerHTML = '▶️';
            currentlyPlayingSong.classList.remove('song-playing');
        }
        currentlyPlayingSong = null;
        currentOnlineSongId = null;
        currentAlbumSongs = null;
        currentAlbumIndex = -1;
        currentAlbumObject = null;
        if (typeof window.hideMiniPlayer === 'function') window.hideMiniPlayer();
        localStorage.removeItem('currentPlayingSong');
        window.currentAlbumSongs = currentAlbumSongs;
        window.currentAlbumIndex = currentAlbumIndex;
        window.currentAlbumObject = currentAlbumObject;
        window.currentlyPlayingSong = currentlyPlayingSong;
        window.currentOnlineSongId = currentOnlineSongId;
    }
}

function updateMainPlayerInfo(title, artist) {
    if (globalMusicPlayer && globalMusicPlayer.titleSpan) {
        globalMusicPlayer.titleSpan.innerText = title;
        globalMusicPlayer.artistSpan.innerText = artist;
    }
}

function addToOfflinePlaylist(url, title, artist) {
    if (!globalMusicPlayer) return;
    globalMusicPlayer.playlist.push({ name: title, artist: artist, url: url, cover: null });
    globalMusicPlayer.renderPlaylist();
    globalMusicPlayer.saveToLocalStorage();
    showToast((typeof currentLang !== 'undefined' && currentLang === 'fa') ? '❤️ به لیست پخش اضافه شد' : '❤️ Added to playlist');
}

function saveCurrentSongState(url, title, artist, cover, currentTime) {
    var state = { url: url, title: title, artist: artist, cover: cover, currentTime: currentTime };
    localStorage.setItem('currentPlayingSong', JSON.stringify(state));
}

function initializeZoozanagheAlbum() {
    var albums = JSON.parse(localStorage.getItem('musicAlbums') || '[]');
    var existsZoozanaghe = false;
    for (var i = 0; i < albums.length; i++) {
        if (albums[i].name === "ذوزنقه" || albums[i].id === 1001) existsZoozanaghe = true;
    }
    if (!existsZoozanaghe) {
        albums.push({
            id: 1001,
            name: "ذوزنقه",
            nameEn: "Zoozanaghe",
            image: "assests/images/Zoozanaghe.jpg",
            artist: "مهراد هیدن",
            artistEn: "Mehrad Hidden",
            songs: [
                { titleFa: "کلاغ پر (Intro)", titleEn: "Kalaghpar (Intro)", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/01%20Kalaghpar%20(Intro)%20(BandMusic).mp3", order: 1 },
                { titleFa: "هزار (همراه سامان ویلسون)", titleEn: "Hezar (feat. Saman Wilson)", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/02%20Hezar%20(feat.%20Saman%20Wilson)%20(BandMusic).mp3", order: 2 },
                { titleFa: "رفتم تو دِلش (همراه شایع)", titleEn: "Raftam Too Delesh (feat. Shayea)", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/03%20Raftam%20Too%20Delesh%20(feat.%20Shayea)%20(BandMusic).mp3", order: 3 },
                { titleFa: "چیپ", titleEn: "Cheap", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/04%20Cheap%20(BandMusic).mp3", order: 4 },
                { titleFa: "آرامش", titleEn: "Aramesh", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/05%20Aramesh%20(BandMusic).mp3", order: 5 },
                { titleFa: "کج", titleEn: "Kaj", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/06%20Kaj%20(BandMusic).mp3", order: 6 },
                { titleFa: "لالایی", titleEn: "Lalai", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/07%20Lalai%20(BandMusic).mp3", order: 7 },
                { titleFa: "خواهشاً (همراه Mr.D7)", titleEn: "Khaheshan (feat. Mr.D7)", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/09%20Khaheshan%20(BandMusic).mp3", order: 8 },
                { titleFa: "پسیکو سلام", titleEn: "Psycho Salam", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/10%20Psycho%20Salam%20(BandMusic).mp3", order: 9 },
                { titleFa: "جاهل", titleEn: "Jahel", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/11%20Jahel%20(BandMusic).mp3", order: 10 },
                { titleFa: "دان دان", titleEn: "Dan Dan", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/12%20Dan%20Dan%20(BandMusic).mp3", order: 11 },
                { titleFa: "شنبه", titleEn: "Shanbe", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/13%20Shanbe%20(BandMusic).mp3", order: 12 },
                { titleFa: "طلوع (همراه هین)", titleEn: "Tolou (feat. Heen)", artistFa: "مهراد هیدن", artistEn: "Mehrad Hidden", url: "https://dl.bandmusic.ir/files/mp3/s1/14%20Tolou%20(feat.%20Heen)%20(BandMusic).mp3", order: 13 }
            ]
        });
    }
    var existsBezan = false;
    for (var i = 0; i < albums.length; i++) {
        if (albums[i].name === "بزن تار" || albums[i].id === 1002) existsBezan = true;
    }
    if (!existsBezan) {
        albums.push({
            id: 1002,
            name: "بزن تار",
            nameEn: "Bezan Tar",
            image: "assests/images/Bezan-Tar.jpg",
            artist: "هایده",
            artistEn: "Hayedeh",
            songs: [
                { titleFa: "نگو نمیام", titleEn: "Nagoo Nemiam", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/01%20Nagoo%20Nemiam.MP3", order: 1 },
                { titleFa: "بهونه", titleEn: "Bahaneh", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/02%20Bahoone.MP3", order: 2 },
                { titleFa: "افسانه هستی", titleEn: "Afsaneh Hasti", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/03%20Afsaneh%20Hasti.MP3", order: 3 },
                { titleFa: "بزن تار", titleEn: "Bezan Tar", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/04%20Bezan%20Tar.MP3", order: 4 },
                { titleFa: "عروسک", titleEn: "Aroosak", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/05%20Aroosak.MP3", order: 5 },
                { titleFa: "وفای دل", titleEn: "Vafaye Del", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/06%20Vafaye%20Del.MP3", order: 6 },
                { titleFa: "ساقی", titleEn: "Saghi", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/07%20Saghi.MP3", order: 7 },
                { titleFa: "عسل چشم", titleEn: "Asal Cheshm", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/08%20Asal%20Cheshm.MP3", order: 8 },
                { titleFa: "نمی‌خوام", titleEn: "Nemikham", artistFa: "هایده", artistEn: "Hayedeh", url: "https://dl.musicrooz.com/Music/A/F/Hayede-Bezantar/09%20Nemikham.MP3", order: 9 }
            ]
        });
    }
    localStorage.setItem('musicAlbums', JSON.stringify(albums));
}

function initGlobalMusicPlayer() {
    if (globalMusicPlayer) return globalMusicPlayer;
    globalMusicPlayer = new MusicPlayerCore();
    globalMusicPlayer.loadFromLocalStorage();
    var savedSong = localStorage.getItem('currentPlayingSong');
    if (savedSong) {
        try {
            var song = JSON.parse(savedSong);
            if (song && song.url) {
                globalMusicPlayer.playOnlineSong(song.url, song.title, song.artist, song.cover, function() {});
                globalMusicPlayer.currentIndex = -1;
            }
        } catch (e) {}
    }
    window.globalMusicPlayer = globalMusicPlayer;
    return globalMusicPlayer;
}

function updateMusicPlayerLanguage() {
    if (!globalMusicPlayer) return;
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var offlineBtn = document.querySelector('.music-tab-btn[data-tab="offline"]');
    var onlineBtn = document.querySelector('.music-tab-btn[data-tab="online"]');
    if (offlineBtn) offlineBtn.innerText = (lang === 'fa') ? '📀 آفلاین (پخش محلی)' : '📀 Offline (local)';
    if (onlineBtn) onlineBtn.innerText = (lang === 'fa') ? '🌐 آلبوم‌های آنلاین' : '🌐 Online Albums';
    var uploadLabel = document.querySelector('.custom-file-upload');
    if (uploadLabel) uploadLabel.innerHTML = (lang === 'fa') ? '📂 انتخاب فایل صوتی' : '📂 Select audio file';
    if (globalMusicPlayer.playlist.length === 0) {
        var emptyText = (lang === 'fa') ? 'لیست پخش خالی است' : 'Playlist empty';
        var pc = document.getElementById('playlistContainer');
        if (pc) pc.innerHTML = '<div class="playlist-item" style="justify-content:center;">' + emptyText + '</div>';
    } else {
        globalMusicPlayer.renderPlaylist();
    }
    renderAlbumsList();

    if (currentlyPlayingSong && currentAlbumObject && currentOnlineSongId !== null) {
        var song = currentAlbumObject.songs.find(function(s, idx) { return idx == currentOnlineSongId; });
        if (song) {
            var newTitle = (currentLang === 'fa') ? song.titleFa : song.titleEn;
            var newArtist = (currentLang === 'fa') ? (song.artistFa || currentAlbumObject.artist) : (song.artistEn || currentAlbumObject.artistEn);
            if (globalMusicPlayer.titleSpan) globalMusicPlayer.titleSpan.innerText = newTitle;
            if (globalMusicPlayer.artistSpan) globalMusicPlayer.artistSpan.innerText = newArtist;
            if (typeof window.showMiniPlayer === 'function') {
                window.showMiniPlayer(newTitle, newArtist, currentAlbumObject.image);
            }
        }
    } else if (globalMusicPlayer.currentIndex !== -1 && globalMusicPlayer.playlist[globalMusicPlayer.currentIndex]) {
        var currentTrack = globalMusicPlayer.playlist[globalMusicPlayer.currentIndex];
        if (typeof window.showMiniPlayer === 'function') {
            window.showMiniPlayer(currentTrack.name, currentTrack.artist, currentTrack.cover);
        }
    }

    if (document.getElementById('albumsView') && document.getElementById('albumsView').innerHTML.includes('album-detail-card')) {
        highlightCurrentlyPlayingSong();
    }
    globalMusicPlayer.updatePlayPauseIcon();
    if (typeof window.updateMiniPlayerLanguage === 'function') window.updateMiniPlayerLanguage();
    if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
        setTimeout(replaceAllEmojis, 50);
    }
}
window.updateMusicPlayerLanguage = updateMusicPlayerLanguage;

function buildMusicPlayer() {
    try {
        var container = document.getElementById('widgetContainer');
        if (!container) return;
        var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
        var offlineText = (lang === 'fa') ? '📀 آفلاین (پخش محلی)' : '📀 Offline (local)';
        var onlineText = (lang === 'fa') ? '🌐 آلبوم‌های آنلاین' : '🌐 Online Albums';
        container.innerHTML = '<div class="music-player-container" id="musicPlayerContainer">' +
            '<div class="music-tabs"><button class="music-tab-btn" data-tab="offline">' + offlineText + '</button><button class="music-tab-btn active" data-tab="online">' + onlineText + '</button></div>' +
            '<div class="music-tab-content" id="offlineTab"><div class="music-player"><div class="cover-area"><div class="cover-img" id="musicCover">🎧</div><div class="track-details"><div class="track-title" id="musicTitle">' + (lang === 'fa' ? 'هیچ آهنگی' : 'No track') + '</div><div class="track-artist" id="musicArtist">' + (lang === 'fa' ? 'آلبوم ناشناخته' : 'Unknown album') + '</div><div class="duration" id="musicDuration">00:00</div></div></div><div class="controls-row"><button class="ctrl-btn" id="shuffleBtn" title="' + (lang === 'fa' ? 'تصادفی' : 'Shuffle') + '">🔀</button><button class="ctrl-btn" id="prevBtn" title="' + (lang === 'fa' ? 'قبلی' : 'Previous') + '">⏮️</button><button class="ctrl-btn" id="playPauseBtn">▶️</button><button class="ctrl-btn" id="nextBtn" title="' + (lang === 'fa' ? 'بعدی' : 'Next') + '">⏭️</button><button class="ctrl-btn" id="repeatBtn" title="' + (lang === 'fa' ? 'تکرار' : 'Repeat') + '">🔁</button></div><div class="time-info"><span id="currentTime">00:00</span><span id="totalTime">00:00</span></div><div class="progress-container" id="progressBar"><div class="progress-fill" id="progressFill"></div></div><div class="volume-row"><span class="volume-icon" id="volUpIcon">🔊</span><input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.01" value="0.7"><span class="volume-icon" id="volDownIcon">🔉</span></div><label class="custom-file-upload" for="musicFileInput">📂 ' + (lang === 'fa' ? 'انتخاب فایل صوتی' : 'Select audio file') + '</label><input type="file" id="musicFileInput" accept="audio/*"><div class="playlist-list" id="playlistContainer"></div></div></div>' +
            '<div class="music-tab-content active" id="onlineTab"><div id="albumsView"></div></div>' +
            '</div>';
        var musicContainer = document.getElementById('musicPlayerContainer');
        if (musicContainer && !musicContainer.querySelector('.back-to-home-btn')) {
            var backText = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang].back_to_home : (lang === 'fa' ? '🏠 خانه' : '🏠 Home');
            var backBtn = document.createElement('button');
            backBtn.className = 'back-to-home-btn';
            backBtn.innerHTML = backText;
            backBtn.onclick = function() { if (typeof switchTool !== 'undefined') switchTool('home'); };
            musicContainer.insertBefore(backBtn, musicContainer.firstChild);
        }
        var player = initGlobalMusicPlayer();
        var domElements = {
            coverDiv: document.getElementById('musicCover'),
            titleSpan: document.getElementById('musicTitle'),
            artistSpan: document.getElementById('musicArtist'),
            durationSpan: document.getElementById('musicDuration'),
            currentSpan: document.getElementById('currentTime'),
            totalSpan: document.getElementById('totalTime'),
            progressFill: document.getElementById('progressFill'),
            playlistContainer: document.getElementById('playlistContainer'),
            shuffleBtn: document.getElementById('shuffleBtn'),
            prevBtn: document.getElementById('prevBtn'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            nextBtn: document.getElementById('nextBtn'),
            repeatBtn: document.getElementById('repeatBtn'),
            volumeSlider: document.getElementById('volumeSlider'),
            progressBar: document.getElementById('progressBar'),
            fileInput: document.getElementById('musicFileInput'),
            volUpIcon: document.getElementById('volUpIcon'),
            volDownIcon: document.getElementById('volDownIcon')
        };
        player.bindUI(domElements);
        initializeZoozanagheAlbum();
        renderAlbumsList();

        var tabBtns = document.querySelectorAll('.music-tab-btn');
        for (var i = 0; i < tabBtns.length; i++) {
            tabBtns[i].addEventListener('click', (function(btn) {
                return function() {
                    var tab = btn.getAttribute('data-tab');
                    document.querySelectorAll('.music-tab-btn').forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    document.querySelectorAll('.music-tab-content').forEach(function(c) { c.classList.remove('active'); });
                    document.getElementById(tab + 'Tab').classList.add('active');
                    if (tab === 'online') renderAlbumsList();
                };
            })(tabBtns[i]));
        }

        window.currentMusicPlayer = player;
        if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
            setTimeout(replaceAllEmojis, 100);
        }
    } catch (err) { console.error(err); }
}
window.buildMusicPlayer = buildMusicPlayer;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initGlobalMusicPlayer();
        initializeZoozanagheAlbum();
    });
} else {
    initGlobalMusicPlayer();
    initializeZoozanagheAlbum();
}