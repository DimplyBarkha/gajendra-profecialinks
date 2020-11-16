const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    transform,
    domain: 'liquorland.com.au',
    zipcode: '',
  },
};
