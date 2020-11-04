const {transform} = require('../FI/formatFi')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.fi',
    zipcode: '',
  },
};
