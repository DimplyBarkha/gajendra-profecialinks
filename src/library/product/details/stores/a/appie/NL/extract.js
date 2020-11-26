const { transform } = require('../../../../stores/a/appie/NL/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'appie',
    transform,
    domain: 'appie.nl',
    zipcode: '',
  },
};
