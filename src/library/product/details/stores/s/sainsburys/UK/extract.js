const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    transform,
    domain: 'sainsburys.co.uk',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // SAMPLE INPUTS - 4409412,1814333,1003226,3912234,1679670
    // CONFIGS
    const cssProduct = 'div#productLister div.productNameAndPromotions a';
    const cssProductDetails = '[data-test-id=pd-product-title]';

    const isProductAvailable = async () => {
      return await context.evaluate(function (cssProduct) {
        return !!document.querySelector(cssProduct);
      }, cssProduct);
    };

    const isProductDetailsAvailable = async () => {
      return await context.evaluate(function (cssProductDetails) {
        return !!document.querySelector(cssProductDetails);
      }, cssProductDetails);
    };

    await new Promise(resolve => setTimeout(resolve, 5000));

    const productAvailable = await isProductAvailable();
    if (productAvailable) {
      await context.click(cssProduct);
      await new Promise(resolve => setTimeout(resolve, 10000));
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isProductDetailsAvailable();
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
