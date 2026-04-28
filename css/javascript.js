// ------------------------------
// Block 0: Mobile detection helper
// ------------------------------
function isMobilePortrait() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        && window.innerHeight > window.innerWidth;
}

// ------------------------------
// Block 1: Disable right-click
// ------------------------------
var message = "Function Disabled!";

function clickIE4() {
    if (event.button == 2) {
        alert(message);
        return false;
    }
}

function clickNS4(e) {
    if (document.layers || document.getElementById && !document.all) {
        if (e.which == 2 || e.which == 3) {
            alert(message);
            return false;
        }
    }
}

if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = clickNS4;
} else if (document.all && !document.getElementById) {
    document.onmousedown = clickIE4;
}

document.oncontextmenu = function() { alert(message); return false; };

// ------------------------------
// Block 2: Resize character rows
// ------------------------------
function resizeCharacterRows() {
    const container = document.querySelector('.character-select');
    if (!container) return;

    const children = Array.from(container.childNodes);

    // first row only
    const firstRow = [];
    for (const node of children) {
        if (node.tagName === 'A') firstRow.push(node);
        else if (node.tagName === 'BR') break;
    }

    if (!firstRow.length) return;

    const allImages = container.querySelectorAll('img');

    // reset to original HTML attributes
    allImages.forEach(img => {
        img.style.width = img.getAttribute('width') + 'px';
        img.style.height = img.getAttribute('height') + 'px';
    });

    // compute TRUE base width from attributes
    let rowWidth = 0;
    firstRow.forEach(a => {
        const img = a.querySelector('img');
        const w = parseFloat(img.getAttribute('width'));
        const border = 2; // 1px left + 1px right
        rowWidth += (w + border);
    });

    const availableWidth = container.clientWidth;
    const scale = Math.min(1, availableWidth / rowWidth);

    // apply scaling
    allImages.forEach(img => {
        const w = parseFloat(img.getAttribute('width'));
        const h = parseFloat(img.getAttribute('height'));
        img.style.width = (w * scale) + 'px';
        img.style.height = (h * scale) + 'px';
    });
}

window.addEventListener('load', resizeCharacterRows);
window.addEventListener('resize', resizeCharacterRows);

// ------------------------------
// Block 3: Toggle element visibility
// ------------------------------
function toggle_it(itemID) {
    const el = document.getElementById(itemID);
    if (!el) return;

    el.style.display = (el.style.display === 'none') ? 'inline' : 'none';
}

// ------------------------------
// Block 4: Mobile-specific Line Breaks & Font Size
// ------------------------------

// ------------------------------
// Mobile portrait detection
// ------------------------------
function isMobilePortrait() {
    return window.innerWidth < window.innerHeight;
}

// ------------------------------
// Keywords to skip
// ------------------------------
const noBreakKeywords = [
    "First Appearance:",
    "Origin:",
    "Alignment:",
    "Allies:",
    "Foes:",
    "Fighting Style:",
    "Weapon:"
];

// ------------------------------
// Insert line breaks for vertical mobile
// ------------------------------
function insertLineBreaksMobile() {
    if (!isMobilePortrait()) {
        document.body.style.fontSize = '';
        return;
    }

    document.body.style.fontSize = '16px';

    let skipInfo = false;
    const allElements = Array.from(document.body.children);

    allElements.forEach(el => {
        if (el.tagName === 'HR') {
            skipInfo = false; // reset after <hr>
            return;
        }

        const text = el.textContent || '';

        if (!text.trim()) return;

        // Skip Info section
        if (text.includes('Info:')) {
            skipInfo = true;
            return;
        }
        if (skipInfo) return;

        // Skip lines starting with keywords
        if (noBreakKeywords.some(kw => text.startsWith(kw))) return;

        // Skip if already has <br>
        if (el.innerHTML.includes('<br>')) return;

        // Insert <br> after : or . unless followed by ) or "
        el.innerHTML = text.replace(/([:.])(?=[^)"\n])/g, '$1<br>');
    });
}

// Run on load and on resize
window.addEventListener('DOMContentLoaded', insertLineBreaksMobile);
window.addEventListener('resize', insertLineBreaksMobile);