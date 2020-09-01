
const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'target',
    transform,
    domain: 'target.com.au',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = "h3[class='name-heading'] a";
    const cssProductDetails = 'h1[itemprop="name"]';
    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    const isSearchPage = await isSelectorAvailable(cssProduct);

    if (isSearchPage) {
      console.log('.....waiting......');
      await context.waitForSelector(cssProduct, { timeout: 10000 });

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
        console.log('navigation complete!!');
      }

    } else {
      const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};

