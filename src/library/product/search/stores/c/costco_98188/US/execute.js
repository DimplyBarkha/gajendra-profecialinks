
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    domain: 'costco.com',
    url: 'https://www.costco.com/CatalogSearch?keyword={searchTerms}',
    loadedSelector: 'div.thumbnail span.description',
    noResultsXPath: '//div[@id="no-results"][contains(.,"Try Another Search")]',
    zipcode: '',
  },
};
