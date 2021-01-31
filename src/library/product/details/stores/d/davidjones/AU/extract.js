const { transform:transform1 } = require('./transform1');
const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    transform: [transform,transform1],
    domain: 'davidjones.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul > li.size-0 > input').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform:transform[0] });
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.click(`ul > li.size-0:nth-child(${index})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (variantCount !== index) {
          await context.extract(productDetails, { type: 'APPEND', transform:transform[0]  });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform:transform[1]  });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants',error);
      }
    }
  },
};
