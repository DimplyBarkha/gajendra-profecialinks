const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    transform,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul.selection-list.ps > li').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.click(`ul.selection-list.ps > li:nth-child(${index})`);
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
