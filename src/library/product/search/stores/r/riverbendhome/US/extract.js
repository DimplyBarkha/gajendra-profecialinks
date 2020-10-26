const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    transform,
    domain: 'riverbendhome.com',
    zipcode: "''",
  },
};
