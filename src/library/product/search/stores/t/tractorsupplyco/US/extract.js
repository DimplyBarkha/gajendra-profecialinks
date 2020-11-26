const {transform} = require('../US/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    transform,
    domain: 'tractorsupply.com',
    zipcode: '',
  },
};
