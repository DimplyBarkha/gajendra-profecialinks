module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    domain: 'carrefour.com.br',
    url: 'https://mercado.carrefour.com.br/busca/{searchTerms}',
    // loadedSelector: 'div[class*="imageContainer"]>img',
    // noResultsXPath: '//div[contains(@class,"layout")]/div[contains(@class,"searchNotFound")]',
    zipcode: '',
  },
};
