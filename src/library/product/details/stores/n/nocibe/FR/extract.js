
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
    const checkExistance = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return Boolean(document.querySelector(currentSelector));
      }, selector);
    };

    const url = await context.evaluate(async () => {
      // @ts-ignore
      if (window !== undefined) {
        return window.location.href;
      }
    });
    // extracting video
    const iframeSelector = 'div[class*="video-inner"] iframe';
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    if (await checkExistance(iframeSelector)) {
      const iframeUrl = await context.evaluate((iframeSelector) => {
        return document.querySelector(iframeSelector).getAttribute('src');
      }, iframeSelector);
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForXPath('//link[@rel="canonical"][contains(@href, "youtube")]');
      const video = await context.evaluate(() => {
        const src = ele('link[rel="canonical"][href*="youtube"]');
        function ele (tag) {
          return document.querySelectorAll(tag);
        }
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].getAttribute('href'));
          }
        }
        return value;
      });

      await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.evaluate((video) => {
        video = video.join(' | ');
        document.querySelector('body').setAttribute('video-src', video);
      }, video);
    }

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

      const altImgSrc = document.querySelectorAll('div[class="prdct__top"] div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img, div[class="prdct__top"] div[class="prdct__gallery-img  prdct__gallery-img-odd"] div[class="prdct__gallery-slide"]:not(:first-child), div[class="prdct__top"] div[class="prdct__gallery-img  soldout disabled"] div[class="prdct__gallery-slide"]:not(:first-child) img')
        ? document.querySelectorAll('div[class="prdct__top"] div[class="prdct__gallery-img "] div[class="prdct__gallery-slide"]:not(:first-child) img, div[class="prdct__top"] div[class="prdct__gallery-img  prdct__gallery-img-odd"] div[class="prdct__gallery-slide"]:not(:first-child), div[class="prdct__top"] div[class="prdct__gallery-img  soldout disabled"] div[class="prdct__gallery-slide"]:not(:first-child) img') : [];
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

      const descriptionBullets = document.querySelector('h3[class="prdct__details-title"] + p ')
        // @ts-ignore
        ? document.querySelector('h3[class="prdct__details-title"] + p ').innerText : '';
      let count = 0;
      if (descriptionBullets !== undefined && descriptionBullets !== null) {
        descriptionBullets.split('\n').forEach(e => {
          if (e.charAt('-') === '-') count++;
        });
      }
      addElementToDocument('bulletcount', count);
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
