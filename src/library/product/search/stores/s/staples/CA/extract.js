const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    transform,
    domain: 'staples.ca',
    zipcode: "''",
  },
};
