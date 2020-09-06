const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'fr',
    store: 'ubaldi',
    transform: transform,
    domain: 'ubaldi.com',
    zipcode: "''",
  },
};
