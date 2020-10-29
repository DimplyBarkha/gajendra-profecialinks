
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    domain: 'cabelas.com',
    url: 'https://www.cabelas.com/shop/en/SearchDisplay?categoryId=&storeId=10651&catalogId=10551&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=16&searchTerm=6+person+tent',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
