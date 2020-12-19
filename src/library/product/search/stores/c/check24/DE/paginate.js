
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    // nextLinkSelector: 'button:enabled.btn-next',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="fakeresult_headline"]',
    openSearchDefinition: {
      template: 'https://shopping.check24.de/suche.html?query={searchTerms}&page={page}',
    },
    domain: 'check24.de',
    zipcode: '',
  },
};
