const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    transform,
    domain: 'docmorris.de',
    zipcode: '',
  },
};
