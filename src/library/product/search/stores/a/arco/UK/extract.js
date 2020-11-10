const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    transform,
    domain: 'arco.uk',
    zipcode: '',
  },
implementation: async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
},
};