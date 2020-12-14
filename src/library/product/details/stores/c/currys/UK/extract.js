const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: '',
  },
};
