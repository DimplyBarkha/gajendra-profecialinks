const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    transform,
    domain: 'grofers.com',
    zipcode: "''",
  },
};
