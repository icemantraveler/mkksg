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
// Block 4: Mobile-specific Line Breaks & Font Size (Minimalist)
// ------------------------------

// Store the original content when the page loads
let originalContent = {};
let isProcessed = false;

function storeOriginalContent() {
    // Store Bio tables content
    document.querySelectorAll('table[id^="bio"]').forEach(table => {
        const tableId = table.id || 'bio-table-' + Array.from(document.querySelectorAll('table[id^="bio"]')).indexOf(table);
        originalContent[tableId] = table.innerHTML;
    });
    
    // Store Special Moves content - store the HTML of elements between header and HR
    document.querySelectorAll('u b').forEach(header => {
        if (header.textContent === 'Special Moves:') {
            const headerId = 'special-moves';
            originalContent[headerId] = [];
            
            // Find all elements between the header and the next HR
            let next = header.parentElement.nextElementSibling;
            while (next && !next.matches('hr')) {
                originalContent[headerId].push({
                    element: next,
                    html: next.innerHTML
                });
                next = next.nextElementSibling;
            }
        }
    });
}

function processPortraitTextSafe() {
    // Only process in portrait mode
    if (window.innerWidth >= window.innerHeight) {
        // Restore original state when not in portrait
        document.querySelectorAll('*').forEach(el => {
            el.style.fontSize = '';
        });
        
        // Restore original content if we've processed it before
        if (isProcessed) {
            restoreOriginalContent();
            isProcessed = false;
        }
        return;
    }

    // Set font size to 16px for all elements
    document.querySelectorAll('*').forEach(el => {
        el.style.fontSize = '16px';
    });
    
    // Restore original content if we've processed it before
    if (isProcessed) {
        restoreOriginalContent();
    }
    
    // Process Bio tables - add breaks after periods
    document.querySelectorAll('table[id^="bio"]').forEach(table => {
        const tableId = table.id || 'bio-table-' + Array.from(document.querySelectorAll('table[id^="bio"]')).indexOf(table);
        if (originalContent[tableId]) {
            table.innerHTML = originalContent[tableId];
        }
        
        table.querySelectorAll('td').forEach(cell => {
            let text = cell.innerHTML;
            // Replace ." with ."<hr>
            text = text.replace(/(\."\s*)/g, '".<hr>');
            // Only add <br> after periods if not already followed by <br> or if not followed by another period
            text = text.replace(/(\.)(?!<br>)(?!\.\s|")/g, '.<br>');
            // Remove any instances of <br><br><br> (triple breaks)
            text = text.replace(/<br><br><br>/g, '<br><br>');
            cell.innerHTML = text;
        });
    });

    // Process Special Moves - add breaks after colons
    document.querySelectorAll('u b').forEach(header => {
        if (header.textContent === 'Special Moves:') {
            // Restore original content first
            if (originalContent['special-moves']) {
                originalContent['special-moves'].forEach(item => {
                    item.element.innerHTML = item.html;
                });
            }
            
            // Find all elements between the header and the next HR
            let next = header.parentElement.nextElementSibling;
            while (next && !next.matches('hr')) {
                let text = next.innerHTML;
                
                if (text && text.includes(':')) {
                    // Only add <br> after colons if not already followed by <br>
                    text = text.replace(/(:)(?!<br>)/g, ':<br>');
                    next.innerHTML = text;
                }
                
                next = next.nextElementSibling;
            }
        }
    });
    
    isProcessed = true;
}

function restoreOriginalContent() {
    // Restore Bio tables content
    document.querySelectorAll('table[id^="bio"]').forEach(table => {
        const tableId = table.id || 'bio-table-' + Array.from(document.querySelectorAll('table[id^="bio"]')).indexOf(table);
        if (originalContent[tableId]) {
            table.innerHTML = originalContent[tableId];
        }
    });
    
    // Restore Special Moves content
    document.querySelectorAll('u b').forEach(header => {
        if (header.textContent === 'Special Moves:') {
            if (originalContent['special-moves']) {
                originalContent['special-moves'].forEach(item => {
                    item.element.innerHTML = item.html;
                });
            }
        }
    });
}

window.addEventListener('load', function() {
    storeOriginalContent();
    processPortraitTextSafe();
});
window.addEventListener('resize', processPortraitTextSafe);