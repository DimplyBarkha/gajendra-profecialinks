
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    // nextLinkSelector: 'div[class*="LoadMore__Wrapper"] button',
    // mutationSelector: 'div[class*="Loader__LoaderIcon"]',
    // spinnerSelector: 'div[class*="Loader__LoaderIcon"]',
    loadedSelector: 'ul[class*="ProductsGrid__ProductsGridWrapper"] li',
    noResultsXPath: '//h2[contains(@class,"NoResultsMessage")]',
    openSearchDefinition: null,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
};
