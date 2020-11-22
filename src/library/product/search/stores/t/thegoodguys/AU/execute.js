module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    domain: 'thegoodguys.com.au',
    url: 'https://www.thegoodguys.com.au/SearchDisplay?categoryId=&storeId=900&catalogId=30000&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&orderBy=0&pageSize=60&searchTerm={searchTerms}',
    loadedSelector: '#product_listing_tab>ul>li:last-child',
    noResultsXPath: '//*[contains(@class,"results_description")]',
    zipcode: '',
  },
};
