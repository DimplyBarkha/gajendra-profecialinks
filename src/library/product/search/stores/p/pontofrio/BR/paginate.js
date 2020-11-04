
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    nextLinkSelector: null,   //'article > div[class*="Row"] > div > div > div >  button[class*="Button-sc"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article > ul[class*="ProductsGrid"]',
    noResultsXPath: '//div[contains(@class,"NoResultsMessage")]/h2[contains(@class,"Heading")]',
    openSearchDefinition: null,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
};
