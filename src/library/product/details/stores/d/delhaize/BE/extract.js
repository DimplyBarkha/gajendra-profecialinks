const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    transform: transform,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
