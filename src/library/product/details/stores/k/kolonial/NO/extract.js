const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    transform: cleanUp,
    domain: 'kolonial.no',
    zipcode: '',
  },
};
