const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'technopark',
    transform: transform,
    domain: 'technopark.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = 'a[data-tab~="specifications"]';
    const cssProductDesc = 'a[data-tab~="description"]';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: 1000000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      await context.click(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDesc, { timeout: 100000 });
      const productDescAvailable = await isSelectorAvailable(cssProductDesc);
      await stall(10000);
      if (productDescAvailable) {
        console.log('clicking product desc link');
        await context.click(cssProductDesc);
        await context.waitForNavigation({ timeout: 100000, waitUntil: 'load' });
        await context.waitForSelector(cssProductDesc);
        // const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
        // await stall(10000);
        // await context.click(cssProduct);
        // await context.waitForNavigation({ timeout: 100000, waitUntil: 'load' });
        console.log(`productDetailsAvailable: ${productDescAvailable}`);
        if (!productDescAvailable) {
          throw new Error('ERROR: Failed to load product details page');
        }
      }

      console.log('navigation complete!!');
    }

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
