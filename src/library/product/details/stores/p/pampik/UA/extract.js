const {transform} = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    transform,
    domain: 'pampik.com',
    zipcode: '',
  },
};
