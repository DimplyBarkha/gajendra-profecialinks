
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    nextLinkSelector: 'button.btn--full[type="submit"]',
    mutationSelector: 'button.btn--full[type="submit"] ',
    spinnerSelector: null,
    loadedSelector: 'article.product-card',
    noResultsXPath: '//h2[@class="page--title" and contains(.,"No products found for")]',
    openSearchDefinition: null,
    domain: 'coop.co.uk',
    zipcode: "''",
  },
};
