const { transform} = require('../format')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'andorrafreemarket',
    transform,
    domain: 'andorrafreemarket.com',
    zipcode: '',
  },
};
 