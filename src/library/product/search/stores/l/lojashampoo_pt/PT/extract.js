const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'lojashampoo_pt',
    transform: transform,
    domain: 'lojashampoo.pt',
    zipcode: '',
  },
};
