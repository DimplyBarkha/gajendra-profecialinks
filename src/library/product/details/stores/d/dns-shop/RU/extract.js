const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform,
    domain: 'dns-shop.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const { id } = inputs;

    // try {
    //   await context.setInputValue('div.container form.presearch input.ui-input-search__input', id);
    //   await context.click('div.container form.presearch div.ui-input-search__buttons span.ui-input-search__icon.ui-input-search__icon_search');
    //   await context.waitForNavigation();
    //   await context.waitForSelector('h1.page-title.price-item-title');
    // } catch (e) {
    //   console.log('Details page not found');
    // }

    await context.evaluate(async () => {
      const sideTabs = document.querySelectorAll('a.product-card-tabs__title');
      if (sideTabs) {
        for (let i = 0; i < sideTabs.length; i++) {
          if (sideTabs[i].innerText === 'Характеристики') {
            sideTabs[i].click();
          }
        }
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
