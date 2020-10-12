const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    transform,
    domain: 'ica.se',
    zipcode: '10316',
  },
};
