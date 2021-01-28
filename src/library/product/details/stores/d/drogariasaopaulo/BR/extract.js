
const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogariasaopaulo',
    transform: transform,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = "a.collection-image-link";
    const cssProductDetails = 'body';
    const { transform } = parameters;
    const { productDetails, Helpers: { Helpers } } = dependencies;
    const helper = new Helpers(context);

    await context.waitForSelector(cssProduct, { timeout: 10000 });
    const productAvailable = await helper.checkSelector(cssProduct, 'CSS');
    console.log(`product available: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await helper.ifThereClickOnIt(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await helper.checkSelector(cssProductDetails, 'CSS');
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
    }
    await context.extract(productDetails, { transform });
  },
};
