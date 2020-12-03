const { transform } = require('../../../../shared');
const { addDynamicTable, getData } = require('../sharedExtract');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productOffers } = dependencies;
  const data = await context.evaluate(getData);
  await context.evaluate(addDynamicTable, data, 'footer');
  return await context.extract(productOffers, { transform });
}
module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'UK',
    store: 'zalando',
    transform,
    domain: 'zalando.co.uk',
    zipcode: '',
  },
  implementation,
};
