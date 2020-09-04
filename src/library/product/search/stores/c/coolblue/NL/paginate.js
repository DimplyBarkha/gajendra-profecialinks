
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'div[class="pagination-wrapper"] li[class="pagination__item pagination__item--arrow"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")] | //h1[contains(text(),"Alles over Dyson producten")]',
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
