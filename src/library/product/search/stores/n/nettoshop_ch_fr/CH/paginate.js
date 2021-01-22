
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'nettoshop_ch_fr',
    // nextLinkSelector: null,
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div[class="c-product-grid__item"]',
    // loadedXpath: null,
    noResultsXPath: '//h1[contains(.," 0 Résultats pour")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.nettoshop.ch/fr/search?text={searchTerms}&q=:relevance&page={page}',
    },
    domain: 'nettoshop.ch',
    zipcode: '',
  },
};
