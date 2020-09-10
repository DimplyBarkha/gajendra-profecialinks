
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    nextLinkSelector: 'div[class="pagination-wrapper"] li[class="pagination__item pagination__item--arrow"] a[title*="volgende"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    openSearchDefinition: null,
    domain: 'coolblue.be',
    zipcode: '',
  },
};
