const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: cleanUp,
    domain: 'coopvitality.ch',
    zipcode: '',
  },
};
