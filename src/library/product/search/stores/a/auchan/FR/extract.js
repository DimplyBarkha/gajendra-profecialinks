const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    transform,
    zipcode: '',
    domain: 'auchan.fr',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const detailsPageSelector = 'h1[itemprop="name"]';

    const isSelectorAvailable = async (detailsPageSelector) => {
      console.log(`Is selector available: ${detailsPageSelector}`);
      return await context.evaluate(function (detailsPageSelector) {
        return !!document.querySelector(detailsPageSelector);
      }, detailsPageSelector);
    };

    console.log('.....waiting......');

    const xpathAvailable = await isSelectorAvailable(detailsPageSelector);
    if (xpathAvailable) {
      console.log('Redirected to details page');
      throw new Error('ERROR: Loaded details page');;
    }
    return await context.extract(productDetails, { transform });

    // const { transform } = parameters;
    // const { productDetails } = dependencies;
    // await context.extract(productDetails, { transform });
  },
};

