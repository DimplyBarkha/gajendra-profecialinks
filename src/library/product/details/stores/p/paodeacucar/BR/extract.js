const { cleanUp } = require('../../../../shared');
const implementation = async (inputs, parameters, context, dependencies) => {
  const { cleanUp } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('.product-cardstyles__Container-sc-1uwpde0-1.eaVrql');
  async function firstItemLink () {
    return await context.evaluate(function () {
      const firstItem = document.querySelector('.product-cardstyles__Container-sc-1uwpde0-1.eaVrql > a').href;
      return firstItem;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  }
  return await context.extract(productDetails, { cleanUp });
};
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    transform: cleanUp,
    domain: 'paodeacucar.com',
    zipcode: '',
  },
  implementation,
};
