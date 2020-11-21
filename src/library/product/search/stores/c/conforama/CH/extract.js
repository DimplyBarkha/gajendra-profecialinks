const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    transform: transform,
    domain: 'conforama.ch',
    zipcode: '',
  },
};
