
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform,
    domain: 'wayfair.com',
    zipcode: '',
  },

  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    try {
      await context.waitForSelector('div[class*="BrowseProductCardImage"]', { timeout: 30000 });
      console.log('selector of image exist');
    } catch (e) {
      console.log("selector of image doesn't exist");
    }
    const checkSelectorExistence = async (selector) => {
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };
    const selectorExists = await checkSelectorExistence('main[id="bd"]>div:first-child ul>li:first-child p[class*="imageTitle"]');
    if (selectorExists) {
      await context.click('main[id="bd"]>div:first-child ul>li:first-child p[class*="imageTitle');
      await context.waitForNavigation({ timeout: 10000 });
      console.log('clicked the button successfully');
    }
    const categorySelectorExists = await checkSelectorExistence('div[class*="categoryList"] >div>div:first-child>div>a>div>div');
    if (categorySelectorExists) {
      await context.click('div[class*="categoryList"] >div>div:first-child>div>a>div>div');
      await context.waitForNavigation({ timeout: 10000 });
      console.log('clicked the button successfully');
    }

    await context.evaluate(() => {
      var searchUrl = window.location.href;
      var appendElements = document.querySelectorAll('div[class*="BrowseCard"]');
      if (appendElements.length) {
        appendElements.forEach((element) => {
          element.setAttribute('searchurl', searchUrl);
        });
      }
      const linkElement = document.querySelectorAll('div[class="ProductCard-container"]>a ');
      const link = [];
      linkElement.forEach((elem) => { link.push(elem.href); });
      const idFromLink = [];
      link.forEach((elem1) => {
        idFromLink.push(elem1.match(/(piid=)(\d{5,9})/g));
      });
      const skuElement = document.querySelectorAll('a[class*="ProductCard"]');
      const skuBucket = [];
      skuElement.forEach((elem1) => {
        skuBucket.push(elem1.getAttribute('data-sku'));
      });
      const id = [];
      for (let i = 0; i < idFromLink.length; i++) {
        if (idFromLink[i] != null) {
          id.push(idFromLink[i][0].match(/\d+/g));
        } else {
          id.push(idFromLink[i]);
        }
      }
      const appendDiv = document.querySelectorAll('div[class*="BrowseCard"]');
      for (let i = 0; i < appendDiv.length; i++) {
        let sku = '';
        if (id[i] != null) {
          sku = id[i][0];
        } else {
          sku = skuBucket[i];
        }
        appendDiv[i].setAttribute('skudetail', sku);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
