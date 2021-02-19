/* eslint-disable no-mixed-operators */
const { transform } = require('../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { helperModule: { Helpers } } = dependencies;
  const helper = new Helpers(context);

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
    const API = `${window.location.origin}/apis/services/conversations/review?ProductId=${productId}&Stats=Reviews&sort=SubmissionTime+desc&start=0&rows=5`;
    const response = await fetch(API);
    const data = await response.json();
    const ratingCount = data.ReviewStatistics && (data.ReviewStatistics.RatingsOnlyReviewCount + data.ReviewStatistics.TotalReviewCount);
    let ratingValue = data.ReviewStatistics && data.ReviewStatistics.AverageOverallRating;
    ratingValue = typeof (ratingValue) === 'string' ? ratingValue.replace(/NaN/g, '') : ratingValue;
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

  await context.evaluate(() => {
    if (!document.querySelector('meta[property="og:type"]') || document.querySelector('meta[property="og:type"]') &&
      document.querySelector('meta[property="og:type"]').getAttribute('content') !== 'product') {
      throw new Error('Not a product Page');
    }
  });
  const API = await context.evaluate(getAPI);
  const jsonData = await context.evaluate(getAPIData, API);
  const showMores = ['[class^="ShowMore"] > button', '#wc-read-button', '[onclick="_wcsite.readmore.buttonOnClick()"]'];
  await Promise.all(showMores.map(selector => helper.checkAndClick(selector, 'CSS', { waitUntil: 'load' })));

  const popUps = ['button[data-click="close"]', 'a[data-click="close"][class="bx-close bx-close-link bx-close-inside"]'];
  await Promise.all(popUps.map(selector => helper.checkAndClick(selector, 'CSS', { waitUntil: 'load' })));

  const variantSelector = '#sizeSelect ul[aria-label="options"] > li:not(.selected) > button, [id*="swatches"] ul[aria-label="options"] > li:not(.selected) > button';
  const variant = await context.evaluate((selector) => !!document.querySelector(selector), variantSelector);
  if (variant) {
    await helper.ifThereClickOnIt(variantSelector);
    await context.waitForMutuation('h1[itemprop="name"],#specs,html', { timeout: 20000 });
  }
  // get iframe videos from enhanced content.
  await context.evaluate(() => {
    let videos = [];

    const iframes = Array.from(document.querySelectorAll('[title="Product Videos"]'));
    for (const iframe of iframes) {
      // @ts-ignore
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
  await addSpecification();
  await helper.addURLtoDocument('producturl');
  const imagesZoom = 'button[data-locator="pdp-productalternateimage"] > a';
  await helper.ifThereClickOnIt(imagesZoom);
  await context.evaluate(addRating);

  async function addSpecification () {
    await context.evaluate(async function () {
      window.scrollTo(0, document.body.scrollHeight);
      async function timeout (ms) {
        console.log('waiting for ' + ms + ' millisecs');
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(6000);
      const specificationElms = document.querySelectorAll('div[id*="wc-specs"] *[class*="row"]');
      if (specificationElms && specificationElms.length > 0) {
        console.log('we have the specification tab');
        for (let i = 0; i < specificationElms.length; i++) {
          let text = '';
          // @ts-ignore
          if (specificationElms[i] && specificationElms[i].innerText) {
            // @ts-ignore
            text = specificationElms[i].innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' ');
            console.log(text);
          } else {
            console.log('we do not have the spec elm or its innercontent for ' + i + 'th element');
          }
          const newDiv = document.createElement('div');
          newDiv.id = 'specification-' + i;
          newDiv.textContent = text;
          document.body.appendChild(newDiv);
        }
      } else {
        console.log('we do not have the specification tab in the webpage, it might be a case that the spec tab has not loaded yet. If you see one - check with specificationElms selector');
      }
    });
  }

  // For the Additional Fields
  // await context.evaluate(() => {
  //   const syndiPowerpage = document.querySelector('.syndi_powerpage');
  //   let inTheBoxText = '';
  //   let inTheBoxUrl = '';
  //   let hasComparisonTable = 'No';
  //   if (syndiPowerpage) {
  //     const headings = Array.from(syndiPowerpage.shadowRoot.querySelectorAll('h2'));
  //     headings.forEach(h2 => {
  //       if (h2.innerText.includes('In the box') || h2.innerText.includes('In The Box') || h2.innerText.includes('in the box') || h2.innerText.includes("What's Included")) {
  //         const parent = h2.parentElement;
  //         const inTheBoxEls = parent.querySelectorAll('.syndigo-featureset-feature');
  //         inTheBoxEls.forEach(el => {
  //           const imgs = el.querySelector('img').getAttribute('srcset').split(',');
  //           let images = '';
  //           if (imgs.length === 1) {
  //             images = imgs[0];
  //           } else {
  //             images = imgs[imgs.length - 1];
  //           }
  //           images = images.replace(/(.+)(\s.+)/, '$1');
  //           inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + images;
  //           // @ts-ignore
  //           inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + el.innerText;
  //         });
  //       }
  //     });
  //     const table = syndiPowerpage.shadowRoot.querySelector('div[class*="comparison-table"] table');
  //     if (table) {
  //       hasComparisonTable = 'Yes';
  //     }
  //   } else {
  //     const table = document.querySelector('div[class*="comparison-table"] table');
  //     if (table) {
  //       hasComparisonTable = 'Yes';
  //     }
  //     const inTheBoxEls1 = Array.from(document.querySelectorAll('[data-section-tag*="in-the-box"] > div> div> ul >li,[data-section-caption*="In the box"] > div> div> ul >li , [data-section-caption*="In The Box"] > div> div> ul >li, '));

  //     const inTheBoxEls2 = Array.from(document.querySelectorAll('div[data-section-caption="In the box"] ul>li , div[data-section-caption="In The Box"] ul>li'));

  //     let inTheBoxEls = [];
  //     if (inTheBoxEls1) {
  //       inTheBoxEls = inTheBoxEls1;
  //     } else {
  //       inTheBoxEls = inTheBoxEls2;
  //     }
  //     inTheBoxEls.forEach(el => {
  //       const image = el.querySelector('img').getAttribute('src');
  //       // @ts-ignore
  //       const text = el.innerText;
  //       inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + image;
  //       inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + text;
  //     });
  //   }
  //   document.body.setAttribute('has-comparison-table', hasComparisonTable);
  //   document.body.setAttribute('in-the-box-text', inTheBoxText);
  //   document.body.setAttribute('in-the-box-url', inTheBoxUrl);
  // });
  // const delay = async function delayfunc (time) {
  //   await new Promise(r => setTimeout(r, time));
  // };
  // new WITB
  await context.evaluate(async function () {
    // const syndiPowerpage = document.querySelector('div.syndi_powerpage.syndigo-shadowed-powerpage');
    let inTheBoxText = '';
    let inTheBoxUrl = '';
    var witb = document.querySelector('div.syndi_powerpage.syndigo-shadowed-powerpage');
    try {
      witb.scrollIntoView();
    } catch (err) {
      console.log('cannot scroll');
    }
    var new1 = [...witb.shadowRoot.querySelectorAll('div.syndigo-powerpage-grid-widget')].filter(el => !!el.querySelector('h2').innerText.includes('In the box'));
    try {
      new1[0].scrollIntoView();
    } catch (err) {
      console.log('cannot scroll');
    }
    if (new1) {
      console.log('new1: present' + new1.length);
    }
    var retry = 0;
    while (new1[0].querySelectorAll('h3').length === 0 && retry < 3) {
      console.log('264 Texts:' + new1[0].querySelectorAll('h3').length);
      // delay(5000);
      await new Promise(resolve => setTimeout(resolve, 5000));
      retry += 1;
    }
    new1[0].querySelectorAll('h3').forEach(el => {
      inTheBoxText = inTheBoxText + (inTheBoxText ? ' || ' : '') + el.innerText;
    });
    new1[0].querySelectorAll('img').forEach(el => {
      inTheBoxUrl = inTheBoxUrl + (inTheBoxUrl ? ' || ' : '') + el.getAttribute('src');
    });
    document.body.setAttribute('in-the-box-text', inTheBoxText);
    document.body.setAttribute('in-the-box-url', inTheBoxUrl);
  });
  console.log('working till here');

  const carrouselSelector = '[certonaidentifier="recommendation_pdp_cav"] [data-locator="certona_rightnavigationicon"]';
  await helper.ifThereClickOnIt(`${carrouselSelector} > button`);
  for (let attempts = 0; attempts < 3; attempts++) {
    if (helper.checkSelector(`${carrouselSelector} > [disabled]`, 'CSS')) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await helper.ifThereClickOnIt(`${carrouselSelector} > button`);
  }

  const enhancedContent = await helper.checkSelector('#syndi_powerpage>div', 'CSS');

  if (enhancedContent) {
    // close the zoom image
    await helper.ifThereClickOnIt('.rclCloseBtnWrapper');
    await context.evaluate(async () => {
      const shadow = document.querySelector('#syndi_powerpage>div').shadowRoot;
      // @ts-ignore
      const videos = [...shadow.querySelectorAll('video')];

      // monkey patch ajax calls
      const originalRequestOpen = XMLHttpRequest.prototype.open;
      const response = [];
      XMLHttpRequest.prototype.open = function () {
        if (arguments[0] === 'GET' && arguments[1].includes('https://content.syndigo.com/asset/') && arguments[1].endsWith('.ts')) {
          response.push(arguments[1]);
        }
        originalRequestOpen.apply(this, arguments);
      };

      await Promise.all(videos.map(async (vid) => {
        vid.click();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        vid.click();
      }));

      await new Promise(resolve => setTimeout(resolve, 5e3));
      XMLHttpRequest.prototype.open = originalRequestOpen;

      // @ts-ignore
      const images = [...shadow.querySelectorAll('div[class*="syndigo"] img')].map(im => im.getAttribute('src'));
      document.querySelector('body').setAttribute('manu-imgs', images.join(' | '));
      // @ts-ignore
      const description = [...shadow.querySelectorAll('div[class*="syndigo"]')]
        .filter(div => div.innerText)
        .map(div => div.innerText);
      document.querySelector('body').setAttribute('manu-desc', description[0]);

      document.querySelector('body').setAttribute('manu-videos', [...new Set(response)].join(' | '));
    });
  }

  const { transform: transformParam } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform: transformParam });
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
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },
  implementation,
};
