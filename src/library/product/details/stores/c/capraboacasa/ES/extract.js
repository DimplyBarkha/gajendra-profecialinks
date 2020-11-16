const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'capraboacasa',
    transform: transform,
    domain: 'capraboacasa.com',
    zipcode: "''",
  },
};
