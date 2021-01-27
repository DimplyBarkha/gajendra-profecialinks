const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    
  // })
  // return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'JDSports',
    transform: transform,
    domain: 'jdsports.co.uk',
  },
  implementation,
};
