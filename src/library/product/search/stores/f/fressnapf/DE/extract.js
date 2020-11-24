const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    transform: transform,
    domain: 'fressnapf.de',
    zipcode: '',
  },
};
