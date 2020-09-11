const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    transform,
    domain: 'monclick.it',
    zipcode: '',
  },
};
