const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.dk',
    zipcode: '',
  },
};
