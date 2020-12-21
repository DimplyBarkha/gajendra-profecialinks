
const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'smythstoys',
    transform,
    domain: 'smythstoys.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      // const popUps = document.querySelector('button.cookieProcessed').click();
      // if (popUps) {
      //   popUps.click();
      // }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
