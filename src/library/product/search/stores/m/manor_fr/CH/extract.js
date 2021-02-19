const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor_fr',
    transform: transform,
    domain: 'manor_fr.ch',
    zipcode: '',
  },
};
