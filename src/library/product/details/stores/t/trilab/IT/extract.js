const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'trilab',
    transform,
    domain: 'trilab.it',
    zipcode: '',
  },
};
