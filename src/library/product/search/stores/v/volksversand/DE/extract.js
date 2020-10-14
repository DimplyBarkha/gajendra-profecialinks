const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'volksversand',
    transform,
    domain: 'volksversand.de',
    zipcode: "''",
  },
};
