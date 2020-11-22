const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'nicehair',
    transform,
    domain: 'nicehair.dk',
    zipcode: '',
  },
};
