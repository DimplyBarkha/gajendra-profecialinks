
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    transform: transform,
    domain: 'nettoshop.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // const cssProduct = 'div.c-product-detail ember-view';
    const cssProductDetails = 'div[class="c-accordion__toggle-icon"] button';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProductDetails, { timeout: 30000 });

    const productAvailable = await isSelectorAvailable(cssProductDetails);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product detail button');
      await context.click(cssProductDetails);
      await context.waitForNavigation({ timeout: 30000, waitUntil: 'load' });
      console.log('navigation complete!!');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
