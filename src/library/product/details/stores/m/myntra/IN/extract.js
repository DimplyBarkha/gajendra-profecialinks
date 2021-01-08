const {transform} = require('./format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform,
    domain: 'myntra.com',
    zipcode: '',
  },  
};
