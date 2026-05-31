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
// Block 4: Format specials/finishers/combos (break after colon ONLY if needed)
// ------------------------------
// ------------------------------
// Block 4: Format bios + moves (fixed clean version)
// ------------------------------

function formatBio(text) {
  const abbreviations = [
    'Mr.', 'Mrs.', 'Ms.', 'Dr.',
    'Prof.', 'Sr.', 'Jr.',
    'Maj.', 'Lt.', 'Capt.', 'Col.',
    'Gen.', 'Sgt.', 'Cmdr.',
    'U.S.', 'U.K.'
  ];

  let protectedText = text;

  abbreviations.forEach(abbr => {
    const escaped = abbr.replace(/\./g, '\\.');
    protectedText = protectedText.replace(
      new RegExp(escaped, 'g'),
      abbr.replace(/\./g, '__DOT__')
    );
  });

  protectedText = protectedText.replace(/\.\s+/g, '.<br>');
  protectedText = protectedText.replace(/__DOT__/g, '.');

  return protectedText;
}

function formatMoves() {
  document.querySelectorAll('.specials, .finishers, .combos').forEach(el => {
    const original = el.dataset.original || el.innerHTML;

    if (!el.dataset.original) {
      el.dataset.original = original;
    }

    el.innerHTML = original;

    if (window.innerWidth >= window.innerHeight) return;

    const lines = original.split(/<br\s*\/?>/i);

    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.whiteSpace = 'nowrap';

    const style = window.getComputedStyle(el);
    testDiv.style.fontSize = style.fontSize;
    testDiv.style.fontFamily = style.fontFamily;
    testDiv.style.fontWeight = style.fontWeight;
    testDiv.style.letterSpacing = style.letterSpacing;

    document.body.appendChild(testDiv);

    const processed = lines.map(line => {
      if (!line.includes(':')) return line;

      testDiv.innerHTML = line;

      const isTooWide = testDiv.scrollWidth > el.clientWidth;

      if (isTooWide) {
        return line.replace(/:(\s*)/, ':<br>$1');
      }

      return line;
    });

    document.body.removeChild(testDiv);

    el.innerHTML = processed.join('<br>');
  });
}

function formatAll() {
  const isPortrait = window.innerWidth < window.innerHeight;

  // BIOS
  document.querySelectorAll('.bio').forEach(el => {
    const original = el.dataset.original || el.innerHTML;

    if (!el.dataset.original) {
      el.dataset.original = original;
    }

    el.innerHTML = isPortrait ? formatBio(original) : original;
  });

  // MOVES
  formatMoves();
}

window.addEventListener('load', formatAll);
window.addEventListener('resize', formatAll);
// ------------------------------
// DEBUG: Highlight formatted sections
// ------------------------------
window.addEventListener('load', () => {
  document.querySelectorAll('.info, .bio, .specials, .finishers, .combos, .clues, .howtofight, .howtoplayas, .morphs, .intro, .ending, .taunts, .howtounlock, .dlc, .throws')
    .forEach(el => {
      el.style.backgroundColor = 'rgba(0, 150, 255, 0.25)';
      el.style.outline = '1px solid #0096ff';
    });
});