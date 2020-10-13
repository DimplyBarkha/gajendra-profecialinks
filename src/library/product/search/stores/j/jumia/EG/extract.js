const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    transform,
    domain: 'jumia.com.eg',
    zipcode: '',
  },
};
