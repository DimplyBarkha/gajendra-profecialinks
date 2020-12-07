module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasguadalajara',
    domain: 'farmaciasguadalajara.com',
    url:
      'https://www.farmaciasguadalajara.com/SearchDisplay?categoryId=&storeId=10151&catalogId=10052&langId=-24&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=150&searchTerm={searchTerms}&#facet:&productBeginIndex:40&facetLimit:&orderBy:&pageView:grid&minPrice:&maxPrice:&pageSize:&',
    loadedSelector: null,
    noResultsXPath: "//div[@class='widget_search_results_position']",
    zipcode: '',
  },
};
