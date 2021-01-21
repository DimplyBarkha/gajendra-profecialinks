
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class*="c-product-list-container-products"] li:last-child ',
    noResultsXPath: '//p[contains(@class,"c-search-result-no-suggestion__heading")] | //p[contains(text(),"Site en maintenance")]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.cora.fr/recherche?keywords={searchTerms}&pageindex={page}',
    },
    domain: 'coradrive.fr',
    zipcode: '',
  },
};
