const {transform} = require('./shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'JP',
    store: 'wowma',
    transform,
    domain: 'wowma.jp',
    zipcode: '',
  },
};
