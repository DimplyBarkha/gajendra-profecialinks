const {transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    transform,
    domain: 'capitalhairandbeauty.co.uk',
    zipcode: "''",
  },
};
