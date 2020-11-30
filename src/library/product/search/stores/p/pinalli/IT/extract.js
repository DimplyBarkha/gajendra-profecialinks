const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'pinalli',
    transform,
    domain: 'pinalli.it',
    zipcode: '',
  },
};
