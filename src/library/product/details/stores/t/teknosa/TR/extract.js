const { transform } = require('../shared')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform: transform,
    domain: 'teknosa.com',
    zipcode: '',
  },
  
};
