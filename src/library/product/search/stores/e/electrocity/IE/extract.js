const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'electrocity',
    transform: transform,
    domain: 'electrocity.ie',
    zipcode: '',
  },
};
