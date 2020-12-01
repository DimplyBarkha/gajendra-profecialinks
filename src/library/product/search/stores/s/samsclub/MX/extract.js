const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'samsclub',
    transform,
    domain: 'sams.com.mx',
    zipcode: "''",
  },
};
