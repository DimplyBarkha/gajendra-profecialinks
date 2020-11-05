const {transform} = require('../SE/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.se',
    zipcode: '',
  },
};
