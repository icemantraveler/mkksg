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
    'U.S.', 'U.K.',
    'M. Bison', 'E. Honda', 'R. Mika',
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

/*
========================================
MORTAL KOMBAT NOTATION
ACCESSIBILITY & TRANSLATION SYSTEM
VERSION 3
========================================
*/

document.addEventListener("DOMContentLoaded", function () {


    /*
    ----------------------------------------
    DIRECTIONAL INDICATORS
    ----------------------------------------
    */

    const directionLabels = {

        "U": "Up",
        "D": "Down",
        "F": "Forward",
        "B": "Back",

        "UF": "Up and Forward",
        "DF": "Down and Forward",
        "DB": "Down and Back",
        "UB": "Up and Back"

    };


    /*
    ----------------------------------------
    BUTTON SYMBOLS
    ----------------------------------------
    */

    const symbolLabels = {

        // Mortal Kombat 1-3

        "HP": "High Punch",
        "LP": "Low Punch",
        "HK": "High Kick",
        "LK": "Low Kick",
        "BL": "Block",
        "RN": "Run",


        // Later Mortal Kombat games

        "FP": "Front Punch",
        "BP": "Back Punch",
        "FK": "Front Kick",
        "BK": "Back Kick",
        "TG": "Tag",
        "TH": "Throw",
        "FS": "Flip Stance",


        // Generic

        "P": "Punch",
        "K": "Kick"

    };


    /*
    ----------------------------------------
    APPLY NOTATION INFORMATION
    ----------------------------------------
    */

    function applyNotationLabel(element, labels) {

    // Prevent processing twice
    if (element.dataset.notationProcessed === "true") {
        return;
    }

    // Get the original abbreviation
    const abbreviation = element.textContent.trim();

    // Find the full meaning
    const meaning = labels[abbreviation];

    // Stop if not recognized
    if (!meaning) {
        return;
    }

    // Preserve the original abbreviation for reference/debugging
    element.dataset.notationOriginal = abbreviation;

    // Accessibility
    element.setAttribute("aria-label", meaning);

    // Mouse-over tooltip
    element.setAttribute("title", meaning);

    // IMPORTANT:
    // Replace the actual visible text with the full meaning.
    // This makes Google Translate and text-to-speech
    // see the full terminology instead of the abbreviation.
    element.textContent = meaning;

    // Mark as processed
    element.dataset.notationProcessed = "true";
}

        /*
        ----------------------------------------
        ACCESSIBILITY
        ----------------------------------------

        Gives screen readers the full meaning.
        */

        element.setAttribute(
            "aria-label",
            meaning
        );


        /*
        ----------------------------------------
        TOOLTIP
        ----------------------------------------

        Shows the meaning when a sighted user
        hovers over the notation.
        */

        element.setAttribute(
            "title",
            meaning
        );


        /*
        ----------------------------------------
        MARK AS PROCESSED
        ----------------------------------------
        */

        element.dataset.notationProcessed = "true";

    }


    /*
    ----------------------------------------
    PROCESS DIRECTIONS
    ----------------------------------------
    */

    document.querySelectorAll(".dir").forEach(function (element) {

        applyNotationLabel(
            element,
            directionLabels
        );

    });


    /*
    ----------------------------------------
    PROCESS BUTTON SYMBOLS
    ----------------------------------------
    */

    document.querySelectorAll(".sym").forEach(function (element) {

        applyNotationLabel(
            element,
            symbolLabels
        );

    });


});
