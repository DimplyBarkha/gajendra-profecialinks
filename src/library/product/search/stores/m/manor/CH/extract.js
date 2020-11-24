const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
