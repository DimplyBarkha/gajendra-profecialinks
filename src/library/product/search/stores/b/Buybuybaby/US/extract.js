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
    //  await new Promise(r => setTimeout(r, 6000));
     await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'Buybuybaby',
    transform: transform,
    domain: 'buybuybaby.com',
  },
  implementation, 
};