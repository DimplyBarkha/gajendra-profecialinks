const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    transform: transform,
    domain: 'stakelums.ie',
    zipcode: '',
  },
};
