
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon10023',
    transform,
    domain: 'amazon.com',
  },
};
