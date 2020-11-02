const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.dk',
    zipcode: '',
  },
};
