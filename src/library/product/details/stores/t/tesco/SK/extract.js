const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'tesco',
    transform,
    domain: 'tesco.sk',
    zipcode: '',
  },
};
