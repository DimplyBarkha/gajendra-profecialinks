const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    while(!!document.querySelector('a.loadMoreButton')){
      document.querySelector('a.loadMoreButton').click()
      await new Promise(r => setTimeout(r, 6000));
    }
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'vons',
    transform: transform,
    domain: 'vons.com',
  },
  implementation,
};
