const {transform} = require('./format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    transform,
    domain: 'edigital.hu',
    zipcode: '',
  },  
};
