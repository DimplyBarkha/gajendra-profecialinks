const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    transform: cleanUp,
    domain: 'stakelums.ie',
    zipcode: '',
  },
};
