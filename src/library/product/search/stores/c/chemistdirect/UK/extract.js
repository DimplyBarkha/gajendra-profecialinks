var { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    transform,
    domain: 'chemistdirect.co.uk',
    zipcode: '',
  },
};
