function buildHome() {
    var container = document.getElementById('widgetContainer');

    var enabledTools = {};
    if (window.userData && window.userData.toolsEnabled) {
        enabledTools = window.userData.toolsEnabled;
    } else {
        var allTools = ['calculator', 'password', 'smarteditor', 'textunit', 'colorpicker', 'timer', 'musicplayer', 'videoplayer', 'filemanager'];
        for (var i = 0; i < allTools.length; i++) {
            enabledTools[allTools[i]] = true;
        }
    }

    var cardsHtml = '';

    if (enabledTools.calculator !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="calculator"><span>🧮</span><h3>' + translations[currentLang].tool_calc_title + '</h3><p>' + translations[currentLang].tool_calc_desc + '</p></div>';
    }
    if (enabledTools.password !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="password"><span>🔐</span><h3>' + translations[currentLang].tool_pwd_title + '</h3><p>' + translations[currentLang].tool_pwd_desc + '</p></div>';
    }
    if (enabledTools.smarteditor !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="smarteditor"><span>📝</span><h3>' + translations[currentLang].tool_smarteditor_title + '</h3><p>' + translations[currentLang].tool_smarteditor_desc + '</p></div>';
    }
    if (enabledTools.textunit !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="textunit"><span>📊</span><h3>' + translations[currentLang].tool_textunit_title + '</h3><p>' + translations[currentLang].tool_textunit_desc + '</p></div>';
    }
    if (enabledTools.colorpicker !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="colorpicker"><span>🎨</span><h3>' + translations[currentLang].tool_colorpicker_title + '</h3><p>' + translations[currentLang].tool_colorpicker_desc + '</p></div>';
    }
    if (enabledTools.timer !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="timer"><span>⏱️</span><h3>' + translations[currentLang].tool_timer_title + '</h3><p>' + translations[currentLang].tool_timer_desc + '</p></div>';
    }
    if (enabledTools.musicplayer !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="musicplayer"><span>🎵</span><h3>' + translations[currentLang].tool_musicplayer_title + '</h3><p>' + translations[currentLang].tool_musicplayer_desc + '</p></div>';
    }
    if (enabledTools.videoplayer !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="videoplayer"><span>🎬</span><h3>' + translations[currentLang].tool_videoplayer_title + '</h3><p>' + translations[currentLang].tool_videoplayer_desc + '</p></div>';
    }
    if (enabledTools.filemanager !== false) {
        cardsHtml += '<div class="tool-card" data-tool-card="filemanager"><span>📂</span><h3>' + translations[currentLang].tool_filemanager_title + '</h3><p>' + translations[currentLang].tool_filemanager_desc + '</p></div>';
    }

    container.innerHTML = `
        <div class="home-container">
            <h2>${translations[currentLang].home_welcome}</h2>
            <p>${translations[currentLang].home_select_tool}</p>
            <div class="tools-showcase">
                ${cardsHtml}
            </div>
        </div>
    `;

    var cards = document.querySelectorAll('.tool-card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].onclick = (function(card) {
            return function() { switchTool(card.getAttribute('data-tool-card')); };
        })(cards[i]);
    }

    var toolNameElement = document.getElementById('currentToolName');
    if (toolNameElement) toolNameElement.textContent = translations[currentLang].nav_home;
}