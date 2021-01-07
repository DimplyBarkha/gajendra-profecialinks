
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    domain: 'promofarma.com',
    url: 'https://www.promofarma.com/es/search?q={searchTerms}',
    // loadedSelector: 'body',
    noResultsXPath: "//div[@class='box-white not-found-box mb-2']",
    zipcode: '',
  },
};
