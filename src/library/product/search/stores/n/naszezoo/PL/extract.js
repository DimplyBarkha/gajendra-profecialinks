const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    transform,
    domain: 'naszezoo.pl',
    zipcode: '',
  },
};
