var onlineMode = localStorage.getItem('onlineMode') === 'true';

function loadFontAwesome() {
    if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        link.id = 'fontawesome-css';
        document.head.appendChild(link);
    }
}

function removeFontAwesome() {
    var fa = document.getElementById('fontawesome-css');
    if (fa) fa.remove();
}

var iconMap = {
    '🧮': '<i class="fas fa-calculator"></i>',
    '🔐': '<i class="fas fa-lock"></i>',
    '📝': '<i class="fas fa-edit"></i>',
    '📊': '<i class="fas fa-chart-line"></i>',
    '🎨': '<i class="fas fa-palette"></i>',
    '⏱️': '<i class="fas fa-stopwatch"></i>',
    '🎵': '<i class="fas fa-music"></i>',
    '🎬': '<i class="fas fa-film"></i>',
    '📂': '<i class="fas fa-folder-open"></i>',
    '🏠': '<i class="fas fa-home"></i>',
    '👥': '<i class="fas fa-users"></i>',
    '🛠️': '<i class="fas fa-tools"></i>',
    '⚙️': '<i class="fas fa-cogs"></i>',
    '🎤': '<i class="fas fa-microphone-alt"></i>',
    '➕': '<i class="fas fa-plus-circle"></i>',
    '🗑️': '<i class="fas fa-trash-alt"></i>',
    '🔄': '<i class="fas fa-sync-alt"></i>',
    '🔁': '<i class="fas fa-redo-alt"></i>',
    '💾': '<i class="fas fa-save"></i>',
    '👤': '<i class="fas fa-user-circle"></i>',
    '✨': '<i class="fas fa-star"></i>',
    '⚡': '<i class="fas fa-bolt"></i>',
    '🔍': '<i class="fas fa-search"></i>',
    '🚪': '<i class="fas fa-sign-out-alt"></i>',
    '📀': '<i class="fas fa-compact-disc"></i>',
    '🌐': '<i class="fas fa-globe"></i>',
    '🤖': '<i class="fas fa-robot"></i>',
    '⏮️': '<i class="fas fa-step-backward"></i>',
    '⏭️': '<i class="fas fa-step-forward"></i>',
    '▶️': '<i class="fas fa-play"></i>',
    '⏸️': '<i class="fas fa-pause"></i>',
    '🔇': '<i class="fas fa-volume-mute"></i>',
    '🔊': '<i class="fas fa-volume-up"></i>',
    '📁': '<i class="fas fa-folder"></i>',
    '📄': '<i class="fas fa-file"></i>',
    '🔀': '<i class="fas fa-random"></i>',
    '❤️': '<i class="fas fa-heart"></i>',
    '🤍': '<i class="far fa-heart"></i>',
    '🎧': '<i class="fas fa-headphones"></i>',
    '🧑‍💻': '<i class="fas fa-laptop-code"></i>',
    '🌙': '<i class="fas fa-moon"></i>',
    '☀️': '<i class="fas fa-sun"></i>',
    '🕒': '<i class="fas fa-clock"></i>',
    '🔒': '<i class="fas fa-lock"></i>',
    '🔓': '<i class="fas fa-lock-open"></i>',
    '📏': '<i class="fas fa-ruler"></i>',
    '⚖️': '<i class="fas fa-balance-scale"></i>',
    '🔢': '<i class="fas fa-sort-numeric-down"></i>',
    '🧬': '<i class="fas fa-dna"></i>',
    '📈': '<i class="fas fa-chart-line"></i>',
    '📉': '<i class="fas fa-chart-line"></i>',
    '🖌️': '<i class="fas fa-paint-brush"></i>',
    '🖱️': '<i class="fas fa-mouse-pointer"></i>',
    '⌨️': '<i class="fas fa-keyboard"></i>',
    '🖨️': '<i class="fas fa-print"></i>',
    '📱': '<i class="fas fa-mobile-alt"></i>',
    '💻': '<i class="fas fa-laptop"></i>',
    '🖥️': '<i class="fas fa-desktop"></i>',
    '☁️': '<i class="fas fa-cloud"></i>',
    '💡': '<i class="fas fa-lightbulb"></i>',
    '🔋': '<i class="fas fa-battery-full"></i>',
    '🔌': '<i class="fas fa-plug"></i>',
    '🧲': '<i class="fas fa-magnet"></i>',
    '🧪': '<i class="fas fa-flask"></i>',
    '📡': '<i class="fas fa-satellite-dish"></i>',
    '🚀': '<i class="fas fa-rocket"></i>',
    '🎯': '<i class="fas fa-bullseye"></i>',
    '🎲': '<i class="fas fa-dice"></i>',
    '♻️': '<i class="fas fa-recycle"></i>',
    '✅': '<i class="fas fa-check-circle"></i>',
    '❌': '<i class="fas fa-times-circle"></i>',
    '⚠️': '<i class="fas fa-exclamation-triangle"></i>',
    'ℹ️': '<i class="fas fa-info-circle"></i>',
    '❓': '<i class="fas fa-question-circle"></i>',
    '💯': '<i class="fas fa-hundred-points"></i>',
    '⭐': '<i class="fas fa-star"></i>',
    '🌟': '<i class="fas fa-star-of-life"></i>',
    '🔥': '<i class="fas fa-fire"></i>',
    '💧': '<i class="fas fa-tint"></i>',
    '🌊': '<i class="fas fa-water"></i>',
    '🌈': '<i class="fas fa-rainbow"></i>',
    '🌍': '<i class="fas fa-globe-africa"></i>',
    '🌎': '<i class="fas fa-globe-americas"></i>',
    '🌏': '<i class="fas fa-globe-asia"></i>',
    '🔔': '<i class="fas fa-bell"></i>',
    '🔕': '<i class="fas fa-bell-slash"></i>',
    '📌': '<i class="fas fa-thumbtack"></i>',
    '📍': '<i class="fas fa-map-marker-alt"></i>',
    '✉️': '<i class="fas fa-envelope"></i>',
    '📧': '<i class="fas fa-envelope-open"></i>',
    '📨': '<i class="fas fa-envelope"></i>',
    '📩': '<i class="fas fa-envelope"></i>',
    '📤': '<i class="fas fa-share-square"></i>',
    '📥': '<i class="fas fa-download"></i>',
    '📦': '<i class="fas fa-box"></i>',
    '🗂️': '<i class="fas fa-folder-open"></i>',
    '🗄️': '<i class="fas fa-archive"></i>',
    '🗳️': '<i class="fas fa-vote-yea"></i>',
    '🗺️': '<i class="fas fa-map"></i>',
    '🗿': '<i class="fas fa-crown"></i>',
    '👑': '<i class="fas fa-crown"></i>',
    '💎': '<i class="fas fa-gem"></i>',
    '💍': '<i class="fas fa-ring"></i>',
    '🎁': '<i class="fas fa-gift"></i>',
    '🎈': '<i class="fas fa-balloon"></i>',
    '🎉': '<i class="fas fa-glass-cheers"></i>',
    '🎊': '<i class="fas fa-glass-cheers"></i>',
    '🎀': '<i class="fas fa-ribbon"></i>',
    '🎗️': '<i class="fas fa-ribbon"></i>',
    '💝': '<i class="fas fa-heart"></i>',
    '💖': '<i class="fas fa-heartbeat"></i>',
    '💗': '<i class="fas fa-heart"></i>',
    '💓': '<i class="fas fa-heartbeat"></i>',
    '💔': '<i class="fas fa-heart-broken"></i>',
    '💕': '<i class="fas fa-heart"></i>',
    '💞': '<i class="fas fa-heart"></i>',
    '💟': '<i class="fas fa-heart"></i>',
    '❣️': '<i class="fas fa-heart"></i>',
    '💌': '<i class="fas fa-envelope-heart"></i>',
    '💘': '<i class="fas fa-heart"></i>',
    '💋': '<i class="fas fa-kiss"></i>',
    '👋': '<i class="fas fa-hand-peace"></i>',
    '👌': '<i class="fas fa-hand-peace"></i>',
    '👍': '<i class="fas fa-thumbs-up"></i>',
    '👎': '<i class="fas fa-thumbs-down"></i>',
    '✌️': '<i class="fas fa-hand-peace"></i>',
    '🤞': '<i class="fas fa-hand-peace"></i>',
    '🤟': '<i class="fas fa-hand-peace"></i>',
    '🤘': '<i class="fas fa-hand-peace"></i>',
    '👈': '<i class="fas fa-hand-point-left"></i>',
    '👉': '<i class="fas fa-hand-point-right"></i>',
    '👆': '<i class="fas fa-hand-point-up"></i>',
    '👇': '<i class="fas fa-hand-point-down"></i>',
    '🖕': '<i class="fas fa-hand-middle-finger"></i>',
    '🖐️': '<i class="fas fa-hand-peace"></i>',
    '✋': '<i class="fas fa-hand-peace"></i>',
    '🤚': '<i class="fas fa-hand-peace"></i>',
    '🖖': '<i class="fas fa-hand-peace"></i>',
    '👏': '<i class="fas fa-clapping-hands"></i>',
    '🙌': '<i class="fas fa-hands"></i>',
    '🤲': '<i class="fas fa-hands"></i>',
    '🤝': '<i class="fas fa-handshake"></i>',
    '🙏': '<i class="fas fa-hands-praying"></i>',
    '✍️': '<i class="fas fa-pen"></i>',
    '💅': '<i class="fas fa-paint-brush"></i>',
    '🤳': '<i class="fas fa-camera"></i>',
    '💪': '<i class="fas fa-strong"></i>',
    '🦵': '<i class="fas fa-walking"></i>',
    '🦶': '<i class="fas fa-walking"></i>',
    '👂': '<i class="fas fa-ear-listen"></i>',
    '👃': '<i class="fas fa-nose"></i>',
    '🧠': '<i class="fas fa-brain"></i>',
    '🦷': '<i class="fas fa-tooth"></i>',
    '🦴': '<i class="fas fa-bone"></i>',
    '👀': '<i class="fas fa-eye"></i>',
    '👁️': '<i class="fas fa-eye"></i>',
    '👅': '<i class="fas fa-tongue"></i>',
    '👄': '<i class="fas fa-lips"></i>',
    '👶': '<i class="fas fa-baby"></i>',
    '👧': '<i class="fas fa-girl"></i>',
    '👦': '<i class="fas fa-boy"></i>',
    '👩': '<i class="fas fa-woman"></i>',
    '👨': '<i class="fas fa-man"></i>',
    '👴': '<i class="fas fa-old-man"></i>',
    '👵': '<i class="fas fa-old-woman"></i>',
    '👩‍💻': '<i class="fas fa-laptop-code"></i>',
    '👨‍💻': '<i class="fas fa-laptop-code"></i>',
    '👩‍⚕️': '<i class="fas fa-stethoscope"></i>',
    '👨‍⚕️': '<i class="fas fa-stethoscope"></i>',
    '👩‍🎓': '<i class="fas fa-graduation-cap"></i>',
    '👨‍🎓': '<i class="fas fa-graduation-cap"></i>',
    '👩‍🏫': '<i class="fas fa-chalkboard-teacher"></i>',
    '👨‍🏫': '<i class="fas fa-chalkboard-teacher"></i>',
    '👩‍🌾': '<i class="fas fa-tractor"></i>',
    '👨‍🌾': '<i class="fas fa-tractor"></i>',
    '👩‍🍳': '<i class="fas fa-utensils"></i>',
    '👨‍🍳': '<i class="fas fa-utensils"></i>',
    '👩‍🔧': '<i class="fas fa-wrench"></i>',
    '👨‍🔧': '<i class="fas fa-wrench"></i>',
    '👩‍🏭': '<i class="fas fa-industry"></i>',
    '👨‍🏭': '<i class="fas fa-industry"></i>',
    '👩‍💼': '<i class="fas fa-briefcase"></i>',
    '👨‍💼': '<i class="fas fa-briefcase"></i>',
    '👩‍🔬': '<i class="fas fa-microscope"></i>',
    '👨‍🔬': '<i class="fas fa-microscope"></i>',
    '👩‍🎨': '<i class="fas fa-palette"></i>',
    '👨‍🎨': '<i class="fas fa-palette"></i>',
    '👩‍🚒': '<i class="fas fa-fire-extinguisher"></i>',
    '👨‍🚒': '<i class="fas fa-fire-extinguisher"></i>',
    '👩‍✈️': '<i class="fas fa-plane"></i>',
    '👨‍✈️': '<i class="fas fa-plane"></i>',
    '👩‍🚀': '<i class="fas fa-rocket"></i>',
    '👨‍🚀': '<i class="fas fa-rocket"></i>',
    '👩‍⚖️': '<i class="fas fa-gavel"></i>',
    '👨‍⚖️': '<i class="fas fa-gavel"></i>',
    '👰': '<i class="fas fa-wedding"></i>',
    '🤵': '<i class="fas fa-tuxedo"></i>',
    '👸': '<i class="fas fa-crown"></i>',
    '🤴': '<i class="fas fa-crown"></i>',
    '🦸': '<i class="fas fa-mask"></i>',
    '🦹': '<i class="fas fa-mask"></i>',
    '🧙': '<i class="fas fa-hat-wizard"></i>',
    '🧚': '<i class="fas fa-fairy"></i>',
    '🧛': '<i class="fas fa-vampire"></i>',
    '🧜': '<i class="fas fa-mermaid"></i>',
    '🧝': '<i class="fas fa-elf"></i>',
    '🧞': '<i class="fas fa-genie"></i>',
    '🧟': '<i class="fas fa-zombie"></i>',
    '📺': '<i class="fas fa-tv"></i>',
    '🎬': '<i class="fas fa-film"></i>',
    '▶️': '<i class="fas fa-play"></i>',
    '⏸️': '<i class="fas fa-pause"></i>',
    '🔀': '<i class="fas fa-random"></i>',
    '📋': '<i class="fas fa-copy"></i>',
    '✅': '<i class="fas fa-check"></i>',
    '🖥️': '<i class="fas fa-desktop"></i>',
    '🎭': '<i class="fas fa-theater-masks"></i>',
    '🖼️': '<i class="fas fa-image"></i>',
    '⏩': '<i class="fas fa-forward"></i>',
    '⏪': '<i class="fas fa-backward"></i>',
    '🔇': '<i class="fas fa-volume-mute"></i>',
    '🔊': '<i class="fas fa-volume-up"></i>',
    '🔍': '<i class="fas fa-search"></i>',
    '🏠': '<i class="fas fa-home"></i>'
};

function replaceEmojisInElement(element) {
    if (!element) return;
    if (element.nodeType === Node.TEXT_NODE) {
        var text = element.textContent;
        var replaced = false;
        var newHtml = text;
        for (var emoji in iconMap) {
            if (newHtml.includes(emoji)) {
                newHtml = newHtml.split(emoji).join(iconMap[emoji]);
                replaced = true;
            }
        }
        if (replaced) {
            var span = document.createElement('span');
            span.innerHTML = newHtml;
            element.parentNode.replaceChild(span, element);
        }
    } else if (element.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'CODE'].includes(element.tagName)) {
        for (var i = 0; i < element.childNodes.length; i++) {
            replaceEmojisInElement(element.childNodes[i]);
        }
    }
}

function replaceAllEmojis() {
    replaceEmojisInElement(document.body);
}

var observer = null;

function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(function(mutations) {
        setTimeout(function() {
            replaceAllEmojis();
        }, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function stopObserving() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

function setOnlineMode(isOnline) {
    onlineMode = isOnline;
    localStorage.setItem('onlineMode', isOnline);
    if (isOnline) {
        loadFontAwesome();
        replaceAllEmojis();
        startObserving();
    } else {
        removeFontAwesome();
        stopObserving();
        location.reload();
    }
}

if (onlineMode) {
    loadFontAwesome();
    document.addEventListener('DOMContentLoaded', function() {
        replaceAllEmojis();
        startObserving();
    });
} else {
    document.addEventListener('DOMContentLoaded', function() {
        removeFontAwesome();
    });
}