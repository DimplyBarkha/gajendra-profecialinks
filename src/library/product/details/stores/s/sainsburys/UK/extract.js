
const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'groceries.asda.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = 'div.productInfo h3 a';
    const xpathSelector = '//div[contains(@class,"productInfo")]//h3//a//img/@src';
    const brandSelector = '//div[@class="input"]//label[@for="topBrands0"]';
    const noResultsXpath = '//div[@class="noFlexComponent"]//p[contains(.,"Sorry")]';
    const cssProductDetails = '[data-test-id=pd-product-title]';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');

    const isProductAvailable = async (noResultsXpath) => {
      console.log(`Is upc selector available: ${noResultsXpath}`);
      return await context.evaluate(function (noResultsXpath) {
        return document.evaluate(noResultsXpath, document).iterateNext();
      }, noResultsXpath);
    };
    const noResults = await isProductAvailable(noResultsXpath);
    if (noResults) {
      throw new Error('Product Not Found');
    }

    await context.waitForSelector(cssProduct, { timeout: 20000 });

    const isAvailable = async (xpathSelector) => {
      console.log(`Is selector available: ${xpathSelector}`);
      return await context.evaluate(function (xpathSelector) {
        return document.evaluate(xpathSelector, document).iterateNext().textContent;
      }, xpathSelector);
    };

    const upc = await isAvailable(xpathSelector);
    const brand = await isAvailable(brandSelector);
    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await context.click(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
      await context.evaluate(async function (upcValue, brandValue) {
        const eanGtin = document.createElement('div');
        eanGtin.id = 'eanValue';
        eanGtin.textContent = upcValue;
        document.body.appendChild(eanGtin);
        const brandEle = document.createElement('div');
        brandEle.id = 'brandValue';
        brandEle.textContent = brandValue;
        document.body.appendChild(brandEle);
      }, upc, brand);
      console.log('navigation complete!!');
    };
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
