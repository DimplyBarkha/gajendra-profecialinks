const {transform} = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'JP',
    store: 'wowma',
    transform,
    domain: 'wowma.jp',
    zipcode: '',
  },
};
