const { transform } = require('./transform');
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
