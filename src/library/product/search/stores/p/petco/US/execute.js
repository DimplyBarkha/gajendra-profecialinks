
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'petco',
    domain: 'petco.us',
    url: 'https://www.petco.com/shop/SearchDisplay?categoryId=&storeId=10151&catalogId=10051&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=150&fromPageValue=search&searchKeyword=&searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
