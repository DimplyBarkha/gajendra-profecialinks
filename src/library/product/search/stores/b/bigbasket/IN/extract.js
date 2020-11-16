const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasket',
    transform,
    domain: 'bigbasket.in',
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
    await context.evaluate(async function () {
    });
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
