
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    transform: transform,
    domain: 'dosfarma.com',
    zipcode: '',
  },
};
