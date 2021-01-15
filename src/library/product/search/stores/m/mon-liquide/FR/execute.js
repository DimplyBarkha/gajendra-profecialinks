
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    domain: 'mon-liquide.fr',
    url: 'https://mon-liquide.fr/recherche?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&submit_search=',
    loadedSelector: 'ul.productOnOneLine',
    noResultsXPath: '//div[@class="container"]//p[@class="alert alert-warning"]',
    zipcode: "''",
  },
};
