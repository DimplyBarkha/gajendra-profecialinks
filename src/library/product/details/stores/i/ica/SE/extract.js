const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    transform,
    domain: 'ica.se',
    zipcode: '10316',
  },
};
