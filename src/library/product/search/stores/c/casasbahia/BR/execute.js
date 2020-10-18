
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    domain: 'casasbahia.com.br',
    url: 'https://www.casasbahia.com.br/{searchTerms}/b',
    loadedSelector: 'ul[class*="ProductsGrid__ProductsGridWrapper"]',
    noResultsXPath: '//h2[contains(@class,"NoResultsMessage")]',
    zipcode: "''",
  },
};
