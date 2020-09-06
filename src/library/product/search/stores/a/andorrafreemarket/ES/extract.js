const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    transform: transform,
    domain: 'andorrafreemarket.com',
    zipcode: '',
  },
};
