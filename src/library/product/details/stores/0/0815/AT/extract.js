const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: '0815',
    transform: cleanUp,
    domain: '0815.at',
    zipcode: '',
  },
};
