const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'capraboacasa',
    transform: transform,
    domain: 'capraboacasa.com',
    zipcode: "''",
  },
};
