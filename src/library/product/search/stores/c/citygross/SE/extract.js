const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'citygross',
    transform: transform,
    domain: 'citygross.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async () => {
      while (document.querySelector('div[class="c-loadmore__button"] button')) {
        // @ts-ignore
        document.querySelector('div[class="c-loadmore__button"] button').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
