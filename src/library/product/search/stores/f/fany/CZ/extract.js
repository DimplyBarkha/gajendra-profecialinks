const {transform} = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    transform,
    domain: 'fany.cz',
    zipcode: '',
  },
};
