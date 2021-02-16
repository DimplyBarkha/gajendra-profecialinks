const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'planetazdorovo',
    transform,
    domain: 'planetazdorovo.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const firstItemLink = await context.evaluate(async function () {
      const listPresent = document.querySelector('div.card-list');
      if (listPresent) {
        return document.querySelectorAll('div.card-list div.card-list__row div.card-list__element a.product-card__image')[0] && document.querySelectorAll('div.card-list div.card-list__row div.card-list__element a.product-card__image')[0].href;
      }
    });
    if (firstItemLink) {
      await context.goto(firstItemLink, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      context.waitForNavigation();
    }
    return await context.extract(productDetails, { transform });
  },
};
