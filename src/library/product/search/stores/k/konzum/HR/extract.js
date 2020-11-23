const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HR',
    store: 'konzum',
    transform,
    domain: 'konzum.hr',
    zipcode: '',
  },
};
