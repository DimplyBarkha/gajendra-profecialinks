const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    transform,
    domain: 'meny.no',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(function (inputs) {
      const element = document.evaluate("//p[contains(., 'Noe gikk galt') and contains(., 'ikke funnet')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element) {
        throw new Error('Product not found for given input');
      }
    });
    return await context.extract(productDetails);
  },
};
