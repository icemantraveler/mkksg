(function() {
  const kombatKodesCSS = `
    /* =========================
       Kombat Kodes Table
       ========================= */
    .kombat-kodes-table {
      font: inherit;
      color: #D0D0D0;
      width: 100%;
      max-width: 850px;
      border-collapse: collapse;
      line-height: 1.5;
    }
    .kombat-kodes-table td {
      padding: 2px 4px;
      vertical-align: top;
    }

    /* Mobile / Small Screen Card View */
    @media (max-width: 650px) {
      .kombat-kodes-table {
        border: none !important;
      }
      .kombat-kodes-table, 
      .kombat-kodes-table tbody, 
      .kombat-kodes-table tr, 
      .kombat-kodes-table td {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
      .kombat-kodes-table thead {
        display: none;
      }
      .kombat-kodes-table tr {
        border: 1px solid #808080;
        border-radius: 6px;
        margin-bottom: 14px;
        padding: 10px;
      }
      .kombat-kodes-table td {
        border: none !important;
        text-align: left !important;
        padding: 3px 0;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.textContent = kombatKodesCSS;
  document.head.appendChild(styleElement);
})();
