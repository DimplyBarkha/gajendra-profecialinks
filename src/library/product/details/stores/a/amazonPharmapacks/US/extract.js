const { amazonTransform } = require('../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPharmapacks',
    transform: amazonTransform,
    domain: 'amazon.com',
  },
};
