const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = '.product-header';
    const cssProductDetails = 'a[href*="opis"]';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: 10000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      const productDescAvailable = await isSelectorAvailable(cssProductDetails);
      await context.waitForSelector(cssProductDetails, { timeout: 10000 });
      if (productDescAvailable) {
        await context.click(cssProductDetails);
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
        // await context.waitForSelector(cssProductDetails);
        // const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
        console.log(`productDescAvailable: ${productDescAvailable}`);
        if (!productDescAvailable) {
          //  throw new Error('ERROR: Failed to load product details page');
        }
        console.log('navigation complete!!');
      }
    }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
