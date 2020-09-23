const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    transform,
    domain: 'cyberport.at',
    zipcode: '',
  },
};
