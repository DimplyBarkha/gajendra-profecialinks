
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    domain: 'shoppersdrugmart.ca',
    url: 'https://beauty.shoppersdrugmart.ca/search?text={searchTerms}',
    loadedSelector: 'ul[class="plp-product-tiles"] li:last-child > a img',
    noResultsXPath: '//div[@class="empty-search"]',
    zipcode: '',
  },
};
