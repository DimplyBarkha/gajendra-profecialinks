const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    transform,
    domain: 'logicvapes.us',
    zipcode: '',
  },
};
