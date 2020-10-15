
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'calphalon',
    domain: 'calphalon.com',
    url: 'https://www.calphalon.com/webapp/wcs/stores/servlet/SearchDisplay?categoryId=&storeId=60051&catalogId=60051&langId=-1&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=12&searchTerm={searchTerms}',
    loadedSelector: 'section.product-grid',
    noResultsXPath: "//p[contains(text(),' did not return any results.')]",
    zipcode: '',
  },
};
