const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    transform,
    domain: 'staples.ca',
    zipcode: "''",
  },
};
