const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'ottooffice',
    transform: cleanUp,
    domain: 'otto-office.com',
    zipcode: '',
  },
};
