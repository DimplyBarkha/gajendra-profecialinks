const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'zalando',
    transform,
    domain: 'zalando.it',
    zipcode: '',
  },
};
