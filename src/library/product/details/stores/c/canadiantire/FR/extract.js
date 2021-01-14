const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca/fr.html',
    zipcode: '',
  },
};
