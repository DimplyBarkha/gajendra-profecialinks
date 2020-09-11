const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform,
    domain: 'mediaworld.it',
    zipcode: '',
  },
};
