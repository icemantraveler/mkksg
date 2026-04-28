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
// Mobile Portrait Detection
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
// Insert Line Breaks on Mobile
// ------------------------------
function insertLineBreaksMobile() {
    if (!isMobilePortrait()) {
        document.body.style.fontSize = '';
        return;
    }

    document.body.style.fontSize = '16px';

    let skipInfo = false;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);

    let node;
    while ((node = walker.nextNode())) {
        const tag = node.tagName;

        // Reset after <hr>
        if (tag === 'HR') {
            skipInfo = false;
            continue;
        }

        // Skip interactive and inline structural tags
        if (['FORM','SELECT','OPTION','BUTTON','INPUT','TEXTAREA','A','IMG','SCRIPT','STYLE'].includes(tag)) {
            continue;
        }

        // Skip if inside Info section
        if (skipInfo) continue;

        const text = node.textContent || '';
        if (!text.trim()) continue;

        // Start skipping if text contains "Info:"
        if (text.includes('Info:')) {
            skipInfo = true;
            continue;
        }

        // Skip lines starting with keywords
        if (noBreakKeywords.some(kw => text.trim().startsWith(kw))) continue;

        // Skip if node already contains <br>
        if (node.innerHTML.includes('<br>')) continue;

        // Replace ':' and '.' with <br> unless followed by ) or "
        let newHTML = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            newHTML += char;
            if (char === ':' || char === '.') {
                const nextChar = text[i+1] || '';
                if (nextChar !== ')' && nextChar !== '"') {
                    newHTML += '<br>';
                }
            }
        }

        node.innerHTML = newHTML;
    }
}

// ------------------------------
// Run on DOM load and resize
// ------------------------------
window.addEventListener('DOMContentLoaded', insertLineBreaksMobile);
window.addEventListener('resize', insertLineBreaksMobile);