const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: transform,
    domain: 'mvideo.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('ul.c-tabs__menu-list> li:nth-child(2) > a'));
      });
      if (doesPopupExist) {
      await context.click('ul.c-tabs__menu-list> li:nth-child(2) > a');
      }
    return await context.extract(productDetails, { transform });
  },
}