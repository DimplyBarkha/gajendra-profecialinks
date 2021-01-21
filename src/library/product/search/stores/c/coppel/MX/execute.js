module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    domain: 'coppel.com',
    url: 'https://www.coppel.com/SearchDisplay?categoryId=&storeId=12761&catalogId=10001&langId=-5&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=12&searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="widget_search_results_position"]/div[@class="widget_search_results text-center"]/div[@class="description"]/div[@class="specification_text"]',
    zipcode: '',
  }
};
