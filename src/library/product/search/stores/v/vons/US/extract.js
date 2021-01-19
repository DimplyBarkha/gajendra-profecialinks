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
    while(!!document.querySelector('#search-grid_0 > div.col-12.bloom-load-wrapper > button')){
      document.querySelector('#search-grid_0 > div.col-12.bloom-load-wrapper > button').click()
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
