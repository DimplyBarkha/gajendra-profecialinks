
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'april',
    transform: transform,
    domain: 'april.co.il',
    zipcode: '',
  },
 
  };