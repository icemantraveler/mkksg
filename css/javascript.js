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

document.oncontextmenu = new Function("alert(message);return false");

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

    // ALWAYS reset to original HTML attributes
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

    if (el.style.display === 'none') {
        el.style.display = 'inline';
    } else {
        el.style.display = 'none';
    }
}

// ------------------------------
// Block 4: Mobile-specific Line Breaks & Font Size (Responsive)
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

let originalHTML = null;

function processTextBlocks() {
    const isPortrait = isMobilePortrait();

    if (!originalHTML) {
        // Store the original HTML on first run
        originalHTML = document.body.innerHTML;
    } else {
        // Reset to original HTML before reapplying
        document.body.innerHTML = originalHTML;
    }

    if (!isPortrait) {
        // If not portrait, just reset font size and stop
        document.body.style.fontSize = '';
        return;
    }

    // Insert line breaks and adjust font size
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let skipInfo = false;

    while (node = walker.nextNode()) {
        const parent = node.parentNode;

        // Skip script/style tags
        if (['SCRIPT', 'STYLE'].includes(parent.nodeName)) continue;

        // Reset skipInfo after <hr>
        if (parent.closest('hr')) skipInfo = false;

        // Skip if inside Info section
        if (skipInfo) continue;

        const text = node.nodeValue.trim();

        // Skip keyword lines
        if (noBreakKeywords.some(kw => text.startsWith(kw))) continue;

        // Start skipping if text contains "Info:"
        if (text.includes('Info:')) {
            skipInfo = true;
            continue;
        }

        // Skip if parent already contains <br>
        if (parent.innerHTML.includes('<br>')) continue;

        // Insert <br> after : and . unless followed by ) or "
        const newHTML = text.replace(/([:.])(?=[^)"\n])/g, '$1<br>');

        // Replace text node with span containing new HTML
        const span = document.createElement('span');
        span.innerHTML = newHTML;
        parent.replaceChild(span, node);
    }

    // Increase font size
    document.body.style.fontSize = '16px';
}

// Run after DOM load
window.addEventListener('DOMContentLoaded', processTextBlocks);

// Reapply on resize (rotation)
window.addEventListener('resize', processTextBlocks);
