const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
