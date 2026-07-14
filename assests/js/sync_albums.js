window.syncAlbumsFromDatabase = async function() {
    try {
        var response = await fetch('admin_api.php?action=get_albums&_t=' + Date.now());
        var data = await response.json();
        if (data.success && data.albums) {
            var albumsForLocal = [];
            for (var i = 0; i < data.albums.length; i++) {
                var album = data.albums[i];
                var songs = [];
                if (album.songs && album.songs.length) {
                    for (var j = 0; j < album.songs.length; j++) {
                        var song = album.songs[j];
                        songs.push({
                            titleFa: song.title_fa,
                            titleEn: song.title_en,
                            artistFa: song.artist_fa,
                            artistEn: song.artist_en,
                            url: song.url,
                            order: song.order
                        });
                    }
                }
                albumsForLocal.push({
                    id: album.id,
                    name: album.name_fa,
                    nameEn: album.name_en,
                    artist: album.artist_fa,
                    artistEn: album.artist_en,
                    image: album.image_path,
                    songs: songs
                });
            }
            localStorage.setItem('musicAlbums', JSON.stringify(albumsForLocal));
            console.log('✅ آلبوم‌ها از دیتابیس همگام‌سازی شدند. تعداد:', albumsForLocal.length);
            console.log('نمونه آلبوم:', albumsForLocal[0]);
            return true;
        }
        return false;
    } catch (e) {
        console.error('❌ خطا در همگام‌سازی آلبوم‌ها:', e);
        return false;
    }
};

window.refreshMusicPlayerIfNeeded = function() {
    if (typeof window.buildMusicPlayer === 'function') {
        var container = document.getElementById('widgetContainer');
        if (container && container.querySelector('.music-player-container')) {
            window.buildMusicPlayer();
            console.log('🔄 پلیر موسیقی بازسازی شد.');
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.syncAlbumsFromDatabase();
    });
} else {
    window.syncAlbumsFromDatabase();
}