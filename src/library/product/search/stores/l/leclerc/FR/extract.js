const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclerc',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '',
  },
};
