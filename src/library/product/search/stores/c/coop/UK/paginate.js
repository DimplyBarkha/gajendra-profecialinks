
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.coop-l-flex__item',
    noResultsXPath: '//h2[contains(text(),"Sorry we could not find what you were searching for")]',
    openSearchDefinition: null,
    domain: 'coop.co.uk',
    zipcode: "''",
  },
};
