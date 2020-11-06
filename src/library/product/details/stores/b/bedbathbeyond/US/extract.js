const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform,
    domain: 'bedbathbeyond.us',
    zipcode: '',
  },
};
