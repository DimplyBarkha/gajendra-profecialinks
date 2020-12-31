const { transform } = require('../../nespressoTransform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'nesspresso_at_de',
    transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
