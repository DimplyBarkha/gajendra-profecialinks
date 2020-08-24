const { transform } = require('../FR/shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let clickLoadMore = document.querySelector('button.paragraph-truncate__see-more');
      // @ts-ignore
      clickLoadMore = clickLoadMore ? clickLoadMore.click() : '';
    })
    return await context.extract(productDetails, {transform});
  }
};

