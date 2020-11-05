const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    transform: cleanUp,
    domain: 'allbeauty.com',
    zipcode: '',
  },
};
