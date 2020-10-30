const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    transform: transform,
    domain: 'meijer.com',
    zipcode: '',
  },
};
