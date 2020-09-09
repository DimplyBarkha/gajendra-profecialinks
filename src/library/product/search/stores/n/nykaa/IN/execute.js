
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    url: "https://www.nykaa.com/search/result/?q={searchTerms}",
    loadedSelector: 'div[class="main-product-listing-page"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
