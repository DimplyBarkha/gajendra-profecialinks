const { transform } = require('./../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    transform,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
};
