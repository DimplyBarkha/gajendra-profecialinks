const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    transform,
    domain: 'martinplace.romeosonline.com.au',
    zipcode: '',
  },
};
