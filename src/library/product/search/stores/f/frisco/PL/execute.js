
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    domain: 'frisco.pl',
    url: 'https://commerce.frisco.pl/api/offer/products/query?includeCategories=true&pageIndex=1&search={searchTerms}&deliveryMethod=Van&pageSize=150&language=pl&facetCount=150&includeWineFacets=false#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'body',
    noResultsXPath: null,
  },
};
