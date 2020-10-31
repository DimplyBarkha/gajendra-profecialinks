const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variantArray = await context.evaluate(async function () {
    if(document.querySelector('#productList')) {
      throw new Error('Not a product page');
    }
    if (document.querySelectorAll('div.clearfix.custom-dropdown-content button')) {
      const variantArray = document.querySelectorAll('div.clearfix.custom-dropdown-content button');
      return variantArray;
    }
  });
  if (variantArray) {
    for (let i = 0; i < variantArray.length; i++) {
      variantArray[i].click();
      await context.waitForSelector('div.pdp-filter-thumbnail');
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    transform,
    domain: 'laredoute.fr',
    zipcode: '',
  },
  implementation,
};
