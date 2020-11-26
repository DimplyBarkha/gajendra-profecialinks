
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article > ul[class*="ProductsGrid"]',
    noResultsXPath: '//div[contains(@class,"NoResultsMessage")]/h2[contains(@class,"Heading")]',
    openSearchDefinition: null,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
};
