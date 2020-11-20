const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'easycoop',
    transform,
    domain: 'easycoop.it',
    zipcode: "''",
  },
};