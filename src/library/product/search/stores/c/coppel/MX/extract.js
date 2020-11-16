
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform: transform,
    domain: 'coppel.com',
    zipcode: '',
  },
};
