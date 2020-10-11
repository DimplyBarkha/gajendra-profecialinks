const {transform} = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    transform,
    domain: 'capitalhairandbeauty.co.uk',
    zipcode: "''",
  },
};
