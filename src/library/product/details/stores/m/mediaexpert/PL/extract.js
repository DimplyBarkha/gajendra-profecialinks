const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: '',
  },
};
