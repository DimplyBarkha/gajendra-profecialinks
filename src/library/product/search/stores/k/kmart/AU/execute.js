
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    domain: 'kmart.com.au',
    url: 'https://www.kmart.com.au/webapp/wcs/stores/servlet/SearchDisplay?searchTerm={searchTerms}&categoryId=&storeId=10701&catalogId=10102&langId=-1&beginIndex=0&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=#.plp-wrapper',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};