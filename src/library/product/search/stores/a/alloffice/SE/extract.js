const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform,
    domain: 'alloffice.se',
    zipcode: '',
  },
  /*implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
    ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const productImage = 'div>img[itemprop="image"]';
    await context.waitForSelector(productImage);
    return await context.extract(productDetails, { transform });
  }*/
};
