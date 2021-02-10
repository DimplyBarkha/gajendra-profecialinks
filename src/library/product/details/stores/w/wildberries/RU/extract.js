const { transform } = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    transform,
    domain: 'wildberries.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('div.size-list label').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
    for (let index = 1; index <= variantCount; index++) {
      try {
        await context.click(`div.size-list label:nth-of-type(${index})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (variantCount !== index) {
          await context.extract(productDetails, { type: 'APPEND', transform  });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform  });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants',error);
      }
    }
  },
};
