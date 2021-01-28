
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    domain: 'marionnaud.at',
    // url: 'https://www.marionnaud.at/search/results?page=0&resultsForPage=20&q={searchTerms}',
    url: 'https://www.marionnaud.at/search?text={searchTerms}',
    loadedSelector: 'div.container-fluid',
    noResultsXPath: '//section[contains(@data-id,"emptySearchResult")] | //div[contains(@class,"matrix ")][div/a[contains(@class,"GTM_Product_matrix")]]',
    zipcode: '',
  },
};
