const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PE',
    store: 'inkafarma',
    transform,
    domain: 'inkafarma.pe',
    zipcode: '',
  },
};
