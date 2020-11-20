const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: transform,
    domain: 'flaconi.de',
    zipcode: '',
  },
};
