const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
};
