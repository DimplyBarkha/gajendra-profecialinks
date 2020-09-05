
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'li.pagination__item.pagination__item--arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
