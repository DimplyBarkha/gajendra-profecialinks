const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    transform,
    domain: 'qoo10.jp',
    zipcode: '',
  },
};
