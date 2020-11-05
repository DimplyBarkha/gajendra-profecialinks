
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    domain: 'promofarma.com',
    url: 'https://www.promofarma.com/es/search?q=lima pies',
    loadedSelector: 'body',
    noResultsXPath: "//div[@class='box-white not-found-box my-2 text-center']/h3/text()",
    zipcode: '',
  },
};
