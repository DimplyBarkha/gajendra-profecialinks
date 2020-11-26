const {transform} = require('../US/format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    transform,
    domain: 'tractorsupply.com',
    zipcode: '',
  },
};
