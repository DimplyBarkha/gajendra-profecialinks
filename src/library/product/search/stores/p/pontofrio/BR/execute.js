
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    domain: 'pontofrio.com.br',
    url: 'https://www.pontofrio.com.br/{searchTerms}/b',
    loadedSelector: 'article > ul[class*="ProductsGrid"]',
    noResultsXPath: '//div[contains(@class,"NoResultsMessage")]/h2[contains(@class,"Heading")]',
    zipcode: '',
  },
};
