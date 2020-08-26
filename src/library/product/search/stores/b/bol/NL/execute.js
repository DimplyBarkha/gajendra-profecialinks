
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    url: `https://www.bol.com/nl/s/?searchtext={searchTerms}&searchContext=media_all&appliedSearchContextId=&suggestFragment=&adjustedSection=&originalSection=&originalSearchContext=&section=main&N=0&defaultSearchContext=media_all`,
    loadedSelector: `ul.list-view.product-list`,
    noResultsXPath: `//div[@data-test='no-result-content']`,
    zipcode: '',
  },
};
