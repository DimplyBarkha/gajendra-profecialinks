const {transform} = require('../format.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'rossmann',
    transform,
    domain: 'rossmann.hu',
    zipcode: "''",
  },
};
