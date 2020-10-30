
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    nextLinkSelector: 'div[class*="LoadMore__Wrapper"] button',
    mutationSelector: null,
    spinnerSelector: 'div[class*="Loader__LoaderIcon"]',
    loadedSelector: 'ul[class*="ProductsGrid__ProductsGridWrapper"]',
    noResultsXPath: '//h2[contains(@class,"NoResultsMessage")]',
    openSearchDefinition: null,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
};
