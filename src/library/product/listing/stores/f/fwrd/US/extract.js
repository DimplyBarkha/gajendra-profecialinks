const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    urlTemplate: '{id}&pageNum={page}',
    resultsCountSelector: 'span.js-item-count',
    numberResultPerPageXPath: "count(//*[@id='plp-product-list']//ul[contains(@class,'product-grids')]/li)",
    /* eslint-disable */
    regExpForIdFromUrl: '(?<=com\/).*$',
    /* eslint-enable */
    transform,
    domain: 'fwrd.com',
    zipcode: '',
  },
};
