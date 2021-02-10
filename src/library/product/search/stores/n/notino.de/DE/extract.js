const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform,
    domain: 'notino.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async () => {      
      while (document.querySelector('a[class="btn btn--secondary"]')) {
        // @ts-ignore
        document.querySelector('a[class="btn btn--secondary"] ').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};

