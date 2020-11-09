const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'easycoop',
    transform,
    domain: 'easycoop.it',
    zipcode: "''",
  },
};