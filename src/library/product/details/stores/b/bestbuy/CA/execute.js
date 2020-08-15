
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca',
    loadedSelector: 'div[class="x-product-detail-page"]',
    noResultsXPath: '//body[@id="page-not-found"]',
    zipcode: '',
  },
};
