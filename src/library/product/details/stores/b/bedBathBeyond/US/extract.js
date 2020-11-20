const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  function getAPI () {
    if (!window.location.pathname.includes('/product/')) {
      return false;
    }
    const productId = window.location.pathname.match(/[^/]+$/)[0];
    const API = `${window.location.origin}/apis/stateless/v1.0/sku/product?product=${productId}#[!opt!]{"type":"json"}[/!opt!]`;
    return API;
  }

  async function addRating () {
    if (!window.location.pathname.includes('/product/')) {
      return false;
    }
    const productId = window.location.pathname.match(/[^/]+$/)[0];
    const API = `${window.location.origin}/api/apps/conversations/query/reviews?ProductId=${productId}&Stats=Reviews`;
    const response = await fetch(API);
    const data = await response.json();
    const ratingCount = data.ReviewStatistics && (data.ReviewStatistics.RatingsOnlyReviewCount + data.ReviewStatistics.TotalReviewCount);
    const ratingValue = data.ReviewStatistics && data.ReviewStatistics.AverageOverallRating;
    document.body.setAttribute('rating-count', ratingCount);
    document.body.setAttribute('rating-value', (Math.round(ratingValue * 10) / 10).toString());
  }
  async function getAPIData (api) {
    const response = await fetch(api);
    const json = await response.json();
    if (!json.data) {
      return;
    }
    const data = json.data.map(row => {
      row.SPECS = row.SPECS || [];
      row.FEATURES = row.FEATURES || [];
      const image = row.SCENE7_URL;
      const alternateImages = row.ALT_IMG;
      const nameExtended = row.SKU_FOR_SWATCH && row.SKU_FOR_SWATCH.SKU_TITLE;
      const listPrice = row.WAS_PRICE;
      const price = row.IS_PRICE;
      const availabilityText = row.ONLINE_INVENTORY;
      const quantity = row.SKU_SIZE;
      const specifications = [...row.SPECS, ...row.FEATURES];
      let weightNet = specifications && specifications.find(prop => prop['Weight Capacity']) && specifications.find(prop => prop['Weight Capacity'])['Weight Capacity'];
      if (!weightNet) {
        weightNet = specifications && specifications.find(prop => prop['Product Weight (lb)']) && specifications.find(prop => prop['Product Weight (lb)'])['Product Weight (lb)'];
        weightNet = weightNet ? weightNet + 'lbs' : undefined;
      }
      const gtin = row.UPC;
      const sku = row.PRODUCT_ID;
      const variantId = row.SKU_ID;
      const mpc = specifications && specifications.find(prop => prop['Part or Model Number']) && specifications.find(prop => prop['Part or Model Number'])['Part or Model Number'];
      const color = row.COLOR;
      const colorGroup = row.COLOR_GROUP;
      const name = row.SKU_FOR_SWATCH && row.SKU_FOR_SWATCH.SKU_TITLE;
      const warranty = specifications && specifications.find(prop => prop.Warranty) && specifications.find(prop => prop.Warranty).Warranty;
      const countryOfOrigin = specifications && specifications.find(prop => prop['Made In']) && specifications.find(prop => prop['Made In'])['Made In'];
      const specificationsString = (specifications.length && JSON.stringify(specifications)) || undefined;
      return { image, alternateImages, nameExtended, listPrice, price, availabilityText, size: quantity, weightNet, gtin, sku, variantId, mpc, color, colorGroup, name, specifications: specificationsString, warranty, countryOfOrigin };
    });
    return data;
  }

  function generateDynamicTable (jsonData) {
    const dataLength = jsonData.length;

    if (dataLength > 0) {
      const table = document.createElement('table');
      table.style.width = '50%';
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
          td.setAttribute('class', col[j]);
          if (jsonData[i][col[j]] && (jsonData[i][col[j]] !== 'null' || jsonData[i][col[j]] !== 'undefined')) {
            td.innerHTML = jsonData[i][col[j]];
          }
          bRow.appendChild(td);
        }
        tBody.appendChild(bRow);
      }
      table.appendChild(tBody);

      const container = document.createElement('div');
      container.setAttribute('id', 'product-detail-api');
      container.setAttribute('style', 'overflow:auto;');
      container.innerHTML = '';
      container.appendChild(table);
      document.body.append(container);
    }
  }

  async function closePopUp () {
    const popUpSelector = 'button[data-click="close"]';
    const popUp = await context.evaluate((selector) => !!document.querySelector(selector), popUpSelector);
    if (popUp) {
      await context.click(popUpSelector);
      await context.waitForNavigation({ waitUntil: 'load' });
    }
  }

  await context.evaluate(() => {
    if (!document.querySelector('meta[property="og:type"]') || document.querySelector('meta[property="og:type"]') &&
        document.querySelector('meta[property="og:type"]').getAttribute('content') !== 'product') {
      throw new Error('Not a product Page');
    }
  });
  const API = await context.evaluate(getAPI);
  const jsonData = await context.evaluate(getAPIData, API);
  const showMoreSelector = '[class^="ShowMore"] > button';
  const showMore = await context.evaluate((selector) => !!document.querySelector(selector), showMoreSelector);
  if (showMore) {
    await context.click(showMoreSelector);
    await context.waitForNavigation({ waitUntil: 'load' });
  }
  // enhanced content
  const showMoreSelector2 = '#wc-read-button';
  const showMore2 = await context.evaluate((selector) => !!document.querySelector(selector), showMoreSelector2);
  if (showMore2) {
    await context.click(showMoreSelector2);
    await context.waitForNavigation({ waitUntil: 'load' });
  }
  const showMoreSelector3 = '[onclick="_wcsite.readmore.buttonOnClick()"]';
  const showMore3 = await context.evaluate((selector) => !!document.querySelector(selector), showMoreSelector3);
  if (showMore3) {
    await context.click(showMoreSelector3);
    await context.waitForNavigation({ waitUntil: 'load' });
  }

  await closePopUp();

  const variantSelector = '#sizeSelect ul[aria-label="options"] > li:not(.selected) > button, [id*="swatches"] ul[aria-label="options"] > li:not(.selected) > button';
  const variant = await context.evaluate((selector) => !!document.querySelector(selector), variantSelector);
  if (variant) {
    await context.click(variantSelector);
    await context.waitForMutuation('h1[itemprop="name"],#specs,html', { timeout: 20000 });
  }
  // get iframe videos from enhanced content.
  await context.evaluate(() => {
    let videos = [];
    const iframes = Array.from(document.querySelectorAll('[title="Product Videos"]'));
    for (const iframe of iframes) {
      const videoLinks = [...iframe.contentWindow.document.querySelectorAll('video')].map(elm => elm.src);
      videos = videos.concat(videoLinks);
    }
    if (videos.length) {
      document.body.setAttribute('video', videos.join('|'));
    }
  });
  if (jsonData) {
    await context.evaluate(generateDynamicTable, jsonData);
  }
  await context.evaluate(() => {
    let video = document.querySelector('button[data-locator="pdp-productalternateimage"] > a');
    if(video) {
      video.click();
    }
  });
  await context.evaluate(addRating);
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedBathBeyond',
    transform,
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
  implementation,
};
