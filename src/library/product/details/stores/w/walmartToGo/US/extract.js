const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    document.body.setAttribute('rpc', window.location.pathname.match(/[^\/]+$/)[0]);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmarToGo',
    transform,
    domain: 'walmart.com',
  },
  implementation,
};
