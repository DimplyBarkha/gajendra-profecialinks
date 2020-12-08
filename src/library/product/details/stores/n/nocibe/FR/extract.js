
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: cleanUp,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const url = await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.location.href;
      }
    });

    const iFrameSrc = await context.evaluate(async () => {
      // @ts-ignore
      return document.querySelector('div[class*="video-inner"] iframe')
        // @ts-ignore
        ? document.querySelector('div[class*="video-inner"] iframe').src : '';
    });
    const iFrameContent = await context.evaluate(async () => {
      // @ts-ignore
      return document.querySelector('div[class*="video-inner"] iframe')
      // @ts-ignore
        ? document.querySelector('div[class*="video-inner"] iframe').style.height : '';
    });
    if (iFrameContent !== '8px' && iFrameSrc) {
      await context.goto(iFrameSrc);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.extract(productDetails);
      // await context.extract('/product/details/stores/n/nocibe/FR/extract', 'APPEND');
      // going back to default page
      await context.goto(url);
    };
    await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value, src) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.setAttribute('src', src);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const descripNodeList = document.querySelectorAll('div#description p')
        ? document.querySelectorAll('div#description p') : [];
      const descriptionFromMeta = document.querySelector('meta[property="og:description"]')
        ? document.querySelector('meta[property="og:description"]') : '';
      // @ts-ignore
      if (descripNodeList !== undefined && descripNodeList !== null && descripNodeList.length !== 0) {
        // @ts-ignore
        const descriptionText = [...descripNodeList].map(e => e.innerText).join(' ');
        addElementToDocument('descriptionText', descriptionText, '#');
      // @ts-ignore
      } else addElementToDocument('descriptionText', descriptionFromMeta.getAttribute('content'), '#');

      const shippingNodes = document.querySelectorAll('div[class*="ship"] div[class*="zone-txt"]')
        ? document.querySelectorAll('div[class*="ship"] div[class*="zone-txt"]') : [];
      // @ts-ignore
      const shippingInfo = [...shippingNodes].map(e => e.innerText).join(' || ');
      addElementToDocument('shippingInfo', shippingInfo, '#');
      const altImgSrc = document.querySelectorAll('div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img')
        ? document.querySelectorAll('div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img') : [];
      // @ts-ignore
      [...altImgSrc].map(e => addElementToDocument('altImgSrc', '', e.src));
      const manufacturerImgSrc = document.querySelectorAll('div[class*="pyramid-img"] img')
        ? document.querySelectorAll('div[class*="pyramid-img"] img') : [];
      // @ts-ignore
      [...manufacturerImgSrc].map(e => addElementToDocument('manufacturerImgSrc', '', e.src));
      const brandLink = document.querySelector('div[class*="prdct__logo"] a, div[class*="prdct__banner"] a')
        // @ts-ignore
        ? document.querySelector('div[class*="prdct__logo"] a, div[class*="prdct__banner"] a').href : '';
      addElementToDocument('brandLink', '', brandLink);
    });

    await context.evaluate(async function () {
      const openDirections = document.querySelector('a[href="#conseils"]');
      // @ts-ignore
      if (openDirections) {
        // @ts-ignore
        openDirections.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        const directions = document.querySelector('div#conseils >p');
        // @ts-ignore
        if (directions !== undefined && directions !== null) openDirections.setAttribute('directions', directions.innerText);
      }
    });

    await context.evaluate(async function () {
      const openIngredients = document.querySelector('a[href="#ingredients"]');
      // @ts-ignore
      if (openIngredients !== undefined && openIngredients !== null) openIngredients.click();
    });
    // await context.extract(productDetails, { transform });
    var dataRef = await context.extract(productDetails, { transform });

    dataRef[0].group.forEach((row) => {
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text ? item.text.split('|').shift().toUpperCase() : '';
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          item.text = item.text ? item.text.split('|').shift().toUpperCase() : '';
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          if (item.text.includes('avis ')) {
            item.text = item.text ? item.text.substring(item.text.lastIndexOf('sur') + 4, item.text.lastIndexOf('avis')) : '';
          } else item.text = item.text ? item.text.match(/\d+/gm) : '';
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text ? item.text.replace('.', ',') : '';
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.includes('src')) {
            item.text = item.text ? item.text.substring(item.text.lastIndexOf('https'), item.text.lastIndexOf('onload') - 2) : '';
          }
          if (!item.text.includes('https')) {
            item.text = item.text ? 'https://www.nocibe.fr'.concat(item.text) : '';
          }
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '0') item.text = '1';
        });
      }
    });

    return dataRef;
  },
};
