const {transform} = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    transform,
    domain: 'fany.cz',
    zipcode: '',
  },
};
