const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const timeout = parameters.timeout ? parameters.timeout : 10000;
  await context.waitForFunction(
    () => {
      return document.querySelector('.bv-off-screen');
    },
    { timeout, }
  );
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    transform,
    timeout: 40000,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
