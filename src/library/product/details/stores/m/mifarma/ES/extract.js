const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform,
    domain: 'mifarma.es',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await context.evaluate(() => {
      const rating = document.querySelector('.cn_product_visited > .rating_value');
      const ratingValueConverted = rating.innerHTML.replace('.', ',');
      rating.setAttribute('ratingvalueconverted', ratingValueConverted);
    });
    return await context.extract(productDetails, { transform });
  },

};
