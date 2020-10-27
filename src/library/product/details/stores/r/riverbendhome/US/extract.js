const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    transform,
    domain: 'riverbendhome.com',
    zipcode: "''",
  },
};
