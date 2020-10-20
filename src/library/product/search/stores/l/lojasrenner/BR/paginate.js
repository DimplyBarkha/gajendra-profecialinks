
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    nextLinkSelector: 'i[class="arrow_right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="wrapper results-list"]',
    noResultsXPath: '//div[contains(@class , "no_result")]',
    openSearchDefinition: null,
    domain: 'lojasrenner.com.br',
    zipcode: '',
  },
};
