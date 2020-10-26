const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'rossmann',
    transform,
    domain: 'rossmann.hu',
    zipcode: "''",
  },
};
