const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: null,
    domain: 'euronics.it',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const url = new URL(window.location.href);
      const p = url.searchParams.get('p');
      const page = p || 1;
      const product = document.querySelectorAll('div.productCard.j-productCard');
      const pi = 16;
      for (let i = 0; i < product.length; i++) {
        const rank = (page * pi) - (pi - 1) + i;
        product[i].querySelector('#log_position').setAttribute('rank', rank);
        product[i].querySelector('#log_position').setAttribute('organic', rank);
      }
      const productOrganic = document.querySelectorAll('.productCard__content>div.productCard.j-productCard');
      const po = 12;
      for (let i = 0; i < productOrganic.length; i++) {
        const rankOrganic = (page * po) - (po - 1) + i;
        productOrganic[i].querySelector('#log_position').setAttribute('organic', rankOrganic);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
