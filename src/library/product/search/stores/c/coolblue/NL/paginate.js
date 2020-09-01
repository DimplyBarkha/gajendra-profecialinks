
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'div[class="pagination-wrapper"] li[class="pagination__item pagination__item--arrow"]',
    mutationSelector: 'div[class="filtered-search__result-info"] span[class="filtered-search__result-count"]',
    spinnerSelector: 'span[class="spinner-animation"]',
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
