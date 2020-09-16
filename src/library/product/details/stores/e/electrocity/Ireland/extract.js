const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'Ireland',
    store: 'electrocity',
    transform: cleanUp,
    domain: 'electrocity.ie',
    zipcode: '',
  },
};
