const {transform} = require('../CO/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'farmatodo',
    transform : null,
    domain: 'farmatodo.com.co',
    zipcode: '',
  },
};
