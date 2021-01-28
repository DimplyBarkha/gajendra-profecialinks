
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vons',
    domain: 'vons.com',
    url: 'https://www.vons.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: 'div[class="asidediv col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
