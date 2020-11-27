const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'thewarehouse',
    transform,
    domain: 'thewarehouse.co.nz',
    zipcode: '',
  },
};
