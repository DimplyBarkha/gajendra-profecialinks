const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'globus',
    transform,
    domain: 'globus.ch',
    zipcode: '',
  },
};
