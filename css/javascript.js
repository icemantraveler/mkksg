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

    // ALWAYS reset to original HTML attributes (critical)
    allImages.forEach(img => {
        img.style.width = img.getAttribute('width') + 'px';
        img.style.height = img.getAttribute('height') + 'px';
    });

    // compute TRUE base width from attributes (NOT DOM)
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
// Block 4: Insert Line Breaks After Chars
// ------------------------------

function insertLineBreaksAfterChars(chars = [':', '.'], exceptions = [')', '"']) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const nodesToModify = [];

    while (walker.nextNode()) {
        nodesToModify.push(walker.currentNode);
    }

    nodesToModify.forEach(textNode => {
        const text = textNode.nodeValue;
        const parent = textNode.parentNode;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            fragment.appendChild(document.createTextNode(char));

            if (chars.includes(char)) {
                const nextChar = text[i + 1] || '';
                if (!exceptions.includes(nextChar)) {
                    fragment.appendChild(document.createElement('br'));
                }
            }
        }

        parent.replaceChild(fragment, textNode);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
        // Increase font size via JS if needed dynamically (optional, because CSS handles it)
        document.body.style.fontSize = '16px';

        // Insert line breaks after colons and periods (with exceptions)
        insertLineBreaksAfterChars([':', '.'], [')', '"']);
    }
});