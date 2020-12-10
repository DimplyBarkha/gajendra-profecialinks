
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca/en-ca',
    url: 'https://www.bestbuy.ca/en-ca/search?search={searchTerms}',
    loadedSelector: 'div[class="x-page-content container_3Sp8P"] main',
    noResultsXPath: null,
    zipcode: '',
  },
};
