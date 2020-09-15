const {transform} = require('./format.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
