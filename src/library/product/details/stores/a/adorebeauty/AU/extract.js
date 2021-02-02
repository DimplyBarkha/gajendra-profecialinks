const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul.product-palette > li.product-palette__item > button').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.evaluate(() => document.querySelectorAll('div[data-wps-popup-close-intent]').forEach(elm => elm.click()));
        await context.click(`ul.product-palette > li.product-palette__item:nth-child(${index}) > button`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (variantCount !== index) {
          await context.evaluate(() => document.querySelectorAll('div[data-wps-popup-close-intent]').forEach(elm => elm.click()));
          await context.extract(productDetails, { type: 'APPEND', transform });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants');
      }
    }
  },
};
