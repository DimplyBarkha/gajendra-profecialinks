
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    domain: 'apotal.de',
    url: 'https://shop.apotal.de/keywordsearch?sortBy=default&VIEW_SIZE=25&clearSearch=N&SEARCH_CATEGORY_ID=&anb=&SEARCH_STRING={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
