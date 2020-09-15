const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  },
};
