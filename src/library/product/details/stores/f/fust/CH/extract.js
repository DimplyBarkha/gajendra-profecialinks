const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    domain: 'fust.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const inputSelector = 'input[name="zipcodeorcity"]';
    await context.evaluate((inputSelector) => {
      document.querySelector(inputSelector).value = 'Bern';
    }, inputSelector);
    let searchBtn = 'button[id="searchsubmit_ondemand"]';
    searchBtn = await context.evaluate((searchBtn) => {
      if (document.querySelector(searchBtn)) { return searchBtn; }
    }, searchBtn);
    if (searchBtn) {
      await context.click(searchBtn);
      await context.waitForSelector('div[class="filialen hidden"]');
    }
    return await context.extract(productDetails, { transform });
  },
};
