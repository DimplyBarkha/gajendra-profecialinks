
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'li.pagination__item.pagination__item--arrow',
    mutationSelector: 'li.inline-list__item.js-inline-list-item span.filtered-search__result-count',
    spinnerSelector: null,
    loadedSelector: 'div#product-results',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
