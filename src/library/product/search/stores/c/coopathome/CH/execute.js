
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    domain: 'coop.ch',
    url: 'https://www.coop.ch/de/search/?text={searchTerms}',
    loadedSelector: 'ul.list-page__content',
    noResultsXPath: '//h1[contains(text(),"Leider keine Treffer")]',
    zipcode: '',
  },
};
