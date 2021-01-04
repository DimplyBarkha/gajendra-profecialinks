const { transform } = require('../format.js');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  /* '
  *  @INFO Don't go to search page. Use sku as input id with the template https://www.boots.com/ProductDisplay?productId={id}.

  const onSearchPage = await context.evaluate(() => {
    return !!document.querySelector('.product_name_link');
  });
  if (onSearchPage) {
    await context.clickAndWaitForNavigation('.product_name_link', { timeout: 15000 }, { waitUntil: 'load' });
  } */

  async function getVideoLinks () {
    const selector = 'div.videoContainer iframe,.isitetv-video-container iframe';
    const iframe = document.querySelector(selector);
    if (!iframe) return;
    if (document.querySelector(selector).src.includes('www.youtube')) {
      document.body.setAttribute('video-links', document.querySelector(selector).src);
      return;
    }
    const response = await fetch(document.querySelector(selector).src);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const videoElements = Array.from(doc.querySelectorAll('[id^=isitetv_nav_item_nav_ul] > li > a'));
    const videoLinks = videoElements.map(elm => ({ videoId: elm.getAttribute('onclick').match(/log_action\(\d+,\d+,\d+,\d+,\d+,(\d+)/)[1], folderId: elm.querySelector('img').src.match(/media\/video\/([^\/]+)/)[1] }))
      .map(elm => `https://flv.isitetv.com/media/video/${elm.folderId}/video_url_${elm.videoId}_${elm.folderId}.m4v`).join('|');
    document.body.setAttribute('video-links', videoLinks);
    return videoLinks;
  }
  await context.evaluate(getVideoLinks);
  async function addData () {
    function addDynamicTable (jsonData, appendSelector) {
      function generateDynamicTable (jsonData) {
        const dataLength = jsonData.length;

        jsonData = jsonData.map(elm => {
          if (typeof elm !== 'object') {
            return { item: elm };
          } return elm;
        });
        if (dataLength > 0) {
          const table = document.createElement('table');
          table.style.width = '100%';
          table.setAttribute('border', '1');
          table.setAttribute('cellspacing', '0');
          table.setAttribute('cellpadding', '5');

          const col = [];
          for (let i = 0; i < dataLength; i++) {
            for (const key in jsonData[i]) {
              if (col.indexOf(key) === -1) {
                col.push(key);
              }
            }
          }
          const tHead = document.createElement('thead');
          tHead.setAttribute('bgcolor', '#CCC4F5');
          tHead.style.color = 'black';
          const hRow = document.createElement('tr');

          for (let i = 0; i < col.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = col[i];
            hRow.appendChild(th);
          }
          tHead.appendChild(hRow);
          table.appendChild(tHead);

          const tBody = document.createElement('tbody');

          for (let i = 0; i < dataLength; i++) {
            const bRow = document.createElement('tr');
            for (let j = 0; j < col.length; j++) {
              const td = document.createElement('td');
              table.style.padding = '5px';
              table.style.margin = '5px auto';
              td.setAttribute('class', col[j]);
              if (
                jsonData[i][col[j]] &&
    (jsonData[i][col[j]] !== 'null' ||
    jsonData[i][col[j]] !== 'undefined')
              ) {
                if (typeof jsonData[i][col[j]] === 'object') {
                  if (Array.isArray(jsonData[i][col[j]])) {
                    const table = generateDynamicTable(jsonData[i][col[j]]);
                    table && td.append(table);
                  } else {
                    const table = generateDynamicTable([jsonData[i][col[j]]]);
                    table && td.append(table);
                  }
                } else {
                  td.innerText = jsonData[i][col[j]];
                }
              }
              bRow.appendChild(td);
              bRow.style.padding = '5px';
            }
            tBody.appendChild(bRow);
          }
          table.appendChild(tBody);
          return table;
        }
      }
      const table = generateDynamicTable(jsonData);
      const container = document.createElement('div');
      container.setAttribute('id', 'added-table');
      container.setAttribute('style', 'overflow:auto');
      container.innerHTML = '';
      container.appendChild(table);
      document.querySelector(appendSelector).append(container);
    }
    if (window.productVarientsObject) {
      for (const key in productVarientsObject) {
        const productCode = productVarientsObject[key].productCode;
        const color = productVarientsObject[key].colorName;
        productVarientsObject[key].image = `https://boots.scene7.com/is/image/Boots/${productCode}H`;
        const stock = document.querySelector(`[for="${color}"] span[class*='OutofStock']`) ? 'Out of Stock' : 'In Stock';
        productVarientsObject[key].stock = stock;
      }
      addDynamicTable([productVarientsObject], '#footerWrapper');
    }
  }
  await context.evaluate(addData);
  await context.evaluate(() => {
    if (!document.querySelector('#added-table')) {
      document.body.classList.add('no-variants');
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
