const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'williams-sonoma',
    transform,
    domain: 'williams-sonoma.com',
    zipcode: "''",
  },
};
