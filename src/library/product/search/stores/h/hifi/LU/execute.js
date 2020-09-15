
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    domain: 'hifi.lu',
    url: 'https://www.hifi.lu/fr/search?q={searchTerms}',
    loadedSelector: 'section[class~="products-overview"] > div[class~="row"] > div  img[class~="product-image"]',
    noResultsXPath: '//div[contains(@class,"no-result-content")]',
    zipcode: '',
  },
};
