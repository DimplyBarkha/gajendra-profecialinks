const { transform } = require('../../../../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh_75204',
    transform,
    domain: 'amazon.com',
    zipcode: '75204',
  },
};
