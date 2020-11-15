const { transform } = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coop',
    transform: transform,
    domain: 'coop.ch',
    zipcode: "''",
  },
};
