const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    transform: transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
};
