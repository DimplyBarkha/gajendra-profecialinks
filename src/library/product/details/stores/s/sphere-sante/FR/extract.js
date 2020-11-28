const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    transform: transform,
    domain: 'sphere-sante.com',
    zipcode: "''",
  },
};
