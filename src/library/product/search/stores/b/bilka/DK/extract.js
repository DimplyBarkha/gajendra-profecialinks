const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    transform,
    domain: 'bilka.dk',
    zipcode: '',
  },
};
