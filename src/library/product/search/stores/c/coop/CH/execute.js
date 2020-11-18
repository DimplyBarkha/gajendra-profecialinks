
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'coop',
    domain: 'coop.ch',
    url: 'https://www.coop.ch/de/search/?text={searchTerms}',
    loadedSelector: 'ul.list-page__content li',
    noResultsXPath: '//h1[contains(text(),"Leider keine Treffer")]',
    zipcode: "''",
  }, 
};
