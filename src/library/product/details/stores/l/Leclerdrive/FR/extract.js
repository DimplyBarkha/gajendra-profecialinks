const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'Leclerdrive',
    transform: cleanUp,
    domain: 'leclercdrive.fr',
    zipcode: '982002',
  },
};
