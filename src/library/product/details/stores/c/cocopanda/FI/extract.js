const {transform} = require('../FI/format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.fi',
    zipcode: '',
  },
};
