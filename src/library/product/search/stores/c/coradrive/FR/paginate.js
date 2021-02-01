
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    nextLinkSelector: 'li[class*="c-pagination__item"] a[iconname="arrow-right"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class*="c-product-list-container-products"] li:last-child ',
    noResultsXPath: '//p[contains(@class,"c-search-result-no-suggestion__heading")] | //p[contains(text(),"Site en maintenance")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'coradrive.fr',
    zipcode: '',
  },
};
