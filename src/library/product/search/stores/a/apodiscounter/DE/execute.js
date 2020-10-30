
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    domain: 'apodiscounter.de',
    url: 'https://www.apodiscounter.de/advanced_search_result.php?keywords={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
