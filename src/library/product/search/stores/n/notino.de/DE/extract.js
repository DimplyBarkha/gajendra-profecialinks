const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    transform,
    domain: 'notino.de',
    zipcode: '',
  },
};

