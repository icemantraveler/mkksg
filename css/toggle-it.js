function toggle_it(itemID) {
    if (document.getElementById(itemID).style.display == 'none') {
        document.getElementById(itemID).style.display = 'inline';
    } else {
        document.getElementById(itemID).style.display = 'none';
    }
}