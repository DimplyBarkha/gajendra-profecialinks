const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'Realcanadiansuperstore',
    transform: cleanUp,
    domain: 'realcanadiansuperstore.ca',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    if (inputs.zipcode || inputs.storeId) {
      await context.evaluate((inputs) => {
        document.body.setAttribute('drive', inputs.zipcode);
        document.body.setAttribute('retailer', inputs.storeId);
      }, inputs);
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
