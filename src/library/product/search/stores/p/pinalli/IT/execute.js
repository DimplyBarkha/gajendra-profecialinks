
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'pinalli',
    domain: 'pinalli.it',
    url: 'https://www.pinalli.it/prodotti?q={searchTerms}',
    loadedSelector: '.uk-grid',
    noResultsXPath: '//div[@data-uk-rr-algolia="no-results"]/div[contains(text(),"Nessun")]',
    zipcode: '',
  },
};
