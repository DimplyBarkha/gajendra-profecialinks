const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'shopmylocal',
    transform,
    domain: 'shopmylocal.com.au',
    zipcode: '2075',
  },
};
