const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    transform: transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
};
