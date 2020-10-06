const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'joyces',
    transform: transform,
    domain: 'joyces.ie',
    zipcode: '',
  },
 };
