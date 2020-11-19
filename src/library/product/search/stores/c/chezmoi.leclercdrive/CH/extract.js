const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'chezmoi.leclercdrive',
    transform: cleanUp,
    domain: 'chezmoi.leclercdrive.fr',
    zipcode: '',
  },
};
