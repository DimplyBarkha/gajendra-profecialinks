const {transform} = require('./../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    transform,
    domain: 'qoo10.jp',
    zipcode: '',
  },
};
