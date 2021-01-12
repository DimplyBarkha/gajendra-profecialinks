
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    domain: 'brownthomas.com',
    url: 'https://www.brownthomas.com/search/?q={searchTerms}&lang=en_IE',
    loadedSelector: '*[id="product-search-result-items"] > li',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    zipcode: '',
  },
};
