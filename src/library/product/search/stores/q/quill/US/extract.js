const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'quill',
    transform,
    domain: 'quill.us',
    zipcode: '',
  },
};
