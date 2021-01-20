const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    urlTemplate: null,
    resultsCountSelector: null,
    numberResultPerPage: null,
    regExpForIdFromUrl: null,
    transform,
    domain: 'shop.njoy.com',
    zipcode: '',
  },
};
