const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'telus',
    transform,
    domain: 'telus.com',
    zipcode: "''",
  },
};
