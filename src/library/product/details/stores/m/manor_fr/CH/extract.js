const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor_fr',
    transform: transform,
    domain: 'manor_fr.ch',
    zipcode: '',
  },
};
