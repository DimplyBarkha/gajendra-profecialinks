const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
};
