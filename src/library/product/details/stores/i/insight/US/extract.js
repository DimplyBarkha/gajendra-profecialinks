const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'insight',
    transform,
    domain: 'insight.com',
    zipcode: "''",
  },
};