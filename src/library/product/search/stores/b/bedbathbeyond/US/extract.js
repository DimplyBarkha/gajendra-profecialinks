const {transform} = require('./format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform,
    domain: 'bedbathbeyond.us',
    zipcode: '',
  },
};
