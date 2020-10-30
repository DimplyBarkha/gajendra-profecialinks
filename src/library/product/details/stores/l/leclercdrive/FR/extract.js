const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclercdrive',
    transform: cleanUp,
    domain: 'leclercdrive.fr',
    zipcode: '',
  },
};
