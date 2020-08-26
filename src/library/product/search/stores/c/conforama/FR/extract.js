const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    await context.waitForXPath('//section[contains(@id, "contentSegment")]');
  }catch(error){
    console.log('error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
