const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'it',
    store: 'mediaworld',
    transform,
    domain: 'mediaworld.it',
    zipcode: '',
  },
};
