const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'planetazdorovo',
    transform: transform,
    domain: 'planetazdorovo.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
    await context.extract(productDetails);
  },
};
