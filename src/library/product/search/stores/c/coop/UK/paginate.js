
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    nextLinkSelector: 'li.ais-pagination__item.ais-pagination__item--next a.ais-pagination__link',
    mutationSelector: 'body',
    spinnerSelector: null,
    loadedSelector: 'article.coop-l-flex__item',
    noResultsXPath: '//h2[contains(text(),"Sorry we could not find what you were searching for")]',
    openSearchDefinition: null,
    domain: 'coop.co.uk',
    zipcode: "''",
  },
};
