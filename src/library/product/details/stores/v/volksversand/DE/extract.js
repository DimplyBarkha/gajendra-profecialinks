const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'volksversand',
    transform,
    domain: 'volksversand.de',
    zipcode: "''",
  },
};
