const {transform} = require('../transform')

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
