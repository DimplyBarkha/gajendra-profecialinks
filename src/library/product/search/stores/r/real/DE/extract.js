const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: transform,
    domain: 'real.de',
    zipcode: '',
  },
};
