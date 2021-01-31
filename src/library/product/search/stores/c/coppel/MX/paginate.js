
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    nextLinkSelector: 'button#WC_SearchBasedNavigationResults_pagination_link_right_categoryResults',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 12,
      template: 'https://www.coppel.com/SearchDisplay?categoryId=&storeId=12761&catalogId=10001&langId=-5&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex={offset}&pageSize=12&searchTerm={searchTerms}#facet:&productBeginIndex:12&orderBy:&pageView:list&minPrice:&maxPrice:&pageSize:&',
    },
    domain: 'coppel.com',
    zipcode: '',
  },
};
